import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.speed = 3

    const channel = window.pusher.subscribe('private-my-channel')
    channel.bind('client-ship-moved', data => {
      if (data.nickname !== localStorage.getItem('username')) {
        this.position.x = data.x
      }
    })
  }

  update () {
  }
}
