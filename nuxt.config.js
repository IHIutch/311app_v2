require("dotenv").config();

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://buffalo311.herokuapp.com/"
    : "http://localhost:3000";
const siteUrl = "https://buffalo311.herokuapp.com//";
const siteName = "Buffalo 311";
const siteDesc =
  "The data that the City of Buffalo collects in its day-to-day operations to make Buffalo a great place to live, work, and play are a valuable asset for all citizens. Data are the building blocks of information. Information applied is knowledge and knowledge is power.";
const siteImage = `${baseURL}/img/meta/meta_image.jpg`;

module.exports = {
  env: {
    baseURL: baseURL
  },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "universal",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
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
        hid: "title",
        name: "title",
        content: siteName
      },
      {
        hid: "description",
        name: "description",
        content: siteDesc
      },
      /* Open Graph / Facebook */
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: siteName
      },
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
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    "@nuxtjs/sentry",
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "@nuxtjs/pwa",
    "nuxt-leaflet"
  ],
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false
  },
  sentry: {
    initialize: process.env.NODE_ENV === "production",
    dsn: "https://fb0586e37cde4cbaa306926bf377ef5f@sentry.io/1516230"
  },
  axios: {
    baseURL: `${baseURL}/api/v1`
  },
  /*
   ** Build configuration
   */
  build: {},
  serverMiddleware: [
    redirectSSL.create({
      enabled: process.env.NODE_ENV === "production"
    }),
    // Will register file from project api directory to handle /api/* requires
    { path: "/api/v1", handler: "~/api/v1/index" }
  ],
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
          src: `${baseURL}/img/pwa/icons/pwa_icon_64.png`,
          sizes: "64x64",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseURL}/img/pwa/icons/pwa_icon_120.png`,
          sizes: "120x120",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseURL}/img/pwa/icons/pwa_icon_144.png`,
          sizes: "144x144",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseURL}/img/pwa/icons/pwa_icon_152.png`,
          sizes: "152x152",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseURL}/img/pwa/icons/pwa_icon_192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseURL}/img/pwa/icons/pwa_icon_384.png`,
          sizes: "384x384",
          type: "image/png",
          purpose: "maskable any"
        },
        {
          src: `${baseURL}/img/pwa/icons/pwa_icon_512.png`,
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
