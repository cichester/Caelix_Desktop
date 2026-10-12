require('dotenv').config();
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (
        electronPlatformName !== 'darwin' ||
        process.env.SKIP_NOTARIZATION === 'true'
    ) {
        return;
    }

    const appName = context.packager.appInfo.productFilename;

    return await notarize({
        appBundleId: 'it.caelix.desktop',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLEID,
        appleIdPassword: process.env.APPLEIDPASS,
        teamId: 'N4E7457U38',
    });
};
