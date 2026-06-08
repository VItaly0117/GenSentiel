module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@db': './src/db',
            '@stores': './src/stores',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@theme': './src/theme',
            '@utils': './src/utils',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
