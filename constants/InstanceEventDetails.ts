import { metagameEventTypeDetailsMap } from '@/ps2alerts-constants/metagameEventType'

export const InstanceEventDetails = (eventTypeId: number) => {
  // @ts-ignore
  return metagameEventTypeDetailsMap.has(eventTypeId)
    ? metagameEventTypeDetailsMap.get(eventTypeId)
    : null
}

export default InstanceEventDetails
