import { HttpRequester } from "./HttpRequester";

export class ReportService {
  static requester = HttpRequester.httpRequester();
  static async getTransaction(query='') {
    try {
      return await HttpRequester.get(`report/transaction${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async getVehicle(query='') {
    try {
      return await HttpRequester.get(`report/vehicle${query}`);
    } catch (err) {
      throw err;
    }
  }
}
