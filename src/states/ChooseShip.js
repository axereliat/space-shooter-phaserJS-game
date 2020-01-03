import Phaser from 'phaser'
import config from '../config'
import uuidv1 from 'uuid/v1'

export default class extends Phaser.State {
  init () {
  }

  preload () {
    this.background = this.game.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, 'background')

    this.playerShip = ''
    this.enemyShip = ''

    this.game.add.text(this.world.centerX - 180, 20, 'Choose your ship', {
      font: '64px Arial',
      fill: '#dddddd',
      align: 'center'
    })
    const ship1Btn = this.game.add.button(50, this.world.centerY - 120, 'ship1', () => {
      if (this.playerShip) {
        return
      }
      this.playerShip = 'ship1'
      window.channel.trigger('client-ship-chosen', {key: 'ship1'})
      ship1Btn.kill()
    }, this, 2, 1, 0)

    const ship2Btn = this.game.add.button(350, this.world.centerY - 120, 'ship2', () => {
      if (this.playerShip) {
        return
      }
      this.playerShip = 'ship2'
      window.channel.trigger('client-ship-chosen', {key: 'ship2'})
      ship2Btn.kill()
    }, this, 2, 1, 0)

    const ship3Btn = this.game.add.button(650, this.world.centerY - 120, 'ship3', () => {
      if (this.playerShip) {
        return
      }
      this.playerShip = 'ship3'
      window.channel.trigger('client-ship-chosen', {key: 'ship3'})
      ship3Btn.kill()
    }, this, 2, 1, 0)

    window.channel.bind('client-ship-chosen', data => {
      if (data.key === 'ship1') {
        ship1Btn.kill()
      }
      if (data.key === 'ship2') {
        ship2Btn.kill()
      }
      if (data.key === 'ship3') {
        ship3Btn.kill()
      }
      this.enemyShip = data.key
    })
  }

  update () {
    if (this.playerShip && this.enemyShip) {
      this.state.start('Game', true, false, {playerShip: this.playerShip, enemyShip: this.enemyShip})
    }
  }

  create () {
  }
}
