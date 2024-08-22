export default class GameState {
    static firstInfo = 0;
    static allPoint = 0;
  
  static saveFirstInfo(length) {
    this.firstInfo = this.firstInfo + length
  }
  static calculatePoint(arr) {
    const players = arr.length
    const playersHealth = arr.reduce((sum, curr) => sum + curr.character.health, 0)
    const evilNpc = this.firstInfo
    console.log(players, playersHealth, evilNpc)
    this.allPoint = this.allPoint + 100 * players + playersHealth + 100 * evilNpc
    return this.allPoint
  }
}
