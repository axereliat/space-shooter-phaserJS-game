/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Enemy from '../sprites/Enemy'
import config from '../config'
import {AmmoService} from '../services/AmmoService'
import {MedicineService} from '../services/MedicineService'
import uuidv1 from 'uuid/v1'

export default class extends Phaser.State {
  constructor () {
    super()
  }

  init (payload) {
    this.playerShip = payload.playerShip
    this.enemyShip = payload.enemyShip

    this.stage.backgroundColor = '#000000'
  }

  preload () {
  }

  create () {
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT

    this.poweredGun = false

    window.powerUpsCount = 0

    this.powerupAudio = this.game.add.audio('powerup')
    this.painAudio = this.game.add.audio('pain')
    this.shotAudio = this.game.add.audio('shot')

    this.background = this.game.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, 'background')

    this.game.add.text(10, config.gameHeight - 120, localStorage.getItem('username'), {
      font: '34px Times New Roman',
      fill: '#fff'
    })

    this.game.add.text(10, 80, window.enemyName, {
      font: '34px Times New Roman',
      fill: '#fff'
    })

    this.playerLivesScale = 0.5
    this.enemyLivesScale = 0.5

    this.playerHealthBar = this.game.add.image(0, config.gameHeight - 20, 'green')
    this.playerHealthBar.scale.set(this.playerLivesScale, 1)
    this.playerHealthBar.bringToTop()

    this.enemyHealthBar = this.game.add.image(0, -config.gameHeight - 460, 'green')
    this.enemyHealthBar.scale.set(this.enemyLivesScale, 1)
    this.enemyHealthBar.bringToTop()

