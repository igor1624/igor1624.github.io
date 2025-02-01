import Widget from "../widget";

class STRONG extends Widget {

  constructor(text: string, ...params: any) {
    super("strong", ...params);
    this.setInnerText(text);
  }
}

export default STRONG;
