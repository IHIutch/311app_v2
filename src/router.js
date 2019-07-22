import Vue from "vue";
import Router from "vue-router";
import FormPage from "./views/FormPage.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "FormPage",
      component: FormPage
    }
  ]
});
