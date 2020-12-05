import Vue from 'vue'

const itemShortName = Vue.filter('itemShortName', (name: string) => {
  name = name.replace('Anti-Vehicle', 'AV')
  name = name.replace('Anti-Personnel', 'AI')
  name = name.replace('Anti-Aircraft', 'AA')
  name = name.replace('Bastion Fleet Carrier', 'Bastion')
  return name
})

export default itemShortName
