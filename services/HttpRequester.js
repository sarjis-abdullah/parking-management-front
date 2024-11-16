import { BaseHttpRequester } from "./BaseHttpRequester";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export class HttpRequester extends BaseHttpRequester {
  static instance;
  static httpRequester() {
    if (!HttpRequester.instance) {
      HttpRequester.instance = new HttpRequester();
    }

    return HttpRequester.instance;
  }

  static async get(url, auth = true) {
    try {
      let req = {}
      if (auth) {
        req = {
          ...this.getHeaders(),
        }
      }
      console.log(req, 'reque');
      const response = await fetch(this.BASE_URL + url, req);
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
    try {
      const response = await fetch(this.BASE_URL + url, {
        method: "POST",
        ...this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const res = await response.json();
        this.handleMessage("Entry created successfully.");
        return res;
      } else {
        const responseBody = await response.text(); // Get response body as text
        const error = new Error(response.statusText);
        error.response = {
          ...response,
          body: responseBody, // Attach response body to the error object
        };
        this.handleError(response);
        throw error;
      }
    } catch (error) {
      if (error?.response?.body) {
        return Promise.reject(JSON.parse(error.response.body));
      }
    }
  }
  static async put(url, data, auth = true) {
    try {
      let req = req = {
        method: "PUT",
        body: JSON.stringify(data),
      }
      if (auth) {
        req = {
          ...req,
          ...this.getHeaders(),
        }
      }
      console.log(req, 'reque');
      const response = await fetch(this.BASE_URL + url, req);
      if (response.ok) {
        const res = await response.json();
        this.handleMessage("Entry updated successfully.");
        return res;
      } else {
        const responseBody = await response.text(); // Get response body as text
        const error = new Error(response.statusText);
        error.response = {
          ...response,
          body: responseBody, // Attach response body to the error object
        };
        this.handleError(response);
        throw error;
      }
    } catch (error) {
      if (error?.response?.body) {
        return Promise.reject(JSON.parse(error.response.body));
      }
    }
  }
  static async delete(url) {
    try {
      const response = await fetch(this.BASE_URL + url, {
        method: "DELETE",
        ...this.getHeaders(),
      });
      if (response.ok) {
        const res = await response.json();
        this.handleMessage("Entry deleted successfully.");
        return res;
      } else {
        const responseBody = await response.text(); // Get response body as text
        const error = new Error(response.statusText);
        error.response = {
          ...response,
          body: responseBody, // Attach response body to the error object
        };
        this.handleError(response);
        throw error;
      }
    } catch (error) {
      if (error?.response?.body) {
        return Promise.reject(JSON.parse(error.response.body));
      }
    }
  }
  static handleMessage(msg, success = true) {
    if (success) {
      toast.success(msg, {
        autoClose: 2000,
      });
    } else {
      toast.error(msg, {
        autoClose: 2000,
      });
    }
  }
  static async handleError(response) {
    let status = response.status;
    let error = "";
    if (status == 401) {
      this.handleMessage("Un-authenticated!", false);
      window.location.href = "/";
    } else if (status == 403) {
      this.handleMessage("Un-authorized", false);
      window.location.href = "/";
    } else if (status == 422) {
      this.handleMessage("Bad input", false);
    } else if (status >= 400 && status < 500) {
      this.handleMessage("You probably missed any information", false);
    } else this.handleMessage("Something went wrong!", false);
  }
  static async getFile(url) {
    const response = await fetch(this.BASE_URL + url, {
      headers: this.getHeaders(),
    });
    if (response.ok) {
      return await response.blob();
    } else {
      throw await this.handleError(response);
    }
  }
}
