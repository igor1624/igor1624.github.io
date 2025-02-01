import Widget from "../widget";

class P extends Widget {

  constructor(innerText: string | undefined, ...params: any) {
    super("p", ...params);
    if (innerText) {
      this.setInnerText(innerText);
    }
  }
}

export default P;
