import { HttpRequester } from "./HttpRequester";

export class PaymentService {
  static requester = HttpRequester.httpRequester();
  static async update(id, data) {
    try {
      return await HttpRequester.put('payment/' + id, data);
    } catch (err) {
      throw err;
    }
  }
  static async repay(id, data) {
    try {
      console.log(data, 'data');
      return await HttpRequester.get('payment/repay/' + id);
    } catch (err) {
      throw err;
    }
  }
}
