import Vue from 'vue'
import { VuejsDatatableFactory } from 'vuejs-datatable'

VuejsDatatableFactory.useDefaultType(false).registerTableType(
  'datatable',
  (tableType) =>
    tableType.mergeSettings({
      table: {
        class: 'w-full border-row border-col datatable',
      },
      pager: {
        classes: {
          pager: 'flex justify-center rounded',
          li: 'btn disabled',
          selected: 'btn-alt',
        },
      },
    })
)

Vue.use(VuejsDatatableFactory)
