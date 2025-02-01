import {
  Widget
} from "@step-js-core/index";

class Card extends Widget {

  constructor(...params: any) {
    super("div", ...params);
    this.addClassNames("card");
  }
}

namespace Card {

  // CardHeader

  export class Header extends Widget {

    constructor(...params: any) {
      super("div", ...params);
      this.addClassNames("card-header");
    }
  }

  // CardBody

  export class Body extends Widget {

    constructor(...params: any) {
      super("div", ...params);
      this.addClassNames("card-body");
    }
  }

  // CardTitle

  export class Title extends Widget {

    constructor(text: string, ...params: any) {
      super("h5", ...params);
      this.addClassNames("card-title");
      this.setInnerText(text);
    }
  }

  // CardText

  export class Text extends Widget {

    constructor(text: string, ...params: any) {
      super("p", ...params);
      this.addClassNames("card-text");
      this.setInnerText(text);
    }
  }
}

export default Card;
