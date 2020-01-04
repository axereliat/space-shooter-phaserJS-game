import config from '../config'

export class AmmoService {
  static initiateAmmo (game, ammoBagTime, ammoBags, centerY, channel) {
    if (game.time.now > ammoBagTime && window.powerUpsCount < 3) {
      window.powerUpsCount++
      const ammo = ammoBags.getFirstExists(false)

      const minTime = 8000
      const maxTime = 15000

      const posX = game.rnd.integerInRange(20, config.gameWidth - 20)
      ammo.reset(posX, centerY)
      ammo.scale.set(0.4, 0.4)

      channel.trigger('client-ammo-initiated', {x: posX, id: ammo.id})

      return game.time.now + game.rnd.integerInRange(minTime, maxTime)
    }
    return ammoBagTime
  }
}
