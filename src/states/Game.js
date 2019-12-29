/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import OtherPlayer from '../sprites/OtherPlayer'

export default class extends Phaser.State {
  init () {
  }

  preload () {
  }

  create () {
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT

    this.lives = 5
    this.score = 0

    this.background = this.game.add.tileSprite(0, 0, 800, 600, 'background')
    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.bounds.bottom - 30,
      asset: 'player'
    })
    this.otherPlayer = new OtherPlayer({
      game: this.game,
      x: this.world.centerX + 30,
      y: this.world.bounds.bottom - 30,
      asset: 'player'
    })
    this.game.physics.arcade.enable(this.player)
    this.player.physicsType = Phaser.Physics.ARCADE

    this.player.scale.set(0.2, 0.2)
    this.otherPlayer.scale.set(0.2, 0.2)
    this.game.add.existing(this.player)
    this.game.add.existing(this.otherPlayer)
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.game.input.onDown.add(this.gofull, this)
  }

  gofull () {
    if (this.game.scale.isFullScreen) {
      this.game.scale.stopFullScreen()
    } else {
      this.game.scale.startFullScreen(false)
    }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }
}
