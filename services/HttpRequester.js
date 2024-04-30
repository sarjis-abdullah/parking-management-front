import { BaseHttpRequester } from "./BaseHttpRequester";
export class HttpRequester extends BaseHttpRequester {
  static instance;
  static httpRequester() {
    if (!HttpRequester.instance) {
      HttpRequester.instance = new HttpRequester();
    }

    return HttpRequester.instance;
  }

  static async get(url) {
    try {
      const response = await fetch(this.BASE_URL + url, this.getHeaders());
      if (response.ok) {
        return await response.json();
      } else {
        throw await this.handleError(response);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw await this.handleError(response);
    }
  }
  static async put(url, data) {
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw await this.handleError(response);
    }
  }
  static async delete(url) {
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (response.ok) {
      return true;
    } else {
      throw await this.handleError(response);
    }
  }
  static async handleError(response) {
    let status = response.status;
    let error = "";
    try {
      let errorJson = await response.json();

      if (errorJson.errors && errorJson.errors.message)
        error = errorJson.errors.message;
      else if (errorJson.data && errorJson.data.message)
        error = errorJson.data.message;
      else error = errorJson.message;
    } catch (err) {
      error = await response.text();
    }
    if (status == 401) {
      //   const event = new UnauthenticatedEvent();
      console.log("UnauthenticatedEvent");

      //return new UnauthenticatedException(error);
    }
    if (status == 403) {
      //   return new UnauthorizedException(error);
      console.log("UnauthorizedException");
    }
    if (status == 422) {
      console.log("BadInputException");
      return new BadInputException(error);
    }
    if (status >= 400 && status < 500) {
      console.log("MissingInformationException");
      //   return new MissingInformationException(error);
    }
    console.log("ServerErrorException");
    // return new ServerErrorException(error);
  }
  static async getFile(url) {
    const response = await fetch(url, { headers: this.getHeaders() });
    if (response.ok) {
      return await response.blob();
    } else {
      throw await this.handleError(response);
    }
  }
}
