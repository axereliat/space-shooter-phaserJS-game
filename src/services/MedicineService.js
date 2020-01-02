import config from '../config'

export class MedicineService {
  static initiateMedicine (game, medicineTime, medicines, centerY, channel) {
    if (game.time.now > medicineTime && window.powerUpsCount < 3) {
      window.powerUpsCount++
      const medicine = medicines.getFirstExists(false)

      const minTime = 18000
      const maxTime = 22000

      const posX = game.rnd.integerInRange(0, config.gameWidth)
      medicine.reset(posX, centerY)
      medicine.scale.set(0.4, 0.4)

      channel.trigger('client-medicine-initiated', {x: posX})

      return game.time.now + game.rnd.integerInRange(minTime, maxTime)
    }
    return medicineTime
  }
}
