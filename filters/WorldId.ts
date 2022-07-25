import { World } from '@/ps2alerts-constants/world'

export const WorldId = (world: string): World => {
  switch (world.toLowerCase()) {
    // PC worlds
    case 'cobalt':
      return World.COBALT
    case 'connery':
      return World.CONNERY
    case 'emerald':
      return World.EMERALD
    case 'jaeger':
      return World.JAEGER
    case 'miller':
      return World.MILLER
    case 'soltech':
      return World.SOLTECH
    // PS4 Worlds
    case 'ceres':
      return World.CERES
    case 'genudine':
      return World.GENUDINE
    default:
      return 0
  }
}
