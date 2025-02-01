import {
  VirtualElement,
  Widget,
  Router,
  BUTTON,
  A,
  HR,
  SPAN, Browser
} from "@step-js-core/index";

class DropdownWidget extends Widget {

  constructor(tagName: string, ...params: any) {
    super(tagName, ...params);
  }

  addVirtualElementsTo(parentVirtualElement: VirtualElement) {
    super.addVirtualElementsTo(parentVirtualElement);
    if (!this.virtualElement) {
      return;
    }
    let dropdownToggleVirtualElement: VirtualElement | null = null;
    let dropdownMenuVirtualElement: VirtualElement | null = null;
    for (let i = 0; i < this.virtualElement.getChildren().length; i++) {
      const virtualElement = this.virtualElement.getChildren()[i];
      if (!virtualElement.constructedBy) {
        continue;
      }
      if (!virtualElement.constructedBy.hasClassName) {
        continue;
      }
      if (virtualElement.constructedBy.hasClassName("dropdown-toggle")) {
        dropdownToggleVirtualElement = virtualElement;
      } else if (virtualElement.constructedBy.hasClassName("dropdown-menu")) {
        dropdownMenuVirtualElement = virtualElement;
      }
    }
    if (dropdownToggleVirtualElement) {
      if (dropdownMenuVirtualElement) {
        dropdownToggleVirtualElement.props.onClick = () => {
          if (dropdownMenuVirtualElement) {
            if (dropdownMenuVirtualElement.constructedBy) {
              if (dropdownMenuVirtualElement.constructedBy.show) {
                dropdownMenuVirtualElement.constructedBy.show();
              }
            }
          }
        }
      }
    }
  }
}

class DropdownMenuWidget extends Widget {

  constructor(tagName: string, ...params: any) {
    super(tagName, ...params);
  }

  show() {
    if (!this.virtualElement) {
      return;
    }
    let htmlElement = this.getHTMLElement();
    if (htmlElement) {
      htmlElement.classList.add("show");
      Browser.showVirtualElement(this.virtualElement);
    }
  }

  hide() {
    const htmlElement = this.getHTMLElement();
    if (htmlElement) {
      if (!htmlElement.classList.contains("show")) {
        return;
      }
      htmlElement.classList.remove("show");
    }
    Browser.hideVirtualElement(this.virtualElement);
  }

  calculateLayout() {
    if (!this.virtualElement) {
      return;
    }
    const htmlElement = this.getHTMLElement();
    if (!htmlElement) {
      return;
    }
    const fixedHTMLElement = htmlElement.parentElement;
    if (!fixedHTMLElement) {
      return;
    }
    const parentVirtualElement = this.virtualElement["mounted-parent"] as VirtualElement;
    if (!parentVirtualElement) {
      return;
    }
    const parentHTMLElement = parentVirtualElement.getHTMLElement();
    if (!parentHTMLElement) {
      return;
    }
    const rect0 = fixedHTMLElement.getBoundingClientRect();
    const rect1 = parentHTMLElement.getBoundingClientRect();
    let left = rect1.left;
    let top = rect1.bottom + 4;
    const rect2 = htmlElement.getBoundingClientRect();
    if (left + rect2.width > rect0.right - 8) {
      left = rect0.right - 8 - rect2.width;
    }
    if (top + rect2.height > rect0.bottom - 8) {
      top = rect0.bottom - 8 - rect2.height;
    }
    htmlElement.style.left = `${left}px`;
    htmlElement.style.top = `${top}px`;
  }
}

class Dropdown extends DropdownWidget {

  constructor(...params: any) {
    super("div", ...params);
    this.addClassNames("dropdown step-js-select-none");
  }
}

namespace Dropdown {

  // Dropdown.Toggle

  export class Toggle extends Widget {
    collapsed = false;

    constructor(type: string, text: string | undefined, ...params: any) {
      super(type, ...params);
      this.addClassNames("dropdown-toggle step-js-select-none");
      if (text) {
        this.setInnerText(text);
      }
    }

    setCollapsed(collapsed: boolean) {
      this.collapsed = collapsed;
      if (this.collapsed) {
        this.addClassNames("collapsed");
      } else {
        this.removeClassName("collapsed");
      }
      let htmlElement = this.getHTMLElement();
      if (htmlElement) {
        htmlElement.setAttribute("aria-expanded", (!this.collapsed).toString());
      }
    }

    createVirtualElement() {
      if (this.collapsed) {
        this.props["aria-expanded"] = "false";
      } else {
        this.props["aria-expanded"] = "true";
      }
      this.props["data-toggle"] = "collapse";
      return super.createVirtualElement();
    }
  }

  // Dropdown.TogglePrimary

  export class TogglePrimary extends Toggle {

    constructor(text: string | undefined, ...params: any) {
      super("button", text, ...params);
      this.props.type = "button";
      this.addClassNames("dropdown-toggle btn btn-primary step-js-select-none");
    }
  }

  // Dropdown.ToggleSecondary

  export class ToggleSecondary extends Toggle {

    constructor(text: string | undefined, ...params: any) {
      super("button", text, ...params);
      this.props.type = "button";
      this.addClassNames("dropdown-toggle btn btn-secondary step-js-select-none");
    }
  }

  // Dropdown.ToggleSuccess

  export class ToggleSuccess extends Toggle {

    constructor(text: string | undefined, ...params: any) {
      super("button", text, ...params);
      this.props.type = "button";
      this.addClassNames("dropdown-toggle btn btn-success step-js-select-none");
    }
  }

  // Dropdown.ToggleDanger

  export class ToggleDanger extends Toggle {

    constructor(text: string | undefined, ...params: any) {
      super("button", text, ...params);
      this.props.type = "button";
      this.addClassNames("dropdown-toggle btn btn-danger step-js-select-none");
    }
  }

  // Dropdown.ToggleWarning

  export class ToggleWarning extends Toggle {

    constructor(text: string | undefined, ...params: any) {
      super("button", text, ...params);
      this.props.type = "button";
      this.addClassNames("dropdown-toggle btn btn-warning step-js-select-none");
    }
  }

  // Dropdown.ToggleInfo

  export class ToggleInfo extends Toggle {

    constructor(text: string | undefined, ...params: any) {
      super("button", text, ...params);
      this.props.type = "button";
      this.addClassNames("dropdown-toggle btn btn-info step-js-select-none");
    }
  }

  // Dropdown.Menu

  export class Menu extends DropdownMenuWidget {

    constructor(...params: any) {
      super("ul", ...params);
      this.addClassNames("dropdown-menu step-js-select-none");
    }
  }

  // Dropdown.Item

  export class Item extends A {

    constructor(href: string | undefined, text: string | undefined, ...params: any) {
      super(...params);
      this.addClassNames("dropdown-item step-js-select-none");
      this.props.href = href ? href : "";
      if (text) {
        this.setInnerText(text);
      }
    }

    onClick = (event: any) => {
      Router.navigateTo(event, this.props.href);
    }
  }

  // Dropdown.Button

  export class Button extends BUTTON {

    constructor(text: string, ...params: any) {
      super(...params);
      this.addClassNames("dropdown-item step-js-select-none");
      this.setInnerText(text);
    }
  }

  // Dropdown.Text

  export class Text extends SPAN {

    constructor(text: string, ...params: any) {
      super(text, ...params);
      this.addClassNames("dropdown-item-text step-js-select-none");
    }
  }

  // Dropdown.Divider

  export class Divider extends HR {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("dropdown-divider step-js-select-none");
    }
  }
}

export {
  DropdownWidget,
  Dropdown
};
