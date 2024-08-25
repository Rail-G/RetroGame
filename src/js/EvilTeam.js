export default class EvilTeam {
    constructor(bSize) {
        this.evilTeam = undefined;
        this.playerTeam = undefined;
        this.bSize = bSize;
        this.calculatedPositions = {step: [], distance: []};
        this.checkedPlayers = {player: {step: [], distance: []}, evil: {step: [], distance: []}};
    }

    getRandomNpc() {
        const randomId = Math.floor(Math.random() * this.evilTeam.length)
        return this.evilTeam[randomId]
    }

    setRandomPosition(evilNpc) {
        let randomPosition = Math.floor(Math.random() * this.calculatedPositions.step.length)
        const allPositions = [...this.checkedPlayers.evil.step, ...this.checkedPlayers.player.step]
        /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
        while(true) {
            if (!allPositions.includes(this.calculatedPositions.step[randomPosition])) {
                break
            }
            randomPosition = Math.floor(Math.random() * this.calculatedPositions.step.length)
        }
        return [this.calculatedPositions.step[randomPosition], evilNpc]
    }

    attackPlayer(evilNpc) {
        const playerInDistance = this.checkedPlayers.player.distance
        const result = {}
        if (playerInDistance.length) {
            this.playerTeam.forEach(elem => {
                if (playerInDistance.includes(elem.position) && elem.character.health < 100) {
                    result[elem.position] = elem.character.health
                }
            })
        }
        let currPosition = Object.keys(result)[0]
        Object.keys(result).find(elem => {
            if (result[elem] < result[currPosition]) {
                currPosition = elem
            }
        })
        if (Object.keys(result).length) {
            return [currPosition, evilNpc]
        }
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
                this.checkedPlayers.evil.step.push(this.evilTeam[index].position)
            }
            if(this.calculatedPositions.distance.includes(this.evilTeam[index].position)) {
                this.checkedPlayers.evil.distance.push(this.evilTeam[index].position)
            }
        }
    }

    healthTeamNpc() {
        const npcInDistance = this.checkedPlayers.evil.distance
        const result = {}
        if (npcInDistance.length) {
            this.evilTeam.forEach(elem => {
                if (npcInDistance.includes(elem.position) && elem.character.health < 100) {
                    result[elem.position] = elem.character.health
                }
            })
        }
        let currId = Object.keys(result)[0]
        Object.keys(result).find(elem => {
            if (result[elem] < result[currId]) {
                currId = elem
            }
        })
        return currId
    }

    getRandomAction(playerTeam, evilTeam) {
        this.playerTeam = playerTeam;
        this.evilTeam = evilTeam;
        this.calculatedPositions = {step: [], distance: []};
        this.checkedPlayers = {player: {step: [], distance: []}, evil: {step: [], distance: []}};
        const evilNpc = this.calculatePositions()
        this.checkToPlayerDistance()
        this.checkToEvilDistance()
        if (Math.round(Math.random()) && evilNpc.character.type == 'vampire') {
            const healthy = this.healthTeamNpc()
            if (healthy != undefined) {
                return {health: healthy}
            }
        }
        const action = Math.round(Math.random()) ? 'attack' : 'step'
        if (!this.checkedPlayers.player.distance.length || action == 'step') {
            return {step: this.setRandomPosition(evilNpc)}
        } else {
            return {attack: this.attackPlayer(evilNpc)}
        }   
    }
}