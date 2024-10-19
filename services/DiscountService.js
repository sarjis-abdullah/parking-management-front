import { HttpRequester } from "./HttpRequester";

export class DiscountService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`discount${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('discount', data);
    } catch (err) {
      throw err;
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('discount/' + id);
    } catch (err) {
      throw err;
    }
  }
  static async put(id, data) {
    try {
      return await HttpRequester.put('discount/' + id, data);
    } catch (err) {
      throw err;
    }
  }
}
