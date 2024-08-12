import Team from './Team'
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while(true) {
    const randomHeroIndex = Math.floor(Math.random() * allowedTypes.length)
    const randomLvlIndex = Math.floor(Math.random() * maxLevel)
    const randomHero = allowedTypes[randomHeroIndex]
    yield new randomHero(randomLvlIndex)
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = new Team()
  const hero = characterGenerator(allowedTypes, maxLevel)
  for (let i = 0; i < characterCount; i++) {
    team.add(hero.next().value)
  }
  return team
}
