/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * React Native requires a Metro configuration in the project root. In
 * version 0.72 and later, you must explicitly merge the default config
 * provided by `@react-native/metro-config` with any custom settings.
 */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * You can customise Metro options by adding properties to the `config`
 * object. For example, to extend the list of source file extensions
 * recognised by Metro you can add a `resolver.sourceExts` array. In
 * this project we simply use the defaults.
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
