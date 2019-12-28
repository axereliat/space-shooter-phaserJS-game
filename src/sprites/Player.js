import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.leftArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.speed = 3
  }

  update () {
    if (this.leftArrow.isDown) {
      this.position.x -= this.speed
    } else if (this.rightArrow.isDown) {
      this.position.x += this.speed
    }
    this.checkWorldBounds()
  }

  checkWorldBounds () {
    if (this.position.x > config.gameWidth - 30) {
      this.position.x = config.gameWidth - 30;
    }
    if (this.position.x < 10) {
      this.position.x = 10;
    }
  }
}
