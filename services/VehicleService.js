import { HttpRequester } from "./HttpRequester";

export class VehicleService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`vehicle${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('vehicle', data);
    } catch (err) {
      throw err;
    }
  }
}
