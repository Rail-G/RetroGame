import Character from "../Character"

export default class Magician extends Character {
    constructor(level) {
        super(level),
        this.attack = 10;
        this.defence = 40;
        this.health = 100;
        this.step = 2;
        this.type = 'magician';
    }
}