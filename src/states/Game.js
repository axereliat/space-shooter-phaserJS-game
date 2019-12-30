/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Enemy from '../sprites/Enemy'

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
    this.enemy = new Enemy({
      game: this.game,
      x: this.world.centerX + 30,
      y: this.world.bounds.top + 30,
      asset: 'enemy'
    })
    this.game.physics.arcade.enable(this.player)
    this.player.physicsType = Phaser.Physics.ARCADE

    this.game.physics.arcade.enable(this.enemy)
    this.enemy.physicsType = Phaser.Physics.ARCADE

    this.player.scale.set(0.2, 0.2)
    this.enemy.scale.set(0.2, -0.2)
    this.game.add.existing(this.player)
    this.game.add.existing(this.enemy)
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.fireRate = 1200
    this.bulletTime = 0
    this.bullets = this.game.add.group()
    this.bullets.enableBody = true
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE
    this.bullets.createMultiple(50, 'bullet')
    this.bullets.setAll('anchor.x', 0.5)
    this.bullets.setAll('anchor.y', 1)
    this.bullets.setAll('outOfBoundsKill', true)
    this.bullets.setAll('checkWorldBounds', true)

    this.explosions = this.game.add.group()
    this.explosions.createMultiple(30, 'explosion')

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
          bullet.reset(this.enemy.x, this.enemy.y + 90)
          bullet.body.velocity.y = 400
          bullet.angle = 0
        }
      }
    })

    this.game.input.onDown.add(this.gofull, this)
  }

  bulletAndShipCollisionHandler (ship, bullet) {
    bullet.kill()

    this.painAudio.play()
    const explosion = this.explosions.getFirstExists(false)
    explosion.scale.set(1.2, 1.2)
    ship.sendToBack()
    this.background.sendToBack()
    explosion.reset(ship.body.x - 30, ship.body.y - 30)
    explosion.animations.add('explode', [0, 1, 2, 3, 4, 5], false)
    explosion.play('explode', 30, false, true)
  }

  update () {
    if (this.fireButton.isDown) {
      this.fireBullet()
    }

    this.game.physics.arcade.overlap(this.bullets, this.enemy, this.bulletAndShipCollisionHandler, null, this)
    this.game.physics.arcade.overlap(this.bullets, this.player, this.bulletAndShipCollisionHandler, null, this)
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
        bullet.reset(this.player.x, this.player.y - 40)
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
