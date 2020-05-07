module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      title: "Buffalo 311",
    },
  },
  pwa: {
    name: "Buffalo 311",
    themeColor: "#0b2123",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    workboxOptions: {
      skipWaiting: true,
    },
  },
};
