/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left'
  } else if (index < boardSize - 1) {
    return 'top'
  } else if (index == boardSize - 1) {
    return 'top-right'
  } else if(index == boardSize * (boardSize - 1)) {
    return 'bottom-left'
  } else if (index == boardSize ** 2 - 1) {
    return "bottom-right"
  } else if (index % boardSize == 0) {
    return 'left'
  } else if (index % boardSize == boardSize - 1) {
    return 'right'
  } else if (index > boardSize ** 2 - boardSize) {
    return 'bottom'
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function calcPosition(team, boardSize) {
  const result = []
  let teamId = null
  if (team == 'hero') {
    teamId = 0
  } else if (team =='evil') {
    teamId = boardSize - 2
  }
  for (let i = 0; i < boardSize; i++) {
    result.push(teamId + boardSize * i)
    result.push(teamId + 1 + boardSize * i)
  }
  return result
}


export function findUniquePosition(arr, teamLength) {
  let count = 0;
  const result = []
  while (teamLength > count) {
    const uniqueNum = arr[Math.floor(Math.random() * arr.length)]
    if (result.includes(uniqueNum)) {
      continue
    }
    result.push(uniqueNum)
    count++
  }
  return result
}

