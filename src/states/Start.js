import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
  init () {
  }

  preload () {
    this.background = this.game.add.tileSprite(0, 0, 800, 600, 'background')
    const title = this.game.add.sprite(this.world.centerX - 320, 50, 'title')
    title.scale.set(0.8, 0.8)
    const authorText = this.game.add.text(this.world.centerX, config.gameHeight - 20, 'Made by Mario Markov, 2018', { font: '24px Arial', fill: '#dddddd', align: 'center' })
    authorText.anchor.setTo(0.5, 0.5)
    this.game.add.button(this.game.world.centerX - 140, this.world.centerY, 'startBtn', () => {
      this.state.start('Game')
    }, this, 2, 1, 0)

    $('#scoreForm').modal('show')
  }

  create () {
  }
}
