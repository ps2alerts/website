import {metagameEventTypeDetailsMap} from "@/constants/MetagameEventType";
import {MetagameDetailsInterface} from "@/interfaces/MetagameDetailsInterface";

export const InstanceEventDetails = function(eventTypeId: number): MetagameDetailsInterface | null {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return metagameEventTypeDetailsMap.has(eventTypeId) ? metagameEventTypeDetailsMap.get(eventTypeId) : null
}
