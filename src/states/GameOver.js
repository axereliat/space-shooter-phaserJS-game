import Phaser from 'phaser'

export default class extends Phaser.State {
  init (payload) {
    this.winner = payload.winner

    this.stage.backgroundColor = '#000000'
  }

  preload () {
    window.pusher.unsubscribe(localStorage.getItem('channelName'))
    localStorage.removeItem('channelName')

    this.game.add.text(this.world.centerX - 210, this.world.centerY - 140,
      this.winner === 'player' ? 'You Win' : 'You Lose', {
        font: '110px Times New Roman',
        fill: this.winner === 'player' ? 'blue' : 'red',
        align: 'center'
      })
    // this.game.add.button(this.game.world.centerX - 120, this.world.centerY + 10, 'mainMenuGameBtn', () => {
    //   this.state.start('Start')
    // }, this, 2, 1, 0)
    this.game.add.button(this.game.world.centerX - 120, this.world.centerY + 100, 'mainMenuGameBtn', () => {
      this.state.start('Start')
    }, this, 2, 1, 0)
  }

  create () {
  }
}
