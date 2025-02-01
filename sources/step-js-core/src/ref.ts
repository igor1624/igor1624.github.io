import Utils from "./utils";

class Ref {
  key;
  current = undefined;

  constructor() {
    this.key = Utils.getNextKey();
  }
}

export default Ref;
