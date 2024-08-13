import themes from './themes'
import Bowman from './characters/bowman'
import Swordsman from './characters/swordsman'
import Magician from './characters/magician'
import Vampire from './characters/vampire'
import Undead from './characters/undead'
import Daemon from './characters/daemon'
import PositionedCharacter from './PositionedCharacter'
import { generateTeam } from './generators'
import { calcPosition, findUniquePosition } from './utils'

const evilTeam = [Vampire, Undead, Daemon]
const heroTeam = [Magician, Bowman, Swordsman]
const heroGenerated = generateTeam(heroTeam, 3, 7)
const evilGenerated = generateTeam(evilTeam, 3, 7)
const heroPosition = calcPosition('hero', 8)
const evilPosition = calcPosition('evil', 8)
const uniqueHeroPosition = findUniquePosition(heroPosition, heroGenerated.characters.length)
const uniqueEvilPosition = findUniquePosition(evilPosition, evilGenerated.characters.length)


const heroFinalPosition = []
const evilFinalPosition = []

for (let index = 0; index < heroGenerated.characters.length; index++) {
  heroFinalPosition.push(new PositionedCharacter(heroGenerated.characters[index], uniqueHeroPosition[index]))
}

for (let index = 0; index < evilGenerated.characters.length; index++) {
  evilFinalPosition.push(new PositionedCharacter(evilGenerated.characters[index], uniqueEvilPosition[index]))
}

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.mountain)

    this.gamePlay.redrawPositions([...heroFinalPosition, ...evilFinalPosition])

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this))
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    const npc = [...heroFinalPosition, ...evilFinalPosition].find(elem => elem.position === index)
    if(npc) {
      const npcCharacter = npc.character
      const desc = `${'\u{1F396}'}: ${npcCharacter.level} ${'\u2694'} ${npcCharacter.attack} ${`\u{1F6E1}`} ${npcCharacter.defence} ${'\u2764'} ${npcCharacter.health}`
      this.gamePlay.showCellTooltip(desc, index)
    }
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }
}
