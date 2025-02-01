import {
  UL,
} from "@step-js-core/index";

class ListUnstyled extends UL {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("list-unstyled");
  }
}

export default ListUnstyled;
