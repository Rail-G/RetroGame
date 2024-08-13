import {calcTileType} from "../utils"

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