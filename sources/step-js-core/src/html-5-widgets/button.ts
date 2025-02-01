import Widget from "../widget";

class BUTTON extends Widget {

  constructor(...params: any) {
    super("button", ...params);
    this.setAttribute("type", "button");
  }
}

export default BUTTON;
