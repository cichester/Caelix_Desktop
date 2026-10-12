# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-01-14

### Added

-   New app icon, including a fancy version for the newer versions of macOS.

### Changed

-   Updated to the latest Electron.
-   Pop-Out modals now open in native windows instead of the default browser.

## [1.2.4] - 2023-11-24

## Changed

-   Updated dependencies: electron v27.1.0

## [1.2.3] - 2023-11-10

## Changed

-   Updated dependencies: electron v27.0.4

## [1.2.2] - 2023-10-30

### Changed

-   Updated dependencies: electron v27.0.2, electron-log v5.0.0
-   Added arm64 build for Linux

## [1.2.1] - 2023-10-13

### Changed

-   Updated dependencies: electron v27.0.0, electron-updater v6, electron-builder v24, electron-dl v3.5.1

## [1.2.0] - 2023-10-07

### Added

-   Added stable and beta release channel settings to the app menu. The default is stable. The beta channel will be used for testing new features before they're released to the stable channel. Unsure if this release note will make it into the public release notes, but wanted to document it here regardless.

## [1.1.0] - 2023-01-12

### Added

-   D&D Beyond character import with some in-app CORS hackery.

## [1.0.13] - 2022-10-15

### Changed

-   Updated electron.

## [1.0.12] - 2022-10-14

### Changed

-   Updated electron, electron-builder, and electron-updater.

## [1.0.11] - 2022-09-29

### Changed

-   Updated electron.

## [1.0.10] - 2022-09-23

### Changed

-   Updated electron.
-   No longer signing .dmg file for the Mac app to avoid issues with Gatekeeper.

## [1.0.9] - 2022-09-11

### Changed

-   Updated electron.

## [1.0.8] - 2022-09-08

### Changed

-   Updated electron.

## [1.0.7] - 2022-09-01

### Changed

-   Updated electron.

## [1.0.6] - 2022-08-30

### Changed

-   Updated dependencies: electron, electron-updater, source-map-support.

## [1.0.5] - 2022-08-27

### Changed

-   Updated dependency electron-updater to 4.6.5.
-   Updated dependency electron-dl to 3.3.1.
-   Updated dependency electron-builder to 22.14.13.

## [1.0.4] - 2022-08-24

### Changed

-   Updated to Electron 20.0.3.

## [1.0.3] - 2022-05-08

### Fixed

-   Links configured with target \_blank are now opened in your default browser.

## [1.0.2] - 2022-03-24

### Fixed

-   Fixed issue causing links to open in new window when targeting the local, dev, or dev2 environments.

## [1.0.1] - 2022-02-18

### Changed

-   Added IPC plumbing to enable changing the window URL to dev, dev2, or production from the web client's admin tools panel.

## [1.0.0] - 2022-01-25

### Changed

-   Added code signing to Windows build to eliminate warnings during installation.

## [0.10.0] - 2022-01-04

### Added

-   Added View > Resize Window menu items to quickly resize the app window to commonly streamed resolutions (720p, 1080p, 1440p, 4K).

## [0.9.3] - 2021-10-30

### Fixed

-   Downgrade electron-builder to prevent the Windows installer from being flagged as a trojan by Windows Security.

## [0.9.2] - 2021-10-22

### Changed

-   Open downloads directory after downloading an attachment from a universe article.

## [0.9.1] - 2021-10-22

### Fixed

-   Restored title bar in Windows app, which went missing in v0.9.0.

## [0.9.0] - 2021-10-22

### Added

-   Added downloads manager. Downloads (e.g. universe article attachments) are now downloaded to your Downloads directory. A progress bar and badge are shown on the app icon while downloads are in progress (macOS only).

## [0.8.1] - 2021-08-28

### Fixed

-   Fixed inability to access microphone in Mac app.

## [0.8.0] - 2021-08-17

### Added

-   Added a user profile setting to enable or disable Discord integration.

## [0.7.2] - 2021-08-12

### Fixed

-   Fixed Discord rich presence not working in packaged app.

## [0.7.1] - 2021-08-11

### Changed

-   Adjust app icon to increase padding, matching other modern apps.

## [0.7.0] - 2021-08-11

### Added

-   Added Discord rich presence. When the desktop app is running, your Discord rich presence status will display Playing **Alchemy**, and the duration and app icon displayed on hover. When you launch a game, your status will be updated to include In Game along with the name of the game you're in.

## [0.6.0] - 2021-08-07

### Changed

-   Removed title bar from window.

## [0.5.0] - 2021-08-06

### Added

-   Added Check for Updates menu item to check for updates.
-   Added Learn More item to Help menu. It opens alchemyrpg.com when clicked.

## [0.4.1] - 2021-08-04

### Changed

-   Show a notification prompting to restart when an update is available.

## [0.4.0] - 2021-07-27

### Added

-   Added universal dmg for macOS to support Apple Silicon / arm64 / M1 Macs.

## [0.3.2] - 2021-07-27

### Changed

-   Tune auto-update logging.

## [0.3.1] - 2021-07-27

### Changed

-   No changes, just testing auto-update logging.

## [0.3.0] - 2021-07-27

### Added

-   Add electron-log and logging for app update events.

## [0.2.0] - 2021-07-26

### Added

-   Publish to S3 as part of build script.
-   Sign and notarize the Mac app.
-   Auto-update the app on all platforms.

## [0.1.0] - 2021-07-25

### Added

-   Initial (internal) release.
