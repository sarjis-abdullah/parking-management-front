import { HttpRequester } from "./HttpRequester";

export class BlockService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`block${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('block', data);
    } catch (err) {
      throw err;
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('block/' + id);
    } catch (err) {
      throw err;
    }
  }
  static async put(id, data) {
    try {
      return await HttpRequester.put('block/' + id, data);
    } catch (err) {
      throw err;
    }
  }
}
