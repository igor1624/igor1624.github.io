import {
  DIV,
} from "@step-js-core/index";

// Row

class Row extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("row");
  }
}

export default Row;
