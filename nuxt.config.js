require("dotenv").config();

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://buffalo-311.web.app"
    : "http://localhost:3000";
const siteUrl = "https://buffalo-311.web.app/";
const siteName = "Buffalo 311";
const siteDesc =
  "The data that the City of Buffalo collects in its day-to-day operations to make Buffalo a great place to live, work, and play are a valuable asset for all citizens. Data are the building blocks of information. Information applied is knowledge and knowledge is power.";
const siteImage = `${baseUrl}/img/meta/meta_image.jpg`;

module.exports = {
  env: {
    baseUrl: baseUrl
  },
  mode: "universal",
  buildDir: "functions/.nuxt",
  srcDir: "src/",
  /*
   ** Headers of the page
   */
  head: {
    /* Primary Meta Tags */
    title: siteName,
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, shrink-to-fit=no"
      },
      {
        hid: "description",
        name: "description",
        content: siteDesc
      },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: siteName
      },
      /* Open Graph / Facebook */
      {
        hid: "og:type",
        property: "og:type",
        content: "website"
      },
      {
        hid: "og:url",
        property: "og:url",
        content: siteUrl
      },
      {
        hid: "og:title",
        property: "og:title",
        content: siteName
      },
      {
        hid: "og:description",
        property: "og:description",
        content: siteDesc
      },
      {
        hid: "og:image",
        property: "og:image",
        content: siteImage
      },
      /* Twitter */
      {
        hid: "twitter:card",
        property: "twitter:card",
        content: "summary_large_image"
      },
      {
        hid: "twitter:url",
        property: "twitter:url",
        content: siteUrl
      },
      {
        hid: "twitter:title",
        property: "twitter:title",
        content: siteName
      },
      {
        hid: "twitter:description",
        property: "twitter:description",
        content: siteDesc
      },
      {
        hid: "twitter:image",
        property: "twitter:image",
        content: siteImage
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        src: `https://maps.googleapis.com/maps/api/js?key=${process.env.NUXT_ENV_GOOGLE_MAPS_API_KEY}&libraries=places`
      }
    ]
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
  plugins: [{ src: "~/plugins/vue-unicons", mode: "client" }],
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
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false
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
  },
  pwa: {
    icon: false,
    manifest: {
      name: "Buffalo 311",
      short_name: "Buffalo 311",
      description: siteDesc,
      start_url: "/",
      display: "standalone",
      background_color: "#0b2123",
      icons: [
        {
          src: `${baseUrl}/img/pwa/icons/pwa_icon_64.png`,
          sizes: "64x64",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseUrl}/img/pwa/icons/pwa_icon_120.png`,
          sizes: "120x120",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseUrl}/img/pwa/icons/pwa_icon_144.png`,
          sizes: "144x144",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseUrl}/img/pwa/icons/pwa_icon_152.png`,
          sizes: "152x152",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseUrl}/img/pwa/icons/pwa_icon_192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseUrl}/img/pwa/icons/pwa_icon_384.png`,
          sizes: "384x384",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseUrl}/img/pwa/icons/pwa_icon_512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable any"
        }
      ],
      start_url: "/",
      display: "standalone",
      background_color: "#0b2123",
      theme_color: "#0b2123",
      lang: "en"
    }
  }
};
