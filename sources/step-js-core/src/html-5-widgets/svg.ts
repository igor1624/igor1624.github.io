import Widget from "../widget";

class SVG extends Widget {

  constructor(svg: string, ...params: any) {
    super("div", ...params);
    this.setInnerHTML(svg);
  }
}

export default SVG;
