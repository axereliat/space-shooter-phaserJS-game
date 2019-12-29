import axios from 'axios';

const url = 'http://127.0.0.1:8000/'
let oldX = null;
export class PusherService {
  static shipMoved (x, nickname) {
    console.log('oldX: ', oldX)
    console.log('x: ', x)
    if (oldX === null || Math.abs(oldX - x) > 30) {
      oldX = x;
      return axios.get(url + '?event=ship-moved&x=' + x + '&nickname=' + nickname)
    }
    return null;
  }
}