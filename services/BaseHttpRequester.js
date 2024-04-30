export class BaseHttpRequester {
  static BASE_URL = "http://localhost:8190/api/v1/";
  static getToken(){
    return window.localStorage.getItem("ACCESS_TOKEN");
  }
}
