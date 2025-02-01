import Utils from "../utils";
import Browser from "../browser";

namespace Network {

  let connections = <Connection[]>[];

  // rest

  export class Request {
    private key: number;
    private readonly type: "get" | "post" | "put";
    private url?: string;
    private headers?: any;
    private body: any;
    private duration = 0;
    onComplete?: Function;

    constructor(type: "get" | "post" | "put") {
      this.key = Utils.getNextKey();
      this.type = type;
    }

    setURL(url: string) {
      this.url = url;
    }

    setHeader(key: string, value: string) {
      if (!this.headers) {
        this.headers = {};
      }
      this.headers[key] = value;
    }

    setBody(body: any) {
      this.body = body;
    }

    setDuration(duration: number) {
      this.duration = duration;
    }

    fire(jsonResponse: boolean = true) {
      if (!this.url) {
        return "400: Bad Request";
      }
      if ((this.type === "post") || (this.type === "put")) {
        if (!this.body) {
          return "400: Bad Request";
        }
      }
      const request = new XMLHttpRequest();
      request.open(this.type, this.url, true);
      Object.keys(this.headers || {}).forEach((key: string) => {
        request.setRequestHeader(key, this.headers[key]);
      });
      const time = new Date().getTime();
      const onComplete = this.onComplete;
      request.onload = () => {
        if (!onComplete) {
          return;
        }
        if (jsonResponse) {
          try {
            this.body = JSON.parse(request.responseText);
          } catch (error) {
            this.body = {};
          }
        } else {
          this.body = request.responseText;
        }
        if (this.duration) {
          Utils.wait(this.duration ? this.duration : 0, time).then(() => {
            onComplete(this.body);
          });
        } else {
          onComplete(this.body);
        }
      };
      request.onerror = () => {
        if (!onComplete) {
          return;
        }
        if (this.duration) {
          Utils.wait(this.duration ? this.duration : 0, time).then(() => {
            onComplete(null, request.status, request.responseText);
          });
        } else {
          onComplete(null, request.status, request.responseText);
        }
      };
      if (this.body instanceof Object) {
        request.setRequestHeader("Content-Type", "application/json");
        try {
          request.send(JSON.stringify(this.body));
        } catch (error) {
          request.send(null);
        }
      }
      if (Array.isArray(this.body)) {
        request.setRequestHeader("Content-Type", "application/json");
        try {
          request.send(JSON.stringify(this.body));
        } catch (error) {
          request.send(null);
        }
      }
      request.send(this.body);
    }
  }

  export class Get extends Request {

    constructor() {
      super("get");
    }
  }

  export class Post extends Request {

    constructor() {
      super("post");
    }
  }

  class Put extends Request {

    constructor() {
      super("put");
    }
  }

  // websocket

  export const createWebsocketConnection = (endpoint: string) => {
    const webSocketConnection = new WebSocketConnection(endpoint);
    connections.push(webSocketConnection);
    return webSocketConnection;
  };

  // Connection

  class Connection {
    key: number;
    endpoint: string;
    alive: boolean;

    constructor(endpoint: string) {
      this.key = Utils.getNextKey();
      this.endpoint = endpoint;
      this.alive = false;
    }
  }

  // WebSocketConnection

  class WebSocketConnection extends Connection {
    webSocket: WebSocket;

    constructor(endpoint: string) {
      super(endpoint);
      this.webSocket = new WebSocket(this.endpoint);
      this.webSocket.onopen = this.onWebSocketOpen;
      this.webSocket.onclose = this.onWebSocketClose;
    }

    onWebSocketOpen() {
      console.log('web socket open');
      this.alive = true;
    }

    onWebSocketClose(event: any) {
      if (event.wasClean) {
        console.log('clean close');
      } else {
        console.log('forced close');
      }
      this.alive = false;
    }

    fireWebSocketEvent(action: string, payload: any) {
      if (!this.alive) {
        return;
      }

      if (!this.webSocket.readyState){
        const that = this;
        setTimeout(() => {
          that.fireWebSocketEvent(action, payload);
        },100);
      } else {
        const event: any = {
          action: action
        };
        if (payload) {
          event.payload = payload;
        }
        this.webSocket.send(JSON.stringify(event));
      }
    }
  }
}

export default Network;
