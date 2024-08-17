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
import cursors from './cursors'

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.npcPosition = this.loadGame(this.gamePlay.boardSize, 3, 3)
    this.currentCellId = null;
    this.currentNpc = undefined;
    this.currentChar = null;
    this.stepX = undefined;
    this.stepY = undefined;
  }

  init() {
    this.gamePlay.drawUi(themes.mountain)

    this.gamePlay.redrawPositions([...this.npcPosition.player, ...this.npcPosition.evil])

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this))
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this))
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  async onCellClick(index) {
    const npc = [...this.npcPosition.player].find(elem => elem.position === index)
    const evilNpc = [...this.npcPosition.evil].find(elem => elem.position === index)
    if (this.currentCellId != null) {
      this.gamePlay.deselectCell(this.currentCellId)
      this.gamePlay.deselectCell(this.currentChar)
      // this.currentCellId = null
    }
    if (npc) {
      this.gamePlay.selectCell(index)
      this.gamePlay.setCursor(cursors.pointer)
      this.currentCellId = index
      this.currentNpc = npc.character
      this.gamePlay.hideCellTooltip(this.currentCellId);
    } else {
      let v = true;
      if (this.currentNpc && [...this.npcPosition.evil].some(elem => elem.position === index) || [...this.npcPosition.player].some(elem => elem.position === index)) {
        if (Math.max(this.stepX, this.stepY) <= this.currentNpc.distance && 0 < Math.max(this.stepX, this.stepY)) {
          const damage = Math.max(this.currentNpc.attack - evilNpc.character.defence, this.currentNpc.attack * 0.1)
          evilNpc.character.health = evilNpc.character.health - damage;
          this.currentNpc = undefined
          await this.gamePlay.showDamage(index, damage)
          if (evilNpc.character.health <= 0) {
            this.npcPosition.evil = this.npcPosition.evil.filter(elem => index != elem.position)
          }
          this.gamePlay.redrawPositions([...this.npcPosition.player, ...this.npcPosition.evil])
        }
        v = false
      }
      if (v && this.currentChar == index) {
        const globPlayer = this.npcPosition.player.findIndex(elem =>elem.character == this.currentNpc)
        this.npcPosition.player[globPlayer].position = this.currentChar
        this.gamePlay.redrawPositions([...this.npcPosition.player, ...this.npcPosition.evil])
        v = true
      }
      this.currentCellId = null
      this.currentChar = null
      this.currentNpc = undefined
      this.gamePlay.setCursor(cursors.auto) 
    }
  }

  onCellEnter(index) {
    const npc = [...this.npcPosition.player].find(elem => elem.position === index)
    const evilNpc = [...this.npcPosition.evil].find(elem => elem.position === index)
    if(npc) {
      const npcCharacter = npc.character
      const desc = `${'\u{1F396}'}: ${npcCharacter.level} ${'\u2694'} ${npcCharacter.attack} ${`\u{1F6E1}`} ${npcCharacter.defence} ${'\u2764'} ${npcCharacter.health}`
      this.gamePlay.showCellTooltip(desc, index)
    }
    if (!this.currentNpc) {
      return
    }
    this.stepX = Math.abs(Math.floor(this.currentCellId / this.gamePlay.boardSize) - Math.floor(index / this.gamePlay.boardSize))
    this.stepY = Math.abs(Math.floor(this.currentCellId % this.gamePlay.boardSize) - Math.floor(index % this.gamePlay.boardSize))
    if (this.currentNpc != undefined) {
      if (Math.max(this.stepX, this.stepY) <= this.currentNpc.step && 0 < Math.max(this.stepX, this.stepY)) {
        if (this.currentChar != null) {
          this.gamePlay.deselectCell(this.currentChar)
        }
        this.gamePlay.selectCell(index, 'green')
        this.gamePlay.setCursor(cursors.pointer) 
        if (npc && npc.position == index) {
          this.gamePlay.deselectCell(index)
        }
        if (evilNpc && evilNpc.position == index) {
          this.gamePlay.deselectCell(index)
          if (Math.max(this.stepX, this.stepY) <= this.currentNpc.distance && 0 < Math.max(this.stepX, this.stepY)) {
            this.gamePlay.selectCell(index, 'red')
            this.gamePlay.setCursor(cursors.crosshair)
          }
        }
        this.currentChar = index;
      } else if (Math.max(this.stepX, this.stepY) <= this.currentNpc.distance && 0 < Math.max(this.stepX, this.stepY)) {
        this.gamePlay.setCursor(cursors.pointer) 
        this.gamePlay.deselectCell(this.currentChar)
        if (evilNpc && evilNpc.position == index) {
          // this.gamePlay.deselectCell(this.currentChar)
          this.gamePlay.selectCell(index, 'red')
          this.gamePlay.setCursor(cursors.crosshair)
          this.currentChar = index;
        }
      } else {
        this.gamePlay.setCursor(cursors.notallowed)
        this.gamePlay.deselectCell(this.currentChar)
      }
    }
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  loadGame(bSize, maxLvl, quantity) {
    const evilTeam = [Vampire, Undead, Daemon]
    const heroTeam = [Magician, Bowman, Swordsman]
    const heroGenerated = generateTeam(heroTeam, maxLvl, quantity)
    const evilGenerated = generateTeam(evilTeam, maxLvl, quantity)
    const heroPosition = calcPosition('hero', bSize)
    const evilPosition = calcPosition('evil', bSize)
    const uniqueHeroPosition = findUniquePosition(heroPosition, heroGenerated.characters.length)
    const uniqueEvilPosition = findUniquePosition(evilPosition, evilGenerated.characters.length)
    const finalPosition = {player: [], evil: []}

    for (let index = 0; index < quantity; index++) {
      finalPosition.player.push(new PositionedCharacter(heroGenerated.characters[index], uniqueHeroPosition[index]))
      finalPosition.evil.push(new PositionedCharacter(evilGenerated.characters[index], uniqueEvilPosition[index]))
    }
    return finalPosition
  }
}
