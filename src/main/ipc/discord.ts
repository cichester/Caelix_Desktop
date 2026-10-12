import * as crypto from 'crypto';
import { ipcMain } from 'electron';
import * as log from 'electron-log';
import * as net from 'net';
import { platform } from 'os';

const DISCORD_CLIENT_ID = '1419734865905057833';
const MAX_PAYLOAD_BYTES = 1024 * 1024;
const RECONNECT_DELAY_MS = 15_000;

const OpCode = {
    HANDSHAKE: 0,
    FRAME: 1,
    CLOSE: 2,
    PING: 3,
    PONG: 4,
} as const;

let socket: net.Socket | null = null;
let connected = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
const startTimestamp = Date.now();

const encode = (opcode: number, data: object): Buffer => {
    const json = JSON.stringify(data);
    const length = Buffer.byteLength(json);
    const packet = Buffer.alloc(8 + length);
    packet.writeInt32LE(opcode, 0);
    packet.writeInt32LE(length, 4);
    packet.write(json, 8, length);
    return packet;
};

const getSocketPath = (id: number): string => {
    if (platform() === 'win32') {
        return `\\\\?\\pipe\\discord-ipc-${id}`;
    }

    const prefix =
        process.env.XDG_RUNTIME_DIR ||
        process.env.TMPDIR ||
        process.env.TMP ||
        process.env.TEMP ||
        '/tmp';

    return `${prefix.replace(/\/$/, '')}/discord-ipc-${id}`;
};

const connectToSocket = (): Promise<net.Socket> => {
    return new Promise((resolve, reject) => {
        let attempt = 0;

        const tryConnect = () => {
            if (attempt > 9) {
                reject(new Error('Could not connect to Discord IPC socket'));
                return;
            }

            const socketPath = getSocketPath(attempt);
            const connection = net.createConnection(socketPath);

            const onError = () => {
                connection.removeAllListeners();
                connection.destroy();
                attempt++;
                tryConnect();
            };

            connection.once('connect', () => {
                connection.removeListener('error', onError);
                resolve(connection);
            });

            connection.once('error', onError);
        };

        tryConnect();
    });
};

const sendFrame = (data: object): void => {
    if (!socket || !connected) {
        return;
    }

    socket.write(encode(OpCode.FRAME, data));
};

export const initializeDiscord = async (): Promise<void> => {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    if (socket) {
        cleanup(false);
    }

    try {
        socket = await connectToSocket();
    } catch {
        log.warn('Discord is not running, Rich Presence will be unavailable');
        scheduleReconnect();
        return;
    }

    let incoming = Buffer.alloc(0);

    socket.on('data', (chunk: Buffer) => {
        incoming = Buffer.concat([incoming, chunk]);

        while (incoming.length >= 8) {
            const opcode = incoming.readInt32LE(0);
            const length = incoming.readInt32LE(4);

            if (length < 0 || length > MAX_PAYLOAD_BYTES) {
                log.warn(
                    `Discord IPC: invalid frame length ${length}, closing`,
                );
                cleanup();
                return;
            }

            if (incoming.length < 8 + length) {
                break;
            }

            let payload: { cmd?: string; evt?: string };
            try {
                payload = JSON.parse(
                    incoming.subarray(8, 8 + length).toString(),
                );
            } catch {
                log.warn('Discord IPC: failed to parse frame payload, closing');
                cleanup();
                return;
            }

            incoming = incoming.subarray(8 + length);

            if (opcode === OpCode.PING) {
                if (socket) {
                    socket.write(encode(OpCode.PONG, payload));
                }
                continue;
            }

            if (opcode === OpCode.CLOSE) {
                log.warn('Discord closed the IPC connection');
                cleanup();
                return;
            }

            if (opcode !== OpCode.FRAME) {
                log.warn(`Discord IPC: unexpected opcode ${opcode}`);
                continue;
            }

            if (payload.evt === 'READY' && payload.cmd === 'DISPATCH') {
                connected = true;
                log.info('Connected to Discord Rich Presence');
                setHomeActivity();
            }
        }
    });

    socket.on('close', () => {
        cleanup();
    });

    socket.on('error', (error: Error) => {
        log.warn(`Discord IPC socket error: ${error.message}`);
        cleanup();
    });

    socket.write(
        encode(OpCode.HANDSHAKE, { v: 1, client_id: DISCORD_CLIENT_ID }),
    );
};

const scheduleReconnect = (): void => {
    if (reconnectTimer) {
        return;
    }

    reconnectTimer = setTimeout(async () => {
        reconnectTimer = null;
        await initializeDiscord();
    }, RECONNECT_DELAY_MS);
};

const cleanup = (reconnect = true): void => {
    connected = false;
    if (socket) {
        socket.removeAllListeners();
        socket.destroy();
        socket = null;
    }
    if (reconnect) {
        scheduleReconnect();
    }
};

export const setHomeActivity = (): void => {
    sendFrame({
        cmd: 'SET_ACTIVITY',
        args: {
            pid: process.pid,
            activity: {
                timestamps: { start: startTimestamp },
                assets: { large_image: 'icon-v1' },
                instance: false,
            },
        },
        nonce: crypto.randomUUID(),
    });
};

export const setGameActivity = (gameName: string): void => {
    sendFrame({
        cmd: 'SET_ACTIVITY',
        args: {
            pid: process.pid,
            activity: {
                details: 'In Game',
                state: gameName,
                timestamps: { start: startTimestamp },
                assets: { large_image: 'icon-v1' },
                instance: false,
            },
        },
        nonce: crypto.randomUUID(),
    });
};

export const clearActivity = (): void => {
    sendFrame({
        cmd: 'SET_ACTIVITY',
        args: { pid: process.pid },
        nonce: crypto.randomUUID(),
    });
};

ipcMain.on('discord-rpc', (_event, args) => {
    const messageType = args[0];
    switch (messageType) {
        case 'home': {
            setHomeActivity();
            break;
        }
        case 'game': {
            const gameName: string | undefined = args[1];
            if (gameName) {
                setGameActivity(gameName);
            } else {
                log.warn('Game name not sent with discord-rpc game message.');
            }
            break;
        }
        case 'clear': {
            clearActivity();
            break;
        }
        default: {
            log.warn(`Unexpected discord-rpc message type: ${messageType}`);
        }
    }
});
