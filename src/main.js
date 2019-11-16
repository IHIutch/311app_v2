import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import BootstrapVue from "bootstrap-vue";
import { firestorePlugin } from "vuefire";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

// Global styles
import "@/assets/scss/main.scss";

// Enable PWA
import "./registerServiceWorker";

// Initialize Sentry (Live error tracking)
// Sentry.init({
//   dsn: "https://fb0586e37cde4cbaa306926bf377ef5f@sentry.io/1516230",
//   integrations: [new Integrations.Vue({ Vue, attachProps: true })]
// });

Vue.use(firestorePlugin);
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
