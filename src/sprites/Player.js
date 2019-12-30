import Phaser from 'phaser'
import config from '../config'
import {PusherService} from '../utils/PusherService'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}, multiplayer) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.leftArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.speed = 3
    this.multiplayer = multiplayer
    this.oldX = null;
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
      /* const result = PusherService.shipMoved(this.position.x, localStorage.getItem('username'))
      if (result !== null) {
        result
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
      } */
      const channel = window.pusher.subscribe('private-my-channel')
      if (this.oldX === null || Math.abs(this.oldX - this.position.x) > 10) {
        this.oldX = this.position.x;

        channel.trigger('client-ship-moved', {
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
