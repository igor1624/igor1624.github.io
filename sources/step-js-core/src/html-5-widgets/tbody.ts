import Widget from "../widget";
import TR from "./tr";

class TBODY extends Widget {

  constructor(...params: any) {
    super("tbody", ...params);
  }

  addTR() {
    const tr = new TR();
    this.addChild(tr);
    return tr;
  }
}

export default TBODY;
