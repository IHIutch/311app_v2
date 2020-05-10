require("dotenv").config();

// const siteUrl = "https://buffalo311.org/";
const siteName = "Buffalo 311";
const siteDesc =
  "The data that the City of Buffalo collects in its day-to-day operations to make Buffalo a great place to live, work, and play are a valuable asset for all citizens. Data are the building blocks of information. Information applied is knowledge and knowledge is power.";

module.exports = {
  env: {
    baseUrl:
      process.env.NODE_ENV === "production"
        ? "https://buffalo-311.web.app"
        : "http://localhost:3000"
  },
  mode: "universal",
  buildDir: "functions/.nuxt",
  srcDir: "src/",
  /*
   ** Headers of the page
   */
  head: {
    title: siteName,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: siteDesc
      },
      {
        hid: "og:type",
        property: "og:type",
        content: "website"
      },
      {
        hid: "og:sitename",
        property: "og:sitename",
        content: siteName
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
    "nuxt-leaflet",
    "@nuxtjs/sentry"
  ],
  sentry: {
    initialize: process.env.NODE_ENV === "production",
    dsn: "https://fb0586e37cde4cbaa306926bf377ef5f@sentry.io/1516230"
  },
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
