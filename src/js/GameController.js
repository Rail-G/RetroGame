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
import EvilTeam from './EvilTeam'

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = this.loadPlayerTeam(this.gamePlay.boardSize, 3, 3)
    this.evilTeam = this.loadEvilTeam(this.gamePlay.boardSize, 3, 3)
    this.currentCellId = null;
    this.currentNpc = undefined;
    this.currentChar = null;
    this.stepX = undefined;
    this.stepY = undefined;
    this.evilTeamStep = new EvilTeam(this.gamePlay.boardSize);
    this.antiFast = true;
    this.round = 0;
  }

  init() {
    this.gamePlay.drawUi(Object.entries(themes)[this.round][1])
    console.log(this.playerTeam, this.evilTeam)
    this.gamePlay.redrawPositions([...this.playerTeam, ...this.evilTeam])

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this))
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this))
  }

  async onCellClick(index) {
    const npc = [...this.playerTeam].find(elem => elem.position === index)
    const evilNpc = [...this.evilTeam].find(elem => elem.position === index)
    if (npc && this.currentNpc == npc.character) {
      return
    }
    if (this.currentCellId != null) {
      this.gamePlay.deselectCell(this.currentCellId)
      this.gamePlay.deselectCell(this.currentChar)
    }
    if (npc && this.antiFast) {
      this.gamePlay.selectCell(index)
      this.gamePlay.setCursor(cursors.pointer)
      this.currentCellId = index
      this.currentNpc = npc.character
      this.gamePlay.hideCellTooltip(this.currentCellId);
    } else {
      let v = true;
      if (this.currentNpc && [...this.evilTeam].some(elem => elem.position === index)) {
        if (Math.max(this.stepX, this.stepY) <= this.currentNpc.distance && 0 < Math.max(this.stepX, this.stepY)) {
          const damage = Math.round(Math.max(this.currentNpc.attack - evilNpc.character.defence, this.currentNpc.attack * 0.1))
          evilNpc.character.health = evilNpc.character.health - damage;
          this.currentNpc = undefined
          await this.gamePlay.showDamage(index, damage)
          if (evilNpc.character.health <= 0) {
            this.evilTeam = this.evilTeam.filter(elem => index != elem.position)
          }
        }
        v = false
      }
      if (v && this.currentChar == index) {
        const globPlayer = this.playerTeam.findIndex(elem =>elem.character == this.currentNpc)
        this.playerTeam[globPlayer].position = this.currentChar        
        v = true
      }
      if (this.currentChar != index) {
        this.currentCellId = null
        this.currentChar = null
        this.currentNpc = undefined
        this.gamePlay.setCursor(cursors.auto)
        return
      }
      this.gamePlay.redrawPositions([...this.playerTeam, ...this.evilTeam])
      this.currentCellId = null
      this.currentChar = null
      this.currentNpc = undefined
      this.gamePlay.setCursor(cursors.auto)
      if (this.evilTeam.length) {
        const evilAction = this.evilTeamStep.getRandomAction(this.playerTeam, this.evilTeam)
        if (evilAction.step) {
          evilAction.step[1].position = evilAction.step[0]
        } else if (evilAction.attack) {
          this.antiFast = false;
          const player = this.playerTeam.find(elem => elem.position == evilAction.attack[0])
          const damage = Math.round(Math.max(evilAction.attack[1].character.attack - player.character.defence, evilAction.attack[1].character.attack * 0.1))
          player.character.health = player.character.health - damage;
          await this.gamePlay.showDamage(evilAction.attack[0], damage)
          if (player.character.health <= 0) {
            this.playerTeam = this.playerTeam.filter(elem => evilAction.attack[0] != elem.position)
          }
          this.antiFast = true;
        }
      }
      this.gamePlay.redrawPositions([...this.playerTeam, ...this.evilTeam])
      if(!this.playerTeam.length) {
        const boardEl = document.querySelector('.board-container');
        boardEl.style.position = 'relative';
        const div = document.createElement('div')
        div.classList.add('theendinfo')
        const text = document.createElement('span')
        text.textContent = 'ПОМЕР',
        text.classList.add('losetext')
        div.appendChild(text)
        boardEl.appendChild(div)
      }
      if (!this.evilTeam.length && this.round < 3) {
        this.round++
        this.levelUp(this.playerTeam)
        const heroPosition = calcPosition('hero', this.gamePlay.boardSize)
        const uniqueHeroPosition = findUniquePosition(heroPosition, this.playerTeam.length)
        for (let i = 0; i < uniqueHeroPosition.length; i++) {
          this.playerTeam[i].position = uniqueHeroPosition[i]
        }
        this.evilTeam = this.loadEvilTeam(this.gamePlay.boardSize, 3, 3)
        this.gamePlay.drawUi(Object.entries(themes)[this.round][1])
        this.gamePlay.redrawPositions([...this.playerTeam, ...this.evilTeam])
      } else if (!this.evilTeam.length) {
        const boardEl = document.querySelector('.board-container');
        boardEl.style.position = 'relative';
        const div = document.createElement('div')
        div.classList.add('theendinfo')
        const text = document.createElement('span')
        text.textContent = 'ПОБЕДА',
        text.classList.add('wintext')
        div.appendChild(text)
        boardEl.appendChild(div)
      }
    }
  }

  onCellEnter(index) {
    const npc = [...this.playerTeam].find(elem => elem.position === index)
    const evilNpc = [...this.evilTeam].find(elem => elem.position === index)
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
          this.gamePlay.selectCell(index, 'red')
          this.gamePlay.setCursor(cursors.crosshair)
          this.currentChar = index;
        }
      } else {
        this.gamePlay.setCursor(cursors.notallowed)
        this.gamePlay.deselectCell(this.currentChar)
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  loadPlayerTeam(bSize, maxLvl, quantity) {
    const heroTeam = [Magician, Bowman, Swordsman]
    const heroGenerated = generateTeam(heroTeam, maxLvl, quantity)
    const heroPosition = calcPosition('hero', bSize)
    const uniqueHeroPosition = findUniquePosition(heroPosition, heroGenerated.characters.length)
    const finalPosition = [];

    for (let index = 0; index < quantity; index++) {
      finalPosition.push(new PositionedCharacter(heroGenerated.characters[index], uniqueHeroPosition[index]))
    }
    return finalPosition
  }

  loadEvilTeam(bSize, maxLvl, quantity) {
    const evilTeam = [Vampire, Undead, Daemon]
    const evilGenerated = generateTeam(evilTeam, maxLvl, quantity)
    const evilPosition = calcPosition('evil', bSize)
    const uniqueEvilPosition = findUniquePosition(evilPosition, evilGenerated.characters.length)
    const finalPosition = []

    for (let index = 0; index < quantity; index++) {
      finalPosition.push(new PositionedCharacter(evilGenerated.characters[index], uniqueEvilPosition[index]))
    }
    return finalPosition
  }

  levelUp(playerTeamArr) {
    playerTeamArr.forEach(elem => {
      if (elem.character.level < 4) {
        elem.character.level++
        if (elem.character.health <= 50 && elem.character.health != 1) {
            elem.character.attack = Math.round(elem.character.attack * 1.3);
            elem.character.defence = Math.round(elem.character.defence * 1.3);
        } else {
            elem.character.attack = Math.round(Math.max(elem.character.attack, elem.character.attack * (80 + elem.character.health) / 100));
            elem.character.defence = Math.round(Math.max(elem.character.defence, elem.character.defence * (80 + elem.character.health) / 100));
        }
      }
        if (elem.character.health <= 20) {
            elem.character.health = elem.character.health + 80;
        } else {
            elem.character.health = 100;
        }
    })
    return playerTeamArr
}
}
