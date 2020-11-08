import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Home = () => import("@/components/Home.vue")
const AllAlerts = () => import("@/components/all-alerts/AllAlerts.vue")
const Changelog = () => import("@/components/Changelog.vue")
const NotFound = () => import("@/components/NotFound.vue")
const Alert = () => import("@/components/alert/Alert.vue")

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

export default router;
