// This file is used to export the Jest configurations

module.exports = {
  configs: {
    base: require('./jest.config.base'),
    react: require('./jest.config.react'),
    nextjs: require('./jest.config.nextjs'),
    node: require('./jest.config.node')
  },
  setupTests: require('./setup-tests')
};
