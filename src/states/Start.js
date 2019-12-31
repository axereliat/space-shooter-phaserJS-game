import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
  init () {
  }

  preload () {
    window.gameState = this.state

    this.background = this.game.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, 'background')
    const title = this.game.add.sprite(this.world.centerX - 320, 50, 'title')
    title.scale.set(0.8, 0.8)
    const authorText = this.game.add.text(this.world.centerX, config.gameHeight - 20, 'Made by Mario Markov, 2020', { font: '24px Arial', fill: '#dddddd', align: 'center' })
    authorText.anchor.setTo(0.5, 0.5)

    this.game.add.button(this.game.world.centerX - 140, this.world.centerY, 'joinGameBtn', () => {
      window.fetchAvailableChannels()
      $('#gamesList').modal('show')
    }, this, 2, 1, 0)

    this.game.add.button(this.game.world.centerX - 140, this.world.centerY + 80, 'createGameBtn', () => {
      $('#waitingModal').modal('show')
      $('#waitingModalBody').html('<p>Waiting for someone to join your game...</p>')
      const channelName = 'private-' + localStorage.getItem('username')
      const channel = window.pusher.subscribe(channelName)
      channel.bind('client-connected', data => {
        window.enemyName = data.nickname
        $('#waitingModalBody').html('<p>' + data.nickname + ' joined! The game starts in 3 seconds.</p>')
        setTimeout(() => {
          $('#waitingModal').modal('hide')
          this.state.start('Game')
        }, 3000)
      })

      localStorage.setItem('channelName', channelName)
    }, this, 2, 1, 0)

    $('#scoreForm').modal('show')
  }

  create () {
  }
}
