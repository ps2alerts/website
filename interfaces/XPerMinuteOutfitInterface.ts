import XPerMinuteInterface from '~/interfaces/XPerMinuteInterface'

export default interface XPerMinuteOutfitInterface extends XPerMinuteInterface {
  killsPerMinutePerParticipant: number
  deathsPerMinutePerParticipant: number
  teamKillsPerMinutePerParticipant: number
  suicidesPerMinutePerParticipant: number
  headshotsPerMinutePerParticipant: number
}
