// Minimal mock for Ionicons to avoid native dependency in tests
const React = require('react');

function Ionicons(props) {
  return React.createElement('Icon', props, props.name || 'icon');
}

module.exports = Ionicons;
module.exports.default = Ionicons;
