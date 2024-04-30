import { HttpRequester } from "./HttpRequester";

export class TariffService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`tariff${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('tariff', data);
    } catch (err) {
      throw err;
    }
  }
}
