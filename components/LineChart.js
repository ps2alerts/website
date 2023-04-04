/* eslint-disable import/named */
import { Line, mixins } from 'vue-chartjs'
import 'chartjs-plugin-annotation'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    options() {
      console.log('chart updated')
      this.update()
    },
  },
}
