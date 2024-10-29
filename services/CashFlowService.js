import { HttpRequester } from "./HttpRequester";

export class CashFlowService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`cash-flow${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('cash-flow', data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('cash-flow/' + id);
    } catch (err) {
      throw err;
    }
  }
  static async put(id, data) {
    try {
      return await HttpRequester.put('cash-flow/' + id, data);
    } catch (err) {
      throw err;
    }
  }
  static async closeCash(id, data) {
    try {
      return await HttpRequester.get('close-cash', data);
    } catch (err) {
      throw err;
    }
  }
}
