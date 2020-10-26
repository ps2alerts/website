import { createApp } from 'vue';
import router from "./router";
import App from "@/App.vue";
import store from "./store";
import {WorldName} from "@/filters/WorldName";
import {ZoneName} from "@/filters/ZoneName";
import {AlertRemainingTime} from "@/filters/AlertRemainingTime";
import {AlertEndTime} from "@/filters/AlertEndTime";
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faGithub, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {faEye, faInfoCircle} from "@fortawesome/free-solid-svg-icons";

const app = createApp(App)
app.config.globalProperties.$filters = {
  alertRemainingTime: AlertRemainingTime,
  alertEndTime: AlertEndTime,
  worldName: WorldName,
  zoneName: ZoneName
}

library.add(faGithub, faTwitter, faInfoCircle, faEye);
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.use(store)
app.use(router)
app.mount("#app");
