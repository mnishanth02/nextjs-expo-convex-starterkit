// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
})

config.resolver.unstable_enablePackageExports = true

// Wrap with NativeWind configuration
module.exports = withNativeWind(config, {
  input: "./global.css",
})
