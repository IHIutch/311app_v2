import Vue from "vue";
import Router from "vue-router";
import Test from "./views/Test";
import FormPage from "./views/FormPage";
import ReportPage from "./views/ReportPage";
import ReportsListPage from "./views/ReportsListPage";
import LoginPage from "./views/LoginPage";
import AdminPage from "./views/AdminPage";
import { auth } from "@/modules/firebase";

Vue.use(Router);

const router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "FormPage",
      component: FormPage,
    },
    {
      path: "/test",
      name: "Test",
      component: Test,
    },
    {
      path: "/reports",
      name: "ReportsListPage",
      component: ReportsListPage,
    },
    {
      path: "/report/:issueId",
      name: "ReportPage",
      component: ReportPage,
    },
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage,
      meta: {
        isLogged: true,
      },
    },
    {
      path: "/admin",
      name: "AdminPage",
      component: AdminPage,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        next();
      } else {
        next({ name: "LoginPage" });
      }
    });
  } else if (to.matched.some((route) => route.meta.isLogged)) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        next({ name: "AdminPage" });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

export default router;
