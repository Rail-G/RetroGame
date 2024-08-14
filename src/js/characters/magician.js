import Character from "../Character"

export default class Magician extends Character {
    constructor(level) {
        super(level),
        this.attack = 10;
        this.defence = 40;
        this.health = 100;
        this.step = 1;
        this.distance = 4;
        this.type = 'magician';
    }
}