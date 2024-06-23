import { HttpRequester } from "./HttpRequester";

export class PlaceService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`place${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('place', data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('place/' + id);
    } catch (err) {
      throw err;
    }
  }
  static async put(id, data) {
    try {
      return await HttpRequester.put('place/' + id, data);
    } catch (err) {
      throw err;
    }
  }
}
