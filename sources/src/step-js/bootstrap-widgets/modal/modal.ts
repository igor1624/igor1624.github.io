import {
  Browser,
  DIV,
  BUTTON,
  H5
} from "@step-js-core/index";
import {
  BtnSecondary
} from "../components/btns";
import "./modal.scss";

// Modal

class Modal extends DIV {
  shown: boolean = false;

  constructor(...params: any) {
    super(...params);
    this.addClassNames("modal");
    this.props.tabindex = -1;
  }

  createVirtualElement() {
    this.virtualElement = super.createVirtualElement();
    this.virtualElement.props.onClick = (event: any) => {
      const htmlElement = this.getHTMLElement();
      if (htmlElement) {
        if (event.target === htmlElement) {
          if (this.shown) {
            this.hide();
          }
        }
      }
    };
    return this.virtualElement;
  }

  show() {
    if (this.shown) {
      return;
    }
    this.shown = true;
    this.addClassNames("d-block");
    Browser.mountModal(this);
  }

  hide() {
    Browser.unmountModal(this);
    this.shown = false;
    this.removeClassName("d-block");
  }
}

namespace Modal {

  // Modal.Dialog

  export class Dialog extends DIV {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("modal-dialog");
    }
  }

  // Modal.Content

  export class Content extends DIV {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("modal-content");
    }
  }

  // Modal.Header

  export class Header extends DIV {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("modal-header");
    }
  }

  // Modal.Title

  export class Title extends H5 {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("modal-title");
    }
  }

  // Modal.BtnClose

  export class BtnClose extends BUTTON {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("btn-close");
    }

    onClick = () => {
      let virtualElement = this.virtualElement;
      while (virtualElement) {
        if (virtualElement.constructedBy instanceof Modal) {
          virtualElement.constructedBy.hide();
          break;
        }
        virtualElement = virtualElement.parent;
      }
    }
  }

  // Modal.Body

  export class Body extends DIV {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("modal-body");
    }
  }

  // Modal.Footer

  export class Footer extends DIV {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("modal-footer");
    }
  }

  // Modal.BtnDismiss

  export class BtnDismiss extends BtnSecondary {

    constructor(text: string | undefined, ...params: any) {
      super(text, ...params);
    }

    onClick = (event?: any) => {
      event.stopPropagation();
      event.preventDefault();
      let virtualElement = this.virtualElement;
      while (virtualElement) {
        if (virtualElement.constructedBy instanceof Modal) {
          virtualElement.constructedBy.hide();
          break;
        }
        virtualElement = virtualElement.parent;
      }
    }
  }
}

export default Modal;
