import { createApp } from 'vue';
import router from "./router";
import App from "@/App.vue";
import store from "./store";
import {WorldName} from "@/filters/WorldName";
import {ZoneName} from "@/filters/ZoneName";
import {AlertRemainingTime} from "@/filters/AlertRemainingTime";

const app = createApp(App)
app.config.globalProperties.$filters = {
  alertRemainingTime: AlertRemainingTime,
  worldName: WorldName,
  zoneName: ZoneName
}
app.use(store)
app.use(router)
app.mount("#app");
