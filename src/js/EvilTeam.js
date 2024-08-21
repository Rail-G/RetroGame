import GameController from "./GameController"

export default class EvilTeam {
    constructor(bSize) {
        this.evilTeam = undefined;
        this.playerTeam = undefined;
        this.bSize = bSize;
        this.calculatedPositions = {step: [], distance: []};
        this.checkedPlayers = {player: {step: [], distance: []}, evil: []};
    }

    getRandomNpc() {
        const randomId = Math.floor(Math.random() * this.evilTeam.length)
        return this.evilTeam[randomId]
    }

    setRandomPosition(evilNpc) {
        let randomPosition = Math.floor(Math.random() * this.calculatedPositions.step.length)
        const allPositions = [...this.checkedPlayers.evil, ...this.checkedPlayers.player.step]
        while(true) {
            if (!allPositions.includes(this.calculatedPositions.step[randomPosition])) {
                break
            }
            randomPosition = Math.floor(Math.random() * this.calculatedPositions.step.length)
        }
        // console.log(this.calculatedPositions, this.calculatedPositions.step[randomPosition], allPositions)
        return [this.calculatedPositions.step[randomPosition], evilNpc]
    }

    attackPlayer(evilNpc) {
        return [this.checkedPlayers.player.distance[Math.floor(Math.random() * this.checkedPlayers.player.distance.length)], evilNpc]
    }

    calculatePositions() {
        const evilNpc = this.getRandomNpc()
        for (let index = 0; index < this.bSize ** 2; index++) {
            const stepX = Math.abs(Math.floor(evilNpc.position / this.bSize) - Math.floor(index / this.bSize))
            const stepY = Math.abs(Math.floor(evilNpc.position % this.bSize) - Math.floor(index % this.bSize))
            const position = Math.max(stepX, stepY)
            if (position <= evilNpc.character.step && position > 0) {
                this.calculatedPositions.step.push(index)
            }
            if (position <= evilNpc.character.distance && position > 0) {
                this.calculatedPositions.distance.push(index)
            }
        }
        return evilNpc
    }

    checkToPlayerDistance () {
        for (let index = 0; index < this.playerTeam.length; index++) {
            if(this.calculatedPositions.step.includes(this.playerTeam[index].position)) {
                this.checkedPlayers.player.step.push(this.playerTeam[index].position)
            }
            if(this.calculatedPositions.distance.includes(this.playerTeam[index].position)) {
                this.checkedPlayers.player.distance.push(this.playerTeam[index].position)
            }
        }
    }

    checkToEvilDistance () {
        for (let index = 0; index < this.evilTeam.length; index++) {
            if(this.calculatedPositions.step.includes(this.evilTeam[index].position)) {
                this.checkedPlayers.evil.push(this.evilTeam[index].position)
            }
        }
    }

    getRandomAction(playerTeam, evilTeam) {
        this.playerTeam = playerTeam;
        this.evilTeam = evilTeam;
        this.calculatedPositions = {step: [], distance: []};
        this.checkedPlayers = {player: {step: [], distance: []}, evil: []};
        const evilNpc = this.calculatePositions()
        this.checkToPlayerDistance()
        this.checkToEvilDistance()
        const action = Math.round(Math.random()) ? 'attack' : 'step'
        if (!this.checkedPlayers.player.distance.length || action == 'step') {
            return {step: this.setRandomPosition(evilNpc)}
        } else {
            return {attack: this.attackPlayer(evilNpc)}
        }   
    }
}