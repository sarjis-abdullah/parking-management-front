import { HttpRequester } from "./HttpRequester";

export class SlotService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`slot${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('slot', data);
    } catch (err) {
      throw err;
    }
  }
}
