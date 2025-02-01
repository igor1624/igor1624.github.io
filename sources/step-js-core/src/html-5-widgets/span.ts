import Widget from "../widget";

class SPAN extends Widget {

  constructor(text: string | undefined, ...params: any) {
    super("span", ...params);
    if (text) {
      this.setInnerText(text);
    }
  }
}

export default SPAN;
