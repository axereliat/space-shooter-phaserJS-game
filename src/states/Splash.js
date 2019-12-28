import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    const baseUrl = 'http://examples.phaser.io/assets/'
    this.load.image('player', 'assets/images/spaceship.png')
    this.load.spritesheet('explosion', baseUrl + 'games/invaders/explode.png', 128, 128)
    this.load.image('retryBtn', 'assets/images/retry-btn.png')
    this.load.image('leaderboardBtn', 'assets/images/leaderboardBtn.png')
    this.load.image('startBtn', 'assets/images/startgame-btn.png')
    this.load.image('title', 'assets/images/title.png')
    this.load.image('bullet', baseUrl + 'games/invaders/bullet.png')
    this.load.image('background', baseUrl + 'games/invaders/starfield.png')
    this.load.image('asteroid', 'assets/images/asteroid.png')
    this.load.image('medicine', 'assets/images/medical-bag.png')
    this.load.image('ammo', 'assets/images/ammo.png')
    this.load.audio('shot', 'assets/audio/shot.wav')
    this.load.audio('destroy', 'assets/audio/destroy.wav')
    this.load.audio('pain', 'assets/audio/pain.mp3')
    this.load.audio('powerup', 'assets/audio/powerup.wav')
  }

  create () {
    this.state.start('Start')
  }
}
