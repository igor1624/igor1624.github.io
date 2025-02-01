import {
  DIV,
  BUTTON,
  SPAN,
  H2,
  VirtualElement
} from "@step-js-core/index";

// Accordion

class Accordion extends DIV {

  constructor(...params: any) {
    super(...params);
    this.addClassNames("accordion");
  }

  createVirtualElement(): VirtualElement {
    let shownFound = false;
    for (let i0 = 0; i0 < this.getChildren().length; i0++) {
      let child0 = this.getChildren()[i0];
      if (!(child0 instanceof Accordion.Item)) {
        continue;
      }
      for (let i1 = 0; i1 < child0.getChildren().length; i1++) {
        let child1 = child0.getChildren()[i1];
        if (!(child1 instanceof Accordion.Header)) {
          continue;
        }
        for (let i2 = 0; i2 < child1.getChildren().length; i2++) {
          let child2 = child1.getChildren()[i2];
          if (!(child2 instanceof Accordion.Button)) {
            continue;
          }
          if (shownFound) {
            child2.addClassNames("collapsed");
          } else if (!child2.hasClassName("collapsed")) {
            shownFound = true;
          }
          break;
        }
      }
    }
    return super.createVirtualElement();
  }

  calculateLayout() {
    let htmlElement = this.getHTMLElement();
    if (!htmlElement) {
      return;
    }
    this.catchOn(htmlElement);
  }

  catchOn(htmlElement: HTMLElement) {
    if (htmlElement.className.indexOf("accordion") < 0) {
      return;
    }
    let itemsHTMLElements = htmlElement.querySelectorAll(".accordion-item");
    for (let i = 0; i < itemsHTMLElements.length; i++) {
      let htmlElement = itemsHTMLElements[i].querySelector(".accordion-button");
      if (htmlElement) {
        htmlElement.addEventListener("mouseup", () => {
          this.onAccordionButtonMouseUp(htmlElement);
        });
      }
    }
  }

  onAccordionButtonMouseUp(element: Element | null) {
    if (!element) {
      return;
    }
    if (element.className.indexOf("collapsed") < 0) {
      // hide element
      element.classList.add("collapsed");
      if (element.parentElement) {
        // accordion-header
        element = element.parentElement;
        if (element.parentElement) {
          // accordion-item
          element = element.parentElement.querySelector(".accordion-collapse.collapse");
          if (element) {
            element.classList.remove("show");
          }
        }
      }
      return;
    }
    let accordionItemElement: HTMLElement | null = null;
    let accordionElement: HTMLElement | null = null;
    if (element.parentElement) {
      // accordion-header
      element = element.parentElement;
      if (element.parentElement) {
        // accordion-item
        accordionItemElement = element.parentElement;
        if (accordionItemElement.parentElement) {
          accordionElement = accordionItemElement.parentElement;
        }
      }
    }
    if (!accordionItemElement) {
      return;
    }
    if (accordionItemElement.className.indexOf("accordion-item") < 0) {
      return;
    }
    if (accordionElement === null) {
      return;
    }
    if (accordionElement.className.indexOf("accordion") < 0) {
      return;
    }
    accordionItemElement.classList.add("---shown");
    let itemsHTMLElements = accordionElement.querySelectorAll(".accordion-item");
    for (let i = 0; i < itemsHTMLElements.length; i++) {
      if (itemsHTMLElements[i].className.indexOf("---shown") < 0) {
        // close item
        let htmlElement = itemsHTMLElements[i].querySelector(".accordion-button");
        if (htmlElement) {
          htmlElement.classList.add("collapsed");
        }
        htmlElement = itemsHTMLElements[i].querySelector(".accordion-collapse.collapse");
        if (htmlElement) {
          htmlElement.classList.remove("show");
        }
        continue;
      }
      itemsHTMLElements[i].classList.remove("---shown");
      let htmlElement = itemsHTMLElements[i].querySelector(".accordion-button");
      if (!htmlElement) {
        continue;
      }
      htmlElement.classList.remove("collapsed");
      htmlElement = itemsHTMLElements[i].querySelector(".accordion-collapse.collapse");
      if (htmlElement) {
        htmlElement.classList.add("show");
      }
    }
  }
}

namespace Accordion {

  export class Item extends DIV {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("accordion-item");
    }

    addVirtualElementsTo(parentVirtualElement: VirtualElement) {
      let show = "";
      for (let i0 = 0; i0 < this.getChildren().length; i0++) {
        let child0 = this.getChildren()[i0];
        if (!(child0 instanceof Accordion.Header)) {
          continue;
        }
        for (let i1 = 0; i1 < child0.getChildren().length; i1++) {
          let child1 = child0.getChildren()[i1];
          if (child1 instanceof Accordion.Button) {
            if (!child1.hasClassName("collapsed")) {
              show = " show";
            }
            break;
          }
        }
      }
      this.getChildren().forEach((child: any) => {
        if (child instanceof Accordion.Body) {
          let virtualElement = new VirtualElement(undefined, "div", {
            className: "accordion-collapse collapse" + show
          });
          parentVirtualElement.addChild(virtualElement);
          virtualElement.addChild(child.createVirtualElement());
        } else {
          parentVirtualElement.addChild(child.createVirtualElement());
        }
      });
    }
  }

  export class Header extends H2 {

    constructor(...params: any) {
      super(undefined, ...params);
      this.addClassNames("accordion-header");
    }
  }

  export class Button extends BUTTON {

    constructor(text: string, ...params: any) {
      super(...params);
      this.addChild(new SPAN(text));
      this.addClassNames("accordion-button collapsed");
    }

    setCollapsed(collapsed: boolean) {

    }
  }

  export class Body extends DIV {

    constructor(...params: any) {
      super(...params);
      this.addClassNames("accordion-body");
    }
  }
}

export default Accordion;
