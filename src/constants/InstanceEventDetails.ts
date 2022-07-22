import { metagameEventTypeDetailsMap } from '@/constants/metagameEventType'

export const InstanceEventDetails = (eventTypeId: number) => {
  // @ts-ignore
  return metagameEventTypeDetailsMap.has(eventTypeId)
    ? metagameEventTypeDetailsMap.get(eventTypeId)
    : null
}

export default InstanceEventDetails
