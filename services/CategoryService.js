import { HttpRequester } from "./HttpRequester";

export class CategoryService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`category${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('category', data);
    } catch (err) {
      throw err;
    }
  }
}
