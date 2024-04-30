import { HttpRequester } from "./HttpRequester";

export class UserService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`user${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('register', data);
    } catch (err) {
      throw err;
    }
  }
}
