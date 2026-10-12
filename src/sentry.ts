// Sentry telemetry stub for Caelix Desktop
export const Sentry = {
    init: () => {},
    captureException: (err: unknown) => {
        console.error(err);
    },
    captureMessage: (msg: string) => {
        console.log(msg);
    },
};
