import {
  DIV
} from "@step-js-core/index";

class BtnGroup extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("btn-group step-js-select-none");
    this.props.role = "group";
  }
}

// BtnGroupSM

class BtnGroupSM extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("btn-group btn-group-sm step-js-select-none");
    this.props.role = "group";
  }
}

// BtnGroupMD

class BtnGroupMD extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("btn-group btn-group-md step-js-select-none");
    this.props.role = "group";
  }
}

// BtnGroupLG

class BtnGroupLG extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("btn-group btn-group-lg step-js-select-none");
    this.props.role = "group";
  }
}

// BtnGroupXL

class BtnGroupXL extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("btn-group btn-group-xl step-js-select-none");
    this.props.role = "group";
  }
}

// BtnGroupXXL

class BtnGroupXXL extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("btn-group btn-group-xxl step-js-select-none");
    this.props.role = "group";
  }
}

// InputGroup

class InputGroup extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("input-group step-js-select-none");
  }
}

// BtnToolbar

class BtnToolbar extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("btn-toolbar step-js-select-none");
    this.props.role = "toolbar";
  }
}

// BtnGroupVertical

class BtnGroupVertical extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("btn-group-vertical step-js-select-none");
    this.props.role = "group";
  }
}

export {
  BtnGroup,
  BtnGroupSM,
  BtnGroupMD,
  BtnGroupLG,
  BtnGroupXL,
  BtnGroupXXL,
  InputGroup,
  BtnToolbar,
  BtnGroupVertical,
}
