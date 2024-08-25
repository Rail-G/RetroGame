import {calcTileType, calcHealthLevel, calcPosition, findUniquePosition} from "../utils"

const data = [
    ['top-right', 3, 4],
    ['bottom-right', 3, 2],
    ['bottom-left', 56, 8],
    ['center', 7, 5],
    ['top', 4, 7],
    ['top-left', 0, 3],
    ['bottom', 33, 6],
    ['left', 14, 7],
    ['right', 17, 9]
]

test.each(data)('Tile type %s', (result, index, boardSize) => {
    expect(calcTileType(index, boardSize)).toBe(result)
})

const heathData = [
    ['critical', 10],
    ['normal', 44],
    ['high', 90]
]

test.each(heathData)('calcHealthLevel %s', (result, value) => {
    expect(calcHealthLevel(value)).toBe(result)
})

test('calcPosition for hero/evil', () => {
    expect(calcPosition('hero', 5)).toEqual([0,1,5,6,10,11,15,16,20,21])
    expect(calcPosition('evil', 5)).toEqual([3,4,8,9,13,14,18,19,23,24])
})

test('findUniquePosition for hero/evil', () => {
    expect(findUniquePosition([0,1,5,6,10,11,15,16,20,21], 2)).toHaveLength(2)
    expect(findUniquePosition([1,1,1,1,1,1,1,1,1,1,2], 2)).toHaveLength(2)
    expect(findUniquePosition([3,4,8,9,13,14,18,19,23,24], 3)).toHaveLength(3)
})