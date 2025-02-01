import Widget from "../widget";

class LABEL extends Widget {

  constructor(text: string | undefined, ...params: any) {
    super("label", ...params);
    if (text) {
      this.setInnerText(text);
    }
  }
}

export default LABEL;
