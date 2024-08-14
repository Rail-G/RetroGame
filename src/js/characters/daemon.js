import Character from "../Character"

export default class Daemon extends Character {
    constructor(level) {
        super(level),
        this.attack = 10;
        this.defence = 10;
        this.health = 100;
        this.step = 1;
        this.distance = 4;
        this.type = 'daemon'
    }
}