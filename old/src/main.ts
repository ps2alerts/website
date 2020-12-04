import { createApp } from 'vue';
import router from "./router";
import App from "@/App.vue";
import store from "./store";
import {AlertRemainingTime} from "@/filters/AlertRemainingTime";
import {AlertEndTime} from "@/filters/AlertEndTime";
import {WorldName} from "@/filters/WorldName";
import {ZoneName} from "@/filters/ZoneName";
import {FactionName} from "@/filters/FactionName";
import {BracketName} from "@/filters/BracketName";
import {DateTimeFormat} from "@/filters/DateTimeFormat";
import {library} from "@fortawesome/fontawesome-svg-core";
import {font-awesome-icon} from "@fortawesome/vue-fontawesome";
import {faDiscord, faGithub, faPatreon, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {
  faChartArea, faCircle,
  faEye, faFilter, faFlag,
  faInfoCircle, faLink,
  faPercent,
  faPollH,
  faTasks, faUndo, faUser,
} from "@fortawesome/free-solid-svg-icons";
import VueGtag from "vue-gtag-next";
import {VehicleFaction} from "@/filters/VehicleFaction";
import {ItemShortName} from "@/filters/ItemShortName";

const app = createApp(App)
app.config.globalProperties.$filters = {
  alertRemainingTime: AlertRemainingTime,
  alertEndTime: AlertEndTime,
  worldName: WorldName,
  zoneName: ZoneName,
  factionName: FactionName,
  bracketName: BracketName,
  dateTimeFormat: DateTimeFormat,
  vehicleFaction: VehicleFaction,
  itemShortName: ItemShortName,
}

library.add(faGithub, faTwitter, faInfoCircle, faEye, faPercent, faDiscord, faChartArea, faPollH, faTasks, faCircle, faLink, faUser, faFlag, faPatreon, faFilter, faUndo);
app.component('font-awesome-icon', font-awesome-icon)

app.use(store)
app.use(router)
app.use(VueGtag, {
  property: {
    id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID
  }
});

app.mount("#app");
