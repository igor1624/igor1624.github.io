import Widget from "../widget";

class SMALL extends Widget {

  constructor(text: string, ...params: any) {
    super("small", ...params);
    this.setInnerText(text);
  }
}

export default SMALL;
