import Vue from 'vue'
import { VuejsDatatableFactory } from 'vuejs-datatable'

VuejsDatatableFactory.useDefaultType(false).registerTableType(
  'datatable',
  (tableType) =>
    tableType.mergeSettings({
      table: {
        class: 'border-row border-col',
      },
      pager: {
        classes: {
          pager: 'text-center btn',
          selected: 'btn-active',
        },
      },
    })
)

Vue.use(VuejsDatatableFactory)
