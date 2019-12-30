import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.speed = 3
  }

  update () {
    const channel = window.pusher.subscribe('private-my-channel')
    channel.bind('client-ship-moved', data => {
      if (data.nickname !== localStorage.getItem('username')) {
        this.position.x = data.x
      }
    })
    this.checkWorldBounds()
  }

  checkWorldBounds () {
    if (this.position.x > config.gameWidth - 30) {
      this.position.x = config.gameWidth - 30
    }
    if (this.position.x < 10) {
      this.position.x = 10
    }
  }
}
