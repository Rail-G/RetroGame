import Character from "../Character";
import Swordsman from "../characters/swordsman";
import Vampire from "../characters/vampire";
import Daemon from "../characters/daemon";
import { generateTeam, characterGenerator } from "../generators";

test('error test', () => {
    expect(() => new Character(1)).toThrowError('Вам не доступна это команда!')
})

const data = [
    ['swordsman', 3, Swordsman, 40, 10],
    ['vampire', 2, Vampire, 25, 25],
    ['daemon', 1, Daemon, 10, 10],
]

test.each(data)('create %s class', (type, lvl, className, att, def) => {
    const test = new className(lvl)
    const expectResult = {level: test.level, attack: test.attack, defence: test.defence, type: test.type}
    const finalResult = {level: lvl, attack: att, defence: def, type: type}
    expect(expectResult).toEqual(finalResult)
})

test('generate hero/evil character', () => {
    const team = [Vampire, Swordsman, Daemon]
    const result = []
    const npc = characterGenerator(team, 1)
    for (let i = 0; i < 15; i++) {
        result.push(npc)
    }
    expect(result).toHaveLength(15)
})

test("test generatorTeam function", () => {
    const team = [Vampire, Swordsman, Daemon]
    const npcTeam = generateTeam(team, 5, 15)
    expect(npcTeam.characters).toHaveLength(15)
    expect(npcTeam.characters).toEqual(expect.anything())
})