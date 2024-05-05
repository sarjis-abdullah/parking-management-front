import { HttpRequester } from "./HttpRequester";

export class ParkingService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`parking${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('parking', data);
    } catch (err) {
      throw err;
    }
  }
}