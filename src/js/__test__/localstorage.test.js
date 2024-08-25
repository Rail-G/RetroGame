import GameStateService from "../GameStateService.js"

jest.mock('../GameStateService.js')
beforeEach(() => {
    jest.resetAllMocks()
})

test('good mocked', () => {
    const storage = {getItem: jest.fn(() => JSON.stringify({level: 1, attack: 25, defence: 25, health: 100, step: 2, distance: 2, type: 'vampire'}))}
    const stateService = new GameStateService(storage)
    stateService.load.mockReturnValue({level: 1, attack: 25, defence: 25, health: 100, step: 2, distance: 2, type: 'vampire'})
    expect(stateService.load()).toEqual({level: 1, attack: 25, defence: 25, health: 100, step: 2, distance: 2, type: 'vampire'})
})

test('error mocked', () => {
    const storage = {
      getItem: jest.fn(() => {throw new Error('Invalid state')})
    };
    const stateService = new GameStateService(storage)
    stateService.load.mockImplementation(() => {throw new Error('Invalid state')})
    expect(() => stateService.load()).toThrow('Invalid state')
  })