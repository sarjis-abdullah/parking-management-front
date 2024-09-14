export class BaseHttpRequester {
  static BASE_URL = "http://192.168.0.111:8190/api/v1/";
  static getToken() {
    return window.localStorage.getItem("ACCESS_TOKEN");
  }
  static getHeaders() {
    const token = this.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Adjust content type as needed
      },
    };
  }
}
