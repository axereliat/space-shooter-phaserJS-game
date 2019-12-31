import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}, multiplayer) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.leftArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.speed = 3
    this.oldX = null

    this.channel = window.pusher.subscribe(localStorage.getItem('channelName'))
  }

  update () {
    let isMoving = false
    if (this.leftArrow.isDown) {
      isMoving = true
      this.position.x -= this.speed
    } else if (this.rightArrow.isDown) {
      isMoving = true
      this.position.x += this.speed
    }
    if (isMoving) {
      if (this.oldX === null || Math.abs(this.oldX - this.position.x) > 15) {
        this.oldX = this.position.x;

        this.channel.trigger('client-ship-moved', {
          x: this.position.x,
          nickname: localStorage.getItem('username')
        })
      }
    }
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
