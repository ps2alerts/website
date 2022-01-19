import { Zone } from './Zone'
import { Faction } from './Faction'
import { MetagameDetailsInterface } from '@/interfaces/MetagameDetailsInterface'

export enum MetagameEventType {
  // VS Triggered
  INDAR_ENLIGHTENMENT = 148,
  HOSSIN_ENLIGHTENMENT = 154,
  AMERISH_ENLIGHTENMENT = 157,
  ESAMIR_ENLIGHTENMENT = 151,

  // NC Triggered
  INDAR_LIBERATION = 149,
  HOSSIN_LIBERATION = 155,
  AMERISH_LIBERATION = 158,
  ESAMIR_LIBERATION = 152,

  // TR Triggered
  INDAR_SUPERIORITY = 147,
  HOSSIN_SUPERIORITY = 153,
  AMERISH_SUPERIORITY = 156,
  ESAMIR_SUPERIORITY = 150,

  // Current Generation Unstable Meltdowns
  NC_INDAR_UNSTABLE_MELTDOWN = 179,
  NC_HOSSIN_UNSTABLE_MELTDOWN = 177,
  NC_AMERISH_UNSTABLE_MELTDOWN = 178,
  NC_ESAMIR_UNSTABLE_MELTDOWN = 176,

  VS_INDAR_UNSTABLE_MELTDOWN = 189,
  VS_HOSSIN_UNSTABLE_MELTDOWN = 187,
  VS_AMERISH_UNSTABLE_MELTDOWN = 188,
  VS_ESAMIR_UNSTABLE_MELTDOWN = 186,

  TR_INDAR_UNSTABLE_MELTDOWN = 193,
  TR_HOSSIN_UNSTABLE_MELTDOWN = 191,
  TR_AMERISH_UNSTABLE_MELTDOWN = 192,
  TR_ESAMIR_UNSTABLE_MELTDOWN = 190,

  // High pop alerts
  AMERISH_HIGH_POP_CONQUEST = 211,
  ESAMIR_HIGH_POP_CONQUEST = 212,
  HOSSIN_HIGH_POP_CONQUEST = 213,
  INDAR_HIGH_POP_CONQUEST = 214,
}

export const metagameEventTypeArray = [
  147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 176, 177, 178,
  179, 186, 187, 188, 189, 190, 191, 192, 193, 211, 212, 213, 214,
]

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
])