    this.livesDecrement = 0.05

    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.bounds.bottom - 60,
      asset: this.playerShip
    }, true)
    this.enemy = new Enemy({
      game: this.game,
      x: this.world.centerX + 30,
      y: this.world.bounds.top + 60,
      asset: this.enemyShip
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
    this.bullets.forEach(b => {
      b.id = uuidv1()
    })

    this.ammoBagTime = this.game.time.now + 3000
    this.ammoBags = this.game.add.group()
    this.ammoBags.enableBody = true
    this.ammoBags.physicsBodyType = Phaser.Physics.ARCADE
    this.ammoBags.createMultiple(50, 'ammo')
    this.ammoBags.setAll('anchor.x', 0.5)
    this.ammoBags.setAll('anchor.y', 1)
    this.ammoBags.setAll('outOfBoundsKill', true)
    this.ammoBags.setAll('checkWorldBounds', true)
    this.ammoBags.forEach(a => {
      a.id = uuidv1()
    })

    this.medicineTime = this.game.time.now + 5000
    this.medicines = this.game.add.group()
    this.medicines.enableBody = true
    this.medicines.physicsBodyType = Phaser.Physics.ARCADE
    this.medicines.createMultiple(50, 'medicine')
    this.medicines.setAll('anchor.x', 0.5)
    this.medicines.setAll('anchor.y', 1)
    this.medicines.setAll('outOfBoundsKill', true)
    this.medicines.setAll('checkWorldBounds', true)
    this.medicines.forEach(m => {
      m.id = uuidv1()
    })

    this.explosions = this.game.add.group()
    this.explosions.createMultiple(30, 'explosion')

    this.channel = window.pusher.subscribe(localStorage.getItem('channelName'))

    this.channel.bind('client-fire-bullet', data => {
      if (data.nickname !== localStorage.getItem('username')) {
        const bulletArr = []
        this.bullets.forEachDead(bullet => {
          bulletArr.push(bullet)
        })
        const bullet1 = bulletArr[0]
        const bullet2 = bulletArr[1]
        const bullet3 = bulletArr[2]
        if (bullet1 && bullet2 && bullet3) {
          this.shotAudio.play()
          bullet1.reset(this.enemy.x, this.enemy.y + 90)
          bullet1.body.velocity.y = 400
          bullet1.angle = 0

          if (data.powered) {
            bullet2.reset(this.enemy.x, this.enemy.y + 90)
            bullet2.body.velocity.y = 400
            bullet2.body.velocity.x = 200
            bullet2.angle = -20
            bullet3.reset(this.enemy.x, this.enemy.y + 90)
            bullet3.body.velocity.y = 400
            bullet3.body.velocity.x = -200
            bullet3.angle = 20
          }
        }
      }
    })

    this.channel.bind('client-lives-scale-changed', data => {
      if (data.nickname === localStorage.getItem('username')) {
        this.playerLivesScale = data.livesScale
        this.playerHealthBar.scale.set(this.playerLivesScale, 1)
      } else {
        this.enemyLivesScale = data.livesScale
        this.enemyHealthBar.scale.set(this.enemyLivesScale, 1)
      }
    })

    this.channel.bind('client-leave', () => {
      alert(window.enemyName + ' left the game.')
      const channelName = localStorage.getItem('channelName')
      window.pusher.unsubscribe(channelName)
      localStorage.removeItem(channelName)
      this.state.start('Start', true, false)
    })

    this.channel.bind('client-ammo-initiated', data => {
      const ammo = this.ammoBags.getFirstExists(false)
      ammo.id = data.id

      ammo.reset(data.x, this.world.centerY)
      ammo.scale.set(0.4, 0.4)

      window.powerUpsCount++
    })

    this.channel.bind('client-medicine-initiated', data => {
      const medicine = this.medicines.getFirstExists(false)
      medicine.id = data.id

      medicine.reset(data.x, this.world.centerY)
      medicine.scale.set(0.4, 0.4)

      window.powerUpsCount++
    })

    this.channel.bind('client-powerup-destroyed', data => {
      if (data.type === 'ammo') {
        let theAmmo = null
        this.ammoBags.forEach(ammo => {
          if (ammo.id === data.id) {
            theAmmo = ammo
          }
        })
        if (theAmmo !== null) {
          theAmmo.kill()
        }
      }
      if (data.type === 'medicine') {
        let theMedicine = null
        this.medicines.forEach(medicine => {
          if (medicine.id === data.id) {
            theMedicine = medicine
          }
        })
        if (theMedicine !== null) {
          theMedicine.kill()
        }
      }
      let theBullet = null
      this.bullets.forEach(bullet => {
        if (bullet.id === data.bulletId) {
          theBullet = bullet
        }
      })
      if (theBullet !== null) {
        theBullet.kill()
      }
      this.powerupAudio.play()
    })

    this.game.input.onDown.add(this.gofull, this)
  }

  bulletAndPlayerCollisionHandler (player, bullet) {
    bullet.kill()

    this.playerLivesScale -= this.livesDecrement
    this.playerHealthBar.scale.set(this.playerLivesScale, 1)

    this.initiateExplosion(player)

    this.channel.trigger('client-lives-scale-changed', {
      nickname: localStorage.getItem('username'),
      livesScale: this.playerLivesScale
    })
  }

  bulletAndEnemyCollisionHandler (enemy, bullet) {
    bullet.kill()

    this.enemyLivesScale -= this.livesDecrement
    this.enemyHealthBar.scale.set(this.enemyLivesScale, 1)

    this.initiateExplosion(enemy)

    this.channel.trigger('client-lives-scale-changed', {nickname: window.enemyName, livesScale: this.enemyLivesScale})
  }

  bulletAndAmmoCollisionHandler (bullet, ammoBag) {
    bullet.kill()
    ammoBag.kill()

    this.channel.trigger('client-powerup-destroyed', {type: 'ammo', id: ammoBag.id, bulletId: bullet.id})

    window.powerUpsCount--

    this.powerupAudio.play()

    if (bullet.body.velocity.y < 0) {
      this.poweredGun = true
      setTimeout(() => {
        this.poweredGun = false
      }, 5000)
    }
  }

  bulletAndMedicineCollisionHandler (bullet, medicine) {
    bullet.kill()
    medicine.kill()

    this.channel.trigger('client-powerup-destroyed', {type: 'medicine', id: medicine.id, bulletId: bullet.id})

    window.powerUpsCount--

    this.powerupAudio.play()

    this.playerLivesScale += 0.1
    if (this.playerLivesScale > 0.5) {
      this.playerLivesScale = 0.5
    }
    this.playerHealthBar.scale.set(this.playerLivesScale, 1)

    this.channel.trigger('client-lives-scale-changed', {
      nickname: localStorage.getItem('username'),
      livesScale: this.playerLivesScale
    })
  }

  initiateExplosion (ship) {
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

    if (this.playerLivesScale <= 0.05) {
      this.state.start('GameOver', true, false, {winner: 'enemy'})
    }

    if (this.enemyLivesScale <= 0.05) {
      this.state.start('GameOver', true, false, {winner: 'player'})
    }

    this.ammoBagTime = AmmoService.initiateAmmo(this.game, this.ammoBagTime, this.ammoBags, this.world.centerY,
      this.channel)
    this.medicineTime = MedicineService.initiateMedicine(this.game, this.medicineTime, this.medicines, this.world.centerY,
      this.channel)

    this.game.physics.arcade.overlap(this.bullets, this.player, this.bulletAndPlayerCollisionHandler, null, this)
    this.game.physics.arcade.overlap(this.bullets, this.enemy, this.bulletAndEnemyCollisionHandler, null, this)
    this.game.physics.arcade.overlap(this.bullets, this.ammoBags, this.bulletAndAmmoCollisionHandler, null, this)
    this.game.physics.arcade.overlap(this.bullets, this.medicines, this.bulletAndMedicineCollisionHandler, null, this)
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
    const bullet1 = bulletArr[0]
    const bullet2 = bulletArr[1]
    const bullet3 = bulletArr[2]
    if (bullet1 && bullet2 && bullet3) {
      if (this.game.time.now > this.bulletTime) {
        this.channel.trigger('client-fire-bullet', {
          x: bullet1.position.x,
          nickname: localStorage.getItem('username'),
          powered: this.poweredGun
        })
        this.shotAudio.play()
        bullet1.reset(this.player.x, this.player.y - 40)
        bullet1.body.velocity.y = -400
        bullet1.angle = 0
        if (this.poweredGun) {
          bullet2.reset(this.player.x, this.player.y - 40)
          bullet2.body.velocity.y = -400
          bullet2.body.velocity.x = -200
          bullet2.angle = -20
          bullet3.reset(this.player.x, this.player.y - 40)
          bullet3.body.velocity.y = -400
          bullet3.body.velocity.x = 200
          bullet3.angle = 20
        }
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
