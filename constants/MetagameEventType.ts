import { Zone } from './Zone'
import { Faction } from './Faction'
import { MetagameDetailsInterface } from '@/interfaces/MetagameDetailsInterface'

const longAlert = 90 * 60 * 1000
const shortAlert = 45 * 60 * 1000

export const metagameEventTypeDetailsMap: Map<
  number,
  MetagameDetailsInterface
> = new Map<number, MetagameDetailsInterface>([
  // Indar
  [
    147,
    {
      title: 'Indar Superiority',
      zone: Zone.INDAR,
      duration: longAlert,
      triggeringFaction: Faction.TERRAN_REPUBLIC,
      unstable: false,
    },
  ],
  [
    148,
    {
      title: 'Indar Enlightenment',
      zone: Zone.INDAR,
      duration: longAlert,
      triggeringFaction: Faction.VANU_SOVEREIGNTY,
      unstable: false,
    },
  ],
  [
    149,
    {
      title: 'Indar Liberation',
      zone: Zone.INDAR,
      duration: longAlert,
      triggeringFaction: Faction.NEW_CONGLOMERATE,
      unstable: false,
    },
  ],

  // Esamir
  [
    150,
    {
      title: 'Esamir Superiority',
      zone: Zone.ESAMIR,
      duration: longAlert,
      triggeringFaction: Faction.TERRAN_REPUBLIC,
      unstable: false,
    },
  ],
  [
    151,
    {
      title: 'Esamir Enlightenment',
      zone: Zone.ESAMIR,
      duration: longAlert,
      triggeringFaction: Faction.VANU_SOVEREIGNTY,
      unstable: false,
    },
  ],
  [
    152,
    {
      title: 'Esamir Liberation',
      zone: Zone.ESAMIR,
      duration: longAlert,
      triggeringFaction: Faction.NEW_CONGLOMERATE,
      unstable: false,
    },
  ],

  // Hossin
  [
    153,
    {
      title: 'Hossin Superiority',
      zone: Zone.HOSSIN,
      duration: longAlert,
      triggeringFaction: Faction.TERRAN_REPUBLIC,
      unstable: false,
    },
  ],
  [
    154,
    {
      title: 'Hossin Enlightenment',
      zone: Zone.HOSSIN,
      duration: longAlert,
      triggeringFaction: Faction.VANU_SOVEREIGNTY,
      unstable: false,
    },
  ],
  [
    155,
    {
      title: 'Hossin Liberation',
      zone: Zone.HOSSIN,
      duration: longAlert,
      triggeringFaction: Faction.NEW_CONGLOMERATE,
      unstable: false,
    },
  ],

  // Amerish
  [
    156,
    {
      title: 'Amerish Superiority',
      zone: Zone.AMERISH,
      duration: longAlert,
      triggeringFaction: Faction.TERRAN_REPUBLIC,
      unstable: false,
    },
  ],
  [
    157,
    {
      title: 'Amerish Enlightenment',
      zone: Zone.AMERISH,
      duration: longAlert,
      triggeringFaction: Faction.VANU_SOVEREIGNTY,
      unstable: false,
    },
  ],
  [
    158,
    {
      title: 'Amerish Liberation',
      zone: Zone.AMERISH,
      duration: longAlert,
      triggeringFaction: Faction.NEW_CONGLOMERATE,
      unstable: false,
    },
  ],

  // Unstable Meltdowns
  // NC
  [
    176,
    {
      title: 'Esamir Unstable Meltdown',
      zone: Zone.ESAMIR,
      duration: shortAlert,
      triggeringFaction: Faction.NEW_CONGLOMERATE,
      unstable: true,
    },
  ],
  [
    177,
    {
      title: 'Hossin Unstable Meltdown',
      zone: Zone.HOSSIN,
      duration: shortAlert,
      triggeringFaction: Faction.NEW_CONGLOMERATE,
      unstable: true,
    },
  ],
  [
    178,
    {
      title: 'Amerish Unstable Meltdown',
      zone: Zone.AMERISH,
      duration: shortAlert,
      triggeringFaction: Faction.NEW_CONGLOMERATE,
      unstable: true,
    },
  ],
  [
    179,
    {
      title: 'Indar Unstable Meltdown',
      zone: Zone.INDAR,
      duration: shortAlert,
      triggeringFaction: Faction.NEW_CONGLOMERATE,
      unstable: true,
    },
  ],

  // VS
  [
    186,
    {
      title: 'Esamir Unstable Meltdown',
      zone: Zone.ESAMIR,
      duration: shortAlert,
      triggeringFaction: Faction.VANU_SOVEREIGNTY,
      unstable: true,
    },
  ],
  [
    187,
    {
      title: 'Hossin Unstable Meltdown',
      zone: Zone.HOSSIN,
      duration: shortAlert,
      triggeringFaction: Faction.VANU_SOVEREIGNTY,
      unstable: true,
    },
  ],
  [
    188,
    {
      title: 'Amerish Unstable Meltdown',
      zone: Zone.AMERISH,
      duration: shortAlert,
      triggeringFaction: Faction.VANU_SOVEREIGNTY,
      unstable: true,
    },
  ],
  [
    189,
    {
      title: 'Indar Unstable Meltdown',
      zone: Zone.INDAR,
      duration: shortAlert,
      triggeringFaction: Faction.VANU_SOVEREIGNTY,
      unstable: true,
    },
  ],

  // TR
  [
    190,
    {
      title: 'Esamir Unstable Meltdown',
      zone: Zone.ESAMIR,
      duration: shortAlert,
      triggeringFaction: Faction.TERRAN_REPUBLIC,
      unstable: true,
    },
  ],
  [
    191,
    {
      title: 'Hossin Unstable Meltdown',
      zone: Zone.HOSSIN,
      duration: shortAlert,
      triggeringFaction: Faction.TERRAN_REPUBLIC,
      unstable: true,
    },
  ],
  [
    192,
    {
      title: 'Amerish Unstable Meltdown',
      zone: Zone.AMERISH,
      duration: shortAlert,
      triggeringFaction: Faction.TERRAN_REPUBLIC,
      unstable: true,
    },
  ],
  [
    193,
    {
      title: 'Indar Unstable Meltdown',
      zone: Zone.INDAR,
      duration: shortAlert,
      triggeringFaction: Faction.TERRAN_REPUBLIC,
      unstable: true,
    },
  ],

  // High pop triggered alerts
  [
    211,
    {
      title: 'Amerish Conquest (high pop)',
      zone: Zone.AMERISH,
      duration: longAlert,
      triggeringFaction: Faction.NONE,
      unstable: false,
    },
  ],
  [
    212,
    {
      title: 'Esamir Conquest (high pop)',
      zone: Zone.ESAMIR,
      duration: longAlert,
      triggeringFaction: Faction.NONE,
      unstable: false,
    },
  ],
  [
    213,
    {
      title: 'Hossin Conquest (high pop)',
      zone: Zone.HOSSIN,
      duration: longAlert,
      triggeringFaction: Faction.NONE,
      unstable: false,
    },
  ],
  [
    214,
    {
      title: 'Indar Conquest (high pop)',
      zone: Zone.INDAR,
      duration: longAlert,
      triggeringFaction: Faction.NONE,
      unstable: false,
    },
  ],

  // Oshur
  [
    222,
    {
      title: 'Oshur Liberation',
      zone: Zone.OSHUR,
      duration: longAlert,
      triggeringFaction: Faction.NEW_CONGLOMERATE,
      unstable: false,
    },
  ],
  [
    223,
    {
      title: 'Oshur Superiority',
      zone: Zone.OSHUR,
      duration: longAlert,
      triggeringFaction: Faction.TERRAN_REPUBLIC,
      unstable: false,
    },
  ],
  [
    224,
    {
      title: 'Oshur Enlightenment',
      zone: Zone.OSHUR,
      duration: longAlert,
      triggeringFaction: Faction.VANU_SOVEREIGNTY,
      unstable: false,
    },
  ],
  [
    226,
    {
      title: 'Oshur Conquest (high pop)',
      zone: Zone.OSHUR,
      duration: longAlert,
      triggeringFaction: Faction.NONE,
      unstable: false,
    },
  ],
])
