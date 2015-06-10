import { Actions } from 'flummox';

export default class PayloadActions extends Actions {
  async getData() {
    console.log('hi!');
    try {
      const url = 'http://localhost:8080/api';
      let data = await fetch(url);
      return JSON.parse(data.json());
    }
    catch(err) {
      console.log('ERROR: ' + err);
    }
  }
}
