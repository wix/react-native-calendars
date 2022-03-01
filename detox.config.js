module.exports = {
  configurations: {
    "ios.sim.debug": {
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/CalendarsExample.app",
      build: "xcodebuild -workspace ios/CalendarsExample.xcworkspace -scheme CalendarsExample -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
      type: "ios.simulator",
      device: {
        type: "iPhone 11",
        os: "iOS 13.7"
      }
    },
    "ios.sim.release": {
      binaryPath: "ios/build/Build/Products/Release-iphonesimulator/CalendarsExample.app",
      build: "xcodebuild -workspace ios/CalendarsExample.xcworkspace -scheme CalendarsExample -configuration Release -sdk iphonesimulator -derivedDataPath ios/build",
      type: "ios.simulator",
      device: {
        type: "iPhone 11",
        os: "iOS 13.7"
      }
    }
  },
  artifacts: {
    plugins: {
      uiHierarchy: process.env.JENKINS_CI ? "enabled" : undefined,
    }
  },
  testRunner: "mocha"
};
