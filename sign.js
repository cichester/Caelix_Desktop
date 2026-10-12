/**
 * electron-builder custom Windows signing hook.
 *
 * Signs the Windows artifacts with Azure Trusted Signing via jsign. The app is
 * built on a macOS runner, where electron-builder's native azureSignOptions is
 * unavailable because it drives the Windows-only Invoke-TrustedSigning module.
 * jsign is the cross-platform path and only needs a JRE (set up in CI).
 *
 * Trusted Signing certificates are valid for ~3 days, so jsign enables RFC 3161
 * timestamping automatically. The access token is short-lived (~2h) and is
 * minted by the deploy script immediately before the build.
 * @see https://www.electron.build/code-signing-win
 */
exports.default = function sign(configuration) {
    const endpoint = process.env.AZURE_CODESIGN_ENDPOINT;
    const account = process.env.AZURE_CODESIGN_ACCOUNT;
    const profile = process.env.AZURE_CODESIGN_PROFILE;

    const missing = [
        'AZURE_CODESIGN_ENDPOINT',
        'AZURE_CODESIGN_ACCOUNT',
        'AZURE_CODESIGN_PROFILE',
        'AZURE_CODESIGN_ACCESS_TOKEN',
    ].filter((name) => !process.env[name]);

    if (missing.length > 0) {
        throw new Error(`Cannot sign Windows app, missing environment variables: ${missing.join(', ')}`);
    }

    try {
        // execFileSync with an argv array avoids spawning a shell. The token is
        // passed by reference (env:VAR) so jsign reads it from the inherited
        // environment and the value never appears in argv, the process list, or
        // the thrown error.
        require('child_process').execFileSync(
            'java',
            [
                '-jar',
                'jsign-7.4.jar',
                '--storetype',
                'TRUSTEDSIGNING',
                '--keystore',
                endpoint,
                '--storepass',
                'env:AZURE_CODESIGN_ACCESS_TOKEN',
                '--alias',
                `${account}/${profile}`,
                configuration.path,
            ],
            {
                stdio: 'inherit',
            },
        );
    } catch (error) {
        // jsign's own output already went to the console via stdio: 'inherit',
        // so rethrow a concise error without the argv for a clean failure.
        throw new Error(`Failed to sign Windows app with Azure Trusted Signing (jsign exit ${error.status ?? 'unknown'})`);
    }

    return;
};
