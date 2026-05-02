const React = require('react');
const { View } = require('react-native');

const MockIcon = ({ testID, ...props }) => React.createElement(View, { testID, ...props });

module.exports = {
  Ionicons: MockIcon,
  FontAwesome: MockIcon,
  Feather: MockIcon,
  MaterialIcons: MockIcon,
  AntDesign: MockIcon,
};
