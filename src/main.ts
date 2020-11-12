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
import {faDiscord, faGithub, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {
  faChartArea, faCircle,
  faEye,
  faInfoCircle, faLink,
  faPercent,
  faPollH,
  faTasks
} from "@fortawesome/free-solid-svg-icons";
import VueGtag from "vue-gtag-next";

const app = createApp(App)
app.config.globalProperties.$filters = {
  alertRemainingTime: AlertRemainingTime,
  alertEndTime: AlertEndTime,
  worldName: WorldName,
  zoneName: ZoneName
}

library.add(faGithub, faTwitter, faInfoCircle, faEye, faPercent, faDiscord, faChartArea, faPollH, faTasks, faCircle, faLink);
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.use(store)
app.use(router)
app.use(VueGtag, {
  property: {
    id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID
  }
});

app.mount("#app");
