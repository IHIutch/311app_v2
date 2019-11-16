export const googleMaps = require("@google/maps").createClient({
  key: env.process.GOOGLE_MAPS_API_KEY
});
