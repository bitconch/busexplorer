#!/usr/bin/env bash
set -e

cwd=$PWD

rootDir=$(
  cd "$(dirname "$0")";
  node -p '
    try {
      let package_json = [
        "../lib/node_modules/@bitconch/bus-explorer/package.json",
        "../@bitconch/bus-explorer/package.json",
        "../package.json"
      ].find(require("fs").existsSync);

      assert(
        require(package_json)["name"] === "@bitconch/bus-explorer",
        "Invalid package name in " + package_json
      );

      const path = require("path");
      path.resolve(path.dirname(package_json))
    } catch (err) {
      throw new Error("Unable to locate bus-explorer directory: " + String(err));
    }
  '
)
cd "$rootDir"

if [[ ! -d build || ! -f build/api/api.js ]]; then
  echo "Error: build/ artifacts missing.  Run |yarn run build| to create them"
  exit 1
fi

cleanup() {
  set +e
  for pid in "$api" "$ui"; do
    [[ -z $pid ]] || kill "$pid"
  done
  exit 1
}
trap cleanup SIGINT SIGTERM ERR

(
  set -x
  redis-cli ping
)

node build/api/api.js &
api=$!

maybeSudo=
if [[ $(uname) = Linux ]]; then
  # Run as root for port 80 access
  maybeSudo=sudo
fi
$maybeSudo npm run serve:ui &
ui=$!

wait "$ui"
ui=
cleanup
