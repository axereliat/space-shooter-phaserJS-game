import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.speed = 3
  }

  update () {
    // const pusher = new Pusher('a2cc80fe5bb42c3481df', {
    //   appId: '924080',
    //   key: 'a2cc80fe5bb42c3481df',
    //   secret: 'c3e604f1cf75d48adf04',
    //   cluster: 'eu',
    //   encrypted: true
    // })

    const channel = window.pusher.subscribe('my-channel')
    channel.bind('ship-moved', data => {
      console.log('mario hereeeeeeee: ', data)
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
