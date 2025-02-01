import {
  Router,
  DIV,
  A,
  NAV,
  BUTTON,
  UL,
  SPAN
} from "@step-js-core/index";

// Navbar

class Navbar extends NAV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("navbar step-js-select-none");
  }
}

namespace Navbar {

  export class Brand extends A {

    constructor(href: string | undefined, ...params: any) {
      super(...params);
      this.addClassNames("navbar-brand step-js-select-none");
      this.props.href = href ? href : "#";
    }

    onClick = (event: any) => {
      Router.navigateTo(event, this.props.href);
    }
  }

  export class Toggler extends BUTTON {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("navbar-toggler step-js-select-none");
      this.setAttribute("data-bs-toggle", "collapse");
    }

    mount() {
      this.addChild(new SPAN(undefined, "navbar-toggler-icon"));
    }

    onClick = (event: any) => {
      event.stopPropagation();
      event.preventDefault();
      if (!this.virtualElement) {
        return;
      }
      let parentVirtualElement = this.virtualElement.parent;
      if (!parentVirtualElement) {
        return;
      }
      parentVirtualElement.getChildren().forEach((child: any) => {
        try {
          if (child.props.className) {
            if (child.props.className.indexOf("navbar-collapse") >= 0) {
              child.getHTMLElement().classList.toggle("show");
            }
          }
        } catch (error: any) {
        }
      });
    }
  }

  export class Collapse extends DIV {
    constructor(...params: any) {
      super(...params);
      this.addClassNames("collapse navbar-collapse step-js-select-none");
    }
  }

  export class Nav extends UL {
    constructor(...params: any) {
      super(...params);
      this.addClassNames("navbar-nav");
    }
  }
}

// NavbarSM

class NavbarSM extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("navbar navbar-expand-sm step-js-select-none");
  }
}

// NavbarMD

class NavbarMD extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("navbar navbar-expand-md step-js-select-none");
  }
}

// NavbarLG

class NavbarLG extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("navbar navbar-expand-lg step-js-select-none");
  }
}

// NavbarXL

class NavbarXL extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("navbar navbar-expand-xl step-js-select-none");
  }
}

// NavbarXXL

class NavbarXXL extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("navbar navbar-expand-xxl step-js-select-none");
  }
}

export {
  Navbar,
  NavbarSM,
  NavbarMD,
  NavbarLG,
  NavbarXL,
  NavbarXXL
}
