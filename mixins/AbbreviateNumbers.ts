import Vue from 'vue'
import { abbreviate } from '~/utilities/NumberFormat'

// Gives a component `abbreviate()` for table cells: 6396528 -> 6.39M, 207255 -> 207k
export default Vue.extend({
  name: 'AbbreviateNumbers',
  methods: {
    abbreviate(value: unknown): string {
      return typeof value === 'number' && !isNaN(value)
        ? abbreviate(value)
        : String(value ?? '')
    },
    exactNumber(value: unknown): string {
      return typeof value === 'number' ? value.toLocaleString('en-GB') : ''
    },
  },
})
