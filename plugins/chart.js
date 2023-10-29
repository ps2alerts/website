import Vue from 'vue'
import { Line, Pie, Bar } from 'vue-chartjs/legacy'
import 'chartjs-adapter-date-fns'
import ChartDataLabels from 'chartjs-plugin-datalabels'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  TimeSeriesScale,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  TimeSeriesScale,
  LinearScale,
  ChartDataLabels
)

Vue.component('LineChart', {
  extends: Line,
})

Vue.component('PieChart', {
  extends: Pie,
})

Vue.component('BarChart', {
  extends: Bar,
})
