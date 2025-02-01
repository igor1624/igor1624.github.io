namespace Utils {
  let nextKey = 1;

  export const getNextKey = () => {
    if (nextKey === Number.MAX_SAFE_INTEGER) {
      nextKey = 1;
    } else {
      nextKey++;
    }
    return nextKey;
  };

  // https://vc.ru/u/1389654-machine-learning/615561-maloizvestnye-funkcii-javascript-kotorye-pozvolyat-uluchshit-kachestvo-vashego-koda

  export const debounce = (callback: any, delay: number) => {
    let timeout: any;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  export const throttle = (callback: any, delay: number) => {
    let wait = false;
    return (...args: any) => {
      if (wait) {
        return;
      }
      callback(...args);
      wait = true;
      setTimeout(() => {
        wait = false;
      }, delay);
    };
  };

  export const wait = async (duration: number, time0?: number) => {
    if (!time0) {
      time0 = new Date().getTime();
    }
    const time1 = new Date().getTime();
    if (!Number.isInteger(duration)) {
      duration = 0;
    } else if (duration > time1 - time0) {
      duration = duration - (time1 - time0);
    } else {
      duration = 0;
    }
    return new Promise(resolve => setTimeout(resolve, duration));
  };

  export const textToHTML = (text: any) => {
    text = text.toString();
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/"/g, "&quot;");
    text = text.replace(/'/g, "&#039;");
    return text;
  };

  // parsed URL

  export class ParsedURL {
    href: string;
    protocol: string;
    username: string;
    password: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    pathnameElements: string[];
    search: string;
    hash: string;
    origin: string;
    searchParams: URLSearchParams;

    constructor(url: any) {
      url = new URL(url);
      this.href = url.href;
      this.protocol = url.protocol;
      this.username = url.username;
      this.password = url.password;
      this.host = url.host;
      this.hostname = url.hostname;
      this.port = url.port;
      this.pathname = url.pathname;
      if (this.pathname) {
        this.pathnameElements = this.pathname.split("/");
        if (this.pathnameElements) {
          this.pathnameElements = this.pathnameElements.filter(element => (element != null) && (element.length > 0));
        }
      } else {
        this.pathnameElements = [];
      }
      this.search = url.search;
      this.hash = url.hash;
      this.origin = url.origin;
      this.searchParams = url.searchParams;
    }
  }
}

export default Utils;
