import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/components/Home.vue";
import AllAlerts from "@/components/all-alerts/AllAlerts.vue";
import Changelog from "@/components/Changelog.vue";
import Alert from "@/components/alert/Alert.vue";
import NotFound from "@/components/NotFound.vue";
import {trackRouter} from "vue-gtag-next";

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
    path: "/alert/:instanceId",
    name: "Alert",
    component: Alert,
    props: true
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

trackRouter(router);

export default router;
