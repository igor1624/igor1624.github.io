import {
  DIV,
} from "@step-js-core/index";

// Container

class Container extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("container");
  }
}

// ContainerSM

class ContainerSM extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("container-sm");
  }
}

// ContainerMD

class ContainerMD extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("container-md");
  }
}

// ContainerLG

class ContainerLG extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("container-lg");
  }
}

// ContainerXL

class ContainerXL extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("container-xl");
  }
}

// ContainerXXL

class ContainerXXL extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("container-xxl");
  }
}

// ContainerFluid

class ContainerFluid extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("container-fluid");
  }
}

export {
  Container,
  ContainerSM,
  ContainerMD,
  ContainerLG,
  ContainerXL,
  ContainerXXL,
  ContainerFluid
};
