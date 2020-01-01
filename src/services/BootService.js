import config from '../config'

export class BootService {
  static initiateBoots (game, bootTime, boots, centerY, channel) {
    if (game.time.now > bootTime) {
      const boot = boots.getFirstExists(false)

      const minTime = 18000
      const maxTime = 22000

      const posX = game.rnd.integerInRange(0, config.gameWidth)
      boot.reset(posX, centerY)
      boot.scale.set(0.4, 0.4)

      channel.trigger('client-boots-initiated', {x: posX})

      return game.time.now + game.rnd.integerInRange(minTime, maxTime)
    }
    return bootTime
  }
}
