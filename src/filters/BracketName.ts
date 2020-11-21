import {Bracket} from "@/constants/Bracket";

export const BracketName = function(value: Bracket) {
  switch (value) {
    case Bracket.NONE:
      return 'N/A'
    case Bracket.AFTERNOON:
      return 'Afternoon'
    case Bracket.PRIME:
      return 'Prime'
    case Bracket.MORNING:
      return 'Morning'
    default:
      return 'UNKNOWN!'
  }
}
