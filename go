#!/bin/bash

set -eu

blue=$(tput setaf 4)
red=$(tput setaf 1)
redbg=$(tput setab 1)
green=$(tput setaf 2)
magenta=$(tput setaf 5)
normal=$(tput sgr0)

build_android_fg=$(tput setaf 4)
init_ios_fg=$(tput setaf 5)
test_ios_fg=$(tput setaf 6)

function timestamp() {
  date +"%Y%m%d_%H%M%S"
}

function task_build_android {
  echo "${build_android_fg}Building android signed APK${normal}"
  (cd android && ./gradlew assembleRelease)
  FILENAME="index.android.$(timestamp).bundle"
  echo "${build_android_fg}Moving apk to root build/${FILENAME} folder${normal}"
  mkdir -p build
  mv android/app/build/intermediates/assets/release/index.android.bundle build/${FILENAME}
}

function task_init_ios {
  if which pod &>/dev/null ; then
    echo "${init_ios_fg}Initializing project with FaceDetector${normal}"
    (cd ios && pod install)
  else
    echo "${init_ios_fg}Please install cocoaPods ${red}( brew install brew install cocoapods ) ${normal}"
  fi
}

function task_test_ios {
  if which xcpretty &>/dev/null ; then
    (cd ios && xcodebuild \
      -workspace Spike.xcworkspace \
      -scheme Spike \
      -sdk iphonesimulator \
      -destination 'platform=iOS Simulator,name=iPhone 6,OS=11.2' \
      test | xcpretty --test --color -r html)
  else
    echo "${test_ios_fg}Please install xcpretty ${red}( gem install xcpretty ) ${normal}"
  fi
}

function task_help {
  help_message="usage "
  help_message="${help_message} ${build_android_fg}go build_android${normal}"
  help_message="${help_message} | ${init_ios_fg}go init_ios${normal}"
  help_message="${help_message} | ${test_ios_fg}go test_ios${normal}"
  echo "${help_message}"
}

CMD=${1:-}
shift || true
case ${CMD} in
  build_android) task_build_android ;;
  init_ios) task_init_ios ;;
  test_ios) task_test_ios ;;
  *) task_help ;;
esac
