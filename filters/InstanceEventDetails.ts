import { metagameEventTypeDetailsMap } from '@/constants/MetagameEventType'
import { MetagameDetailsInterface } from '@/interfaces/MetagameDetailsInterface'
import Vue from 'vue'
import { Faction } from '~/constants/Faction'

const instanceEventDetails = Vue.filter(
  'instanceEventDetails',
  (eventTypeId: number) => {
    // @ts-ignore
    return metagameEventTypeDetailsMap.has(eventTypeId)
      ? metagameEventTypeDetailsMap.get(eventTypeId)
      : null
  }
)
