import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "@/components/Home.vue")
  },
  {
    path: "/all-alerts",
    name: "AllAlerts",
    component: () => import(/* webpackChunkName: "AllAlerts" */ "@/components/all-alerts/AllAlerts.vue")
  },
  {
    path: "/changelog",
    name: "Changelog",
    component: () => import(/* webpackChunkName: "Changelog" */ "@/components/Changelog.vue")
  },
  {
    path: "/alert/:instanceId",
    name: "Alert",
    component: () => import(/* webpackChunkName: "Alert" */ "@/components/alert/Alert.vue"),
    props: true
  },
  {
    // Serve 404s on unknown routes
    name: "not-found",
    path: "/:pathMatch(.*)*",
    component: () => import(/* webpackChunkName: "NotFound" */ "@/components/NotFound.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
