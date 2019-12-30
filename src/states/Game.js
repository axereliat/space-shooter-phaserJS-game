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

    this.painAudio = this.game.add.audio('pain')
    this.shotAudio = this.game.add.audio('shot')

    this.background = this.game.add.tileSprite(0, 0, 800, 600, 'background')
    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.bounds.bottom - 30,
      asset: 'player'
    }, true)
    this.otherPlayer = new OtherPlayer({
      game: this.game,
      x: this.world.centerX + 30,
      y: this.world.bounds.top + 30,
      asset: 'enemy'
    })
    this.game.physics.arcade.enable(this.player)
    this.player.physicsType = Phaser.Physics.ARCADE

    this.player.scale.set(0.2, 0.2)
    this.otherPlayer.scale.set(0.2, -0.2)
    this.game.add.existing(this.player)
    this.game.add.existing(this.otherPlayer)
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.fireRate = 350
    this.bulletTime = 0
    this.bullets = this.game.add.group()
    this.bullets.enableBody = true
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE
    this.bullets.createMultiple(50, 'bullet')
    this.bullets.setAll('anchor.x', 0.5)
    this.bullets.setAll('anchor.y', 1)
    this.bullets.setAll('outOfBoundsKill', true)
    this.bullets.setAll('checkWorldBounds', true)

    this.channel = window.pusher.subscribe('private-my-channel')

    this.channel.bind('client-fire-bullet', data => {
      if (data.nickname !== localStorage.getItem('username')) {
        const bulletArr = []
        this.bullets.forEachDead(bullet => {
          bulletArr.push(bullet)
        })
        const bullet = bulletArr[0]
        if (bullet) {
          this.shotAudio.play()
          bullet.reset(this.otherPlayer.x, this.otherPlayer.y + 15)
          bullet.body.velocity.y = 400
          bullet.angle = 0
        }
      }
    })

    this.game.input.onDown.add(this.gofull, this)
  }

  update () {
    if (this.fireButton.isDown) {
      this.fireBullet()
    }
  }

  gofull () {
    if (this.game.scale.isFullScreen) {
      this.game.scale.stopFullScreen()
    } else {
      this.game.scale.startFullScreen(false)
    }
  }

  fireBullet () {
    const bulletArr = []
    this.bullets.forEachDead(bullet => {
      bulletArr.push(bullet)
    })
    const bullet = bulletArr[0]
    if (bullet) {
      if (this.game.time.now > this.bulletTime) {
        this.channel.trigger('client-fire-bullet', {
          x: bullet.position.x,
          nickname: localStorage.getItem('username')
        })
        this.shotAudio.play()
        bullet.reset(this.player.x, this.player.y - 15)
        bullet.body.velocity.y = -400
        bullet.angle = 0
        this.bulletTime = this.game.time.now + this.fireRate
      }
    }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }
}
