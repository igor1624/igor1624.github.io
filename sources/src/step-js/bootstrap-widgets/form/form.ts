import {
  DIV,
  INPUT,
  FORM
} from "@step-js-core/index";

class Form extends FORM {

  constructor(...params: any) {
    super("form", ...params);
  }
}

namespace Form {

  export class Group extends DIV {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("form-group");
    }
  }

  export class Check extends DIV {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("form-check");
    }
  }

  export class CheckInput extends INPUT {

    constructor(...params: any) {
      super("checkbox", ...params);
      this.addClassNames("form-check-input");
    }
  }
}

export default Form;
