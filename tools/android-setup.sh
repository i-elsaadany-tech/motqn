#!/usr/bin/env bash
# Generates the Android (Capacitor) project from the web build and applies icons, name and version.
# Requires: Node 22+, Java 21, ImageMagick (convert). Run from the repository root.
set -euo pipefail
VERSION_CODE="${VERSION_CODE:-1}"
VERSION_NAME="${VERSION_NAME:-1.0.0}"

npm run build
if [ ! -d android/app ]; then rm -rf android; npx cap add android; fi
npx cap sync android

RES=android/app/src/main/res
declare -A LEGACY=( [mdpi]=48 [hdpi]=72 [xhdpi]=96 [xxhdpi]=144 [xxxhdpi]=192 )
declare -A ADAPT=( [mdpi]=108 [hdpi]=162 [xhdpi]=216 [xxhdpi]=324 [xxxhdpi]=432 )
for d in "${!LEGACY[@]}"; do
  s=${LEGACY[$d]}; a=${ADAPT[$d]}
  mkdir -p "$RES/mipmap-$d"
  convert -size ${s}x${s} xc:white \( public/logo-mark.png -resize $((s*80/100))x$((s*80/100)) \) -gravity center -composite "$RES/mipmap-$d/ic_launcher.png"
  cp "$RES/mipmap-$d/ic_launcher.png" "$RES/mipmap-$d/ic_launcher_round.png"
  convert -size ${a}x${a} xc:none \( public/logo-mark.png -resize $((a*56/100))x$((a*56/100)) \) -gravity center -composite "$RES/mipmap-$d/ic_launcher_foreground.png"
done
mkdir -p "$RES/values"
cat > "$RES/values/ic_launcher_background.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<resources><color name="ic_launcher_background">#FFFFFF</color></resources>
XML

# app name (Arabic) and version
sed -i 's#<string name="app_name">[^<]*</string>#<string name="app_name">متقن</string>#; s#<string name="title_activity_main">[^<]*</string>#<string name="title_activity_main">متقن</string>#' "$RES/values/strings.xml"
sed -i "s/versionCode [0-9]*/versionCode ${VERSION_CODE}/; s/versionName \"[^\"]*\"/versionName \"${VERSION_NAME}\"/" android/app/build.gradle
echo "Android project ready in ./android (versionCode ${VERSION_CODE}, versionName ${VERSION_NAME})"
