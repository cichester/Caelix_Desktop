# @alchemy/client-electron

> The Alchemy desktop application for Mac, Windows, and Linux. Wraps the web app in an Electron shell with additional features only available on desktop, such as Discord Rich Presence.

### Prerequisites

This package, unlike all of the other packages in the monorepo, requires the use of yarn. This is because the Electron build tools don't play nicely with non-hoisted dependencies. The simplest solution to this problem is to just continue using yarn here until a better solution is implemented upstream in the Electron build tools.

Install the version of yarn that is specified in the `packageManager` field of the `package.json` file.

### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code
yarn build

# `yarn build` & create build with electron-builder
yarn build:package

# Build for Windows
yarn build:package:win

# Publish Mac artifacts to S3
yarn build:publish

# Publish Windows artifacts to S3
yarn build:publish:win

# Publish Linux artifacts to S3
yarn build:publish:linux

# Build and publish everything to S3
yarn build:publish:all
```

### Logs

-   macOS: ~/Library/Logs/Alchemy/main.log
-   macOS: `yarn logs:production`
-   Windows: %USERPROFILE%\AppData\Roaming\Alchemy\logs\main.log
-   Linux: ~/.config/Alchemy/logs/main.log

If those don't seem right, check [electron-log](https://github.com/megahertz/electron-log).

### Notarization

[This guide](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/) was very helpful for getting the Mac app notarized. One missing piece was needing to create a certificate on the Apple Developer portal first.

### Windows code signing

The Windows installer is signed with [Azure Trusted Signing](https://learn.microsoft.com/en-us/azure/trusted-signing/) (Microsoft's cloud signing service, now branded Azure Artifact Signing). Because the app is built on a macOS runner, electron-builder's native `azureSignOptions` (Windows-only) cannot be used. Instead `sign.js` shells out to [jsign](https://ebourg.github.io/jsign/), which is cross-platform and signs against the Trusted Signing data-plane API.

Signing is configured entirely through environment variables, so no certificate lives on the build machine:

-   `AZURE_CODESIGN_ENDPOINT` - region endpoint, e.g. `https://eus.codesigning.azure.net`
-   `AZURE_CODESIGN_ACCOUNT` - Trusted Signing account name
-   `AZURE_CODESIGN_PROFILE` - certificate profile name
-   `AZURE_CODESIGN_ACCESS_TOKEN` - short-lived (~2h) access token

In CI, `deploy/deploy-client-electron.sh` mints the access token from a service principal (`AZURE_CODESIGN_TENANT_ID`, `AZURE_CODESIGN_CLIENT_ID`, `AZURE_CODESIGN_CLIENT_SECRET`) via an OAuth client-credentials request before building, so the runner only needs `curl`, `jq`, and a JRE. The service principal holds the **Artifact Signing Certificate Profile Signer** role on the Trusted Signing account.

The jsign jar is not committed. `scripts/fetch-jsign.sh` downloads it from `https://cdn.alchemyrpg.com/build-tools/` and verifies its SHA-256, and the deploy script runs it before packaging. When bumping the jsign version, update the version and checksum in both `scripts/fetch-jsign.sh` and `sign.js`, then upload the new jar to `s3://alchemyrpg-user-uploads/build-tools/`.

To sign locally, fetch the jar and a token, then export the variables before running a packaging command:

```bash
bash scripts/fetch-jsign.sh
export AZURE_CODESIGN_ENDPOINT=https://eus.codesigning.azure.net
export AZURE_CODESIGN_ACCOUNT=Alchemy
export AZURE_CODESIGN_PROFILE=alchemy-public-trust
export AZURE_CODESIGN_ACCESS_TOKEN=$(az account get-access-token --resource https://codesigning.azure.net --query accessToken -o tsv)
yarn build:publish:win
```

### Auto-Updating

For the most part, auto-updating _just works_. It does so silently after quitting and relaunching the app. On Linux, only the AppImage package supports auto-updating. If a user installs from the .deb or .tar.gz they have to update manually.

Eventually it would be good to have a button visible in the UI to show that an update is available.

There is a stable channel and a beta channel for automatic updates. The stable channel is the default. To switch to the beta channel, open the app menu (on macOS) or the file menu (on Windows and Linux) and select the _Beta Channel (Danger Zone)_ option. This will check for an update and download it if one is available. See below for information on how to deploy updates to the beta channel.

### Deploying

The app is built and packaged on a dedicated, self-hosted, macOS GitHub Actions runner with access to all of our signing certificates.

#### Continuous Deployment

Any commit pushed to the `main` branch with a change to the `packages/client-electron` directory will trigger a build and deploy to S3.

#### Manual Deployment

To manually deploy a version of the app without merging to `main`, open a pull request and then comment `/deploy package=client-electron` on the pull request. This will trigger a build and deploy to S3.

#### Important Note on Versioning

The version of the app is set in `packages/client-electron/package.json`. The version number must be incremented for each release because it is used to determine if an update is available. If the version number is not incremented, the app will not automatically update, however, new downloads will get the latest version.

To deploy an update to the beta channel, append `-beta.x` to the version number, e.g. `1.2.0-beta.1`. After merging to `main` or triggering a manual deploy, the beta channel will be updated with this new version, but the stable channel will not receive the update until the `-beta.x` is removed from the version number and another release is deployed.
