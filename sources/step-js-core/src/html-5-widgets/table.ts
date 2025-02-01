import Widget from "../widget";
import TBODY from "./tbody";

class TABLE extends Widget {

  constructor(...params: any) {
    super("table", ...params);
  }

  addTBODY() {
    const tbody = new TBODY();
    this.addChild(tbody);
    return tbody;
  }
}

export default TABLE;
