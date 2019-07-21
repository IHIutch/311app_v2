import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import BootstrapVue from "bootstrap-vue";
import "@/assets/scss/main.scss";

Vue.use(BootstrapVue);
import "@/registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
