module.exports = {
  configurations: {
    "ios.sim.debug": {
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/CalendarsExample.app",
      build: "xcodebuild -workspace ios/CalendarsExample.xcworkspace -scheme CalendarsExample -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
      type: "ios.simulator",
      device: {
        type: "iPhone 12",
        os: "iOS 14.2"
      }
    },
    "ios.sim.release": {
      binaryPath: "ios/build/Build/Products/Release-iphonesimulator/CalendarsExample.app",
      build: "xcodebuild -workspace ios/CalendarsExample.xcworkspace -scheme CalendarsExample -configuration Release -sdk iphonesimulator -derivedDataPath ios/build",
      type: "ios.simulator",
      device: {
        type: "iPhone 12",
        os: "iOS 14.2"
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
