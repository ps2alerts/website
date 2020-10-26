import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import NotFound from "../views/NotFound.vue";
import Home from "@/components/Home.vue";
import AllAlerts from "@/components/AllAlerts.vue";
import Changelog from "@/components/Changelog.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/all-alerts",
    name: "AllAlerts",
    component: AllAlerts
  },
  {
    path: "/changelog",
    name: "Changelog",
    component: Changelog
  },
  {
    // Serve 404s on unknown routes
    name: "not-found",
    path: "/:pathMatch(.*)*",
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
