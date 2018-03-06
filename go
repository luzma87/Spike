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
test_lint_local=$(tput setaf 7)
test_lint_cached=$(tput setaf 5)
scan_vulnerabilities=$(tput setaf 3)
install_hooks=$(tput setaf 2)

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

function test_lint() {
    HAS_JS=true

    ESLINT="$(git rev-parse --show-toplevel)/node_modules/.bin/eslint"
    if [[ "$STAGED_FILES" = "" ]]; then
      HAS_JS=false
      echo ${green}"There is no Javascript files ${normal}"
    fi

    PASS=true

     if $HAS_JS; then
        echo "Validating Javascript:"
        # Check for eslint
        if [[ ! -x "$ESLINT" ]]; then
          echo "Please install ESlint ${red}(npm i --save-dev eslint)"
          exit 1
        fi

        for FILE in $STAGED_FILES
        do
          "$ESLINT" "$FILE"

          if [[ "$?" == 0 ]]; then
            echo ${green}"ESLint Passed: $FILE"
          else
            echo ${red}"ESLint Failed: $FILE"
            PASS=false
          fi
        done

        echo ${green}"Javascript validation completed!"

        if ! $LOCAL; then
            if ! $PASS; then
              echo ${red}"COMMIT FAILED: ${normal}Your commit contains files that should pass ESLint but do not. Please fix the ESLint errors and try again."
              exit 1
            else
              echo ${green}"COMMIT SUCCEEDED"
            fi
        fi
    fi
    set -eu
    exit $?
}

function task_test_lint_local {
  set +eu
  STAGED_FILES=$(git diff HEAD --name-only --diff-filter=ACM | grep ".jsx\{0,1\}$")
  LOCAL=true
  (test_lint)
}

function task_test_lint_cached {
  set +eu
  STAGED_FILES=$(git show --pretty="" --name-only | grep ".jsx\{0,1\}$")
  LOCAL=false
  (test_lint)
}

function task_scan_vulnerabilities {
    HAWKEYE="$(git rev-parse --show-toplevel)/node_modules/.bin/hawkeye"
    STATUS=$($HAWKEYE scan)
}

function task_install_hooks {
    ROOT="$(git rev-parse --show-toplevel)"
    echo ${green}"Installing hooks in local machine"
    cp -r $ROOT/.hooks/. $ROOT/.git/hooks

    if [ $? -ne 0 ]; then
        echo ${red}"There was an error installing hooks"${normal}
     else
        echo ${green}"Hooks installed successfully"${normal}
    fi

}

function task_help {
  help_message="usage "
  help_message="${help_message} ${build_android_fg}go build_android${normal}"
  help_message="${help_message} | ${init_ios_fg}go init_ios${normal}"
  help_message="${help_message} | ${test_ios_fg}go test_ios${normal}"
  help_message="${help_message} | ${test_lint_local}go test_lint_local${normal}"
  help_message="${help_message} | ${test_lint_cached}go test_lint_cached${normal}"
  help_message="${help_message} | ${scan_vulnerabilities}go scan_vulnerabilities${normal}"
  help_message="${help_message} | ${install_hooks}go install_hooks${normal}"
  echo "${help_message}"
}

CMD=${1:-}
shift || true
case ${CMD} in
  build_android) task_build_android ;;
  init_ios) task_init_ios ;;
  test_ios) task_test_ios ;;
  test_lint_local) task_test_lint_local ;;
  test_lint_cached) task_test_lint_cached ;;
  scan_vulnerabilities) task_scan_vulnerabilities ;;
  install_hooks) task_install_hooks ;;
  *) task_help ;;
esac
