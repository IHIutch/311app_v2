import Vue from "vue";
import Router from "vue-router";
import FormPage from "./views/FormPage";
import Test from "./views/Test";
import ReportPage from "./views/ReportPage";
import ReportsListPage from "./views/ReportsListPage";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "FormPage",
      component: FormPage
    },
    {
      path: "/test",
      name: "Test",
      component: Test
    },
    {
      path: "/reports",
      name: "ReportsListPage",
      component: ReportsListPage
    },
    {
      path: "/report/:issueId",
      name: "ReportPage",
      component: ReportPage
    }
  ]
});
