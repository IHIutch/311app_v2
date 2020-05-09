require("dotenv").config();

module.exports = {
  mode: "universal",
  buildDir: "functions/.nuxt",
  srcDir: "src/",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["@/assets/scss/main.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    "@nuxtjs/pwa",
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: process.env.NUXT_ENV_FIREBASE_API_KEY,
          authDomain: process.env.NUXT_ENV_FIREBASE_AUTH_DOMAIN,
          databaseURL: process.env.NUXT_ENV_FIREBASE_DATABASE_URL,
          projectId: process.env.NUXT_ENV_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NUXT_ENV_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NUXT_ENV_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NUXT_ENV_FIREBASE_APP_ID
        },
        onFirebaseHosting: true,
        services: {
          auth: true,
          firestore: true,
          functions: true,
          storage: true,
          realtimeDb: true
        }
      }
    ],
    "nuxt-leaflet"
  ],
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
