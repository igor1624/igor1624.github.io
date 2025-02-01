import {
  UL,
  LI
} from "@step-js-core/index";

class ListGroup extends UL {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("list-group");
  }
}

namespace ListGroup {

  export class Item extends LI {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("list-group-item");
    }
  }
}

export default ListGroup;
