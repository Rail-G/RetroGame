import Character from "../Character"

export default class Swordsman extends Character {
    constructor(level) {
        super(level),
        this.attack = 40;
        this.defence = 10;
        this.health = 100;
        this.step = 1;
        this.type = 'swordsman'
    }
}