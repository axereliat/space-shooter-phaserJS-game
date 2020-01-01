import config from '../config'

export class AmmoService {
  static initiateAmmo (game, ammoBagTime, ammoBags, centerY, channel) {
    if (game.time.now > ammoBagTime) {
      const ammo = ammoBags.getFirstExists(false)

      const minTime = 8000
      const maxTime = 15000

      const posX = game.rnd.integerInRange(0, config.gameWidth)
      ammo.reset(posX, centerY)
      ammo.scale.set(0.4, 0.4)

      channel.trigger('client-ammo-initiated', {x: posX})

      return game.time.now + game.rnd.integerInRange(minTime, maxTime)
    }
    return ammoBagTime
  }
}
