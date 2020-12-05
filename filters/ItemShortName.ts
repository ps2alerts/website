import Vue from 'vue'

const itemShortName = Vue.filter('itemShortName', (name: string) => {
  name = name.toString().replace('Anti-Vehicle', 'AV')
  name = name.toString().replace('Anti-Personnel', 'AI')
  name = name.toString().replace('Anti-Aircraft', 'AA')
  name = name.toString().replace('Bastion Fleet Carrier', 'Bastion')
  return name
})

export default itemShortName
