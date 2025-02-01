import Widget from "../widget";
import TD from "./td";

class TR extends Widget {

  constructor(...params: any) {
    super("tr", ...params);
  }

  addTD() {
    const td = new TD();
    this.addChild(td);
    return td;
  }
}

export default TR;
