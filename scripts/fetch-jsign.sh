#!/bin/bash
# Downloads the jsign CLI jar used by sign.js for Windows code signing and
# verifies its checksum. Hosting the ~2 MB binary on the CDN keeps it out of git
# while staying on infrastructure we control. Safe to run repeatedly: it is a
# no-op when the verified jar is already present.
#
# When bumping jsign, update JSIGN_VERSION + JSIGN_SHA256 here and in sign.js.
set -e

JSIGN_VERSION=7.4
JSIGN_SHA256=2abf2ade9ea322acc2d60c24794eadc465ff9380938fca4c932d09e0b25f1c28
JSIGN_URL="https://github.com/ebourg/jsign/releases/download/${JSIGN_VERSION}/jsign-${JSIGN_VERSION}.jar"

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
DEST="${SCRIPT_DIR}/../jsign-${JSIGN_VERSION}.jar"

if [ -f "$DEST" ] && echo "${JSIGN_SHA256}  ${DEST}" | shasum -a 256 -c - >/dev/null 2>&1; then
    echo "✅  jsign ${JSIGN_VERSION} already present and verified"
    exit 0
fi

echo "⬇️  Downloading jsign ${JSIGN_VERSION} from ${JSIGN_URL}"
curl -fsSL -o "$DEST" "$JSIGN_URL"
echo "${JSIGN_SHA256}  ${DEST}" | shasum -a 256 -c -
echo "✅  jsign ${JSIGN_VERSION} downloaded and verified"
