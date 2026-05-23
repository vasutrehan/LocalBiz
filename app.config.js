const config = require('./app.json');

const googleMapsApiKey =
  process.env.GOOGLE_MAPS_API_KEY ||
  config?.expo?.android?.config?.googleMaps?.apiKey;

module.exports = {
  ...config,
  expo: {
    ...config.expo,
    android: {
      ...config.expo.android,
      config: {
        ...(config.expo.android?.config || {}),
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
  },
};
