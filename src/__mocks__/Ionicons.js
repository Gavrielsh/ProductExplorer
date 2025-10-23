// src/__mocks__/Ionicons.js
const React = require('react');
const { Text } = require('react-native');

/** Simple text-only mock for Ionicons */
module.exports = ({ name = 'icon', color, size, testID }) =>
  React.createElement(Text, { testID: testID || 'ionicon', style: { color, fontSize: size } }, name);
