import Utils from "./utils";

class VirtualElement {
  constructedBy: any;
  tagName: string;
  key: string;
  props: any;

  children?: VirtualElement[];
  parent: VirtualElement | null = null;

  dirty = false;

  // getChildren
  constructor(constructedBy: any, tagName: string, props?: any) {
    this.constructedBy = constructedBy;
    this.tagName = tagName;
    this.key = this.constructedBy ? this.constructedBy.key : "";
    if (!this.key) {
      this.key = `${this.tagName}_${Utils.getNextKey()}`;
    }
    this.props = props ? props : {};
  }

  getChildren() {
    if (this.children) {
      return this.children;
    }
    return [];
  };

  // addChild

  addChild(child) {
    child.parent = this;
    if (!this.children) {
      this.children = [child];
    } else {
      this.children.push(child);
    }
  };

  // createHTMLString

  createHTMLString() {
    if (this.tagName === undefined) {
      // <>
      let htmlString = "";
      this.getChildren().forEach((child) => {
        htmlString += child.createHTMLString();
      });
      return htmlString;
    }
    if (this.tagName === "-text") {
      return this.props;
    }
    let htmlString = "<" + this.tagName;
    htmlString += ` data-key="${this.key}"`;
    Object.keys(this.props || {}).forEach((propName) => {
      if (propName === "className") {
        htmlString += ` class="${this.props.className}"`;
      } else if (propName === "style") {
        htmlString += this.createStyleString();
      } else if (propName === "ref") {
        const ref = this.props[propName];
        htmlString += ` data-ref="${ref.key}"`;
      } else if (typeof this.props[propName] === "function") {
        // skip method
      } else if (this.tagName === "path") {
        // svg
        const dashedPropName = propName.replace(/[A-Z]/g, propName => "-" + propName.toLowerCase());
        htmlString += ` ${dashedPropName}="${this.props[propName]}"`;
      } else if (this.tagName === "rect") {
        // svg
        const dashedPropName = propName.replace(/[A-Z]/g, propName => "-" + propName.toLowerCase());
        htmlString += ` ${dashedPropName}="${this.props[propName]}"`;
      } else {
        htmlString += ` ${propName}="${this.props[propName]}"`;
      }
    });
    if (this.constructedBy) {
      if (this.constructedBy.attributes) {
        Object.keys(this.constructedBy.attributes).forEach((attributeName) => {
          htmlString += ` ${attributeName}="${this.constructedBy.attributes[attributeName] ? this.constructedBy.attributes[attributeName] : ''}"`;
        });
      }
      if (this.constructedBy.dataAttributes) {
        Object.keys(this.constructedBy.dataAttributes).forEach((dataAttributeName) => {
          htmlString += ` data-${dataAttributeName}="${this.constructedBy.dataAttributes[dataAttributeName] ? this.constructedBy.dataAttributes[dataAttributeName] : ''}"`;
        });
      }
    }
    htmlString += ">";

    let innerHTML = undefined;
    if (this.constructedBy) {
      if (this.constructedBy.innerHTML) {
        innerHTML = this.constructedBy.innerHTML;
      }
    }
    if (innerHTML) {
      htmlString += innerHTML;
    }
    this.getChildren().forEach((child) => {
      htmlString += child.createHTMLString();
    });
    return htmlString + `</${this.tagName}>`;
  };

  // createStyleString

  createStyleString() {
    const convertStyleRuleName = (styleRuleName) => {
      return styleRuleName.replace(/[A-Z]/g, styleRuleName => "-" + styleRuleName.toLowerCase());
    };

    const styleProps = this.props.style || {};

    let htmlString = " style=\"";
    Object.keys(styleProps).forEach((ruleName) => {
      htmlString += convertStyleRuleName(ruleName) + ":" + styleProps[ruleName] + ";";
    });
    return htmlString + "\"";
  };

  // createHTMLElement

  createHTMLElement() {
    const htmlElement = document.createElement(this.tagName);
    if ((this.props) && (this.props.className)) {
      htmlElement.className = this.props.className;
    }
    htmlElement.setAttribute("data-key", this.key);
    Object.keys(this.props).forEach((propName) => {
      if (propName === "className") {
      } else if (propName === "style") {
        Object.keys(this.props[propName]).forEach((ruleName) => {
          htmlElement.style[ruleName] = this.props.style[ruleName];
        });
      } else if (propName === "ref") {
        const ref = this.props[propName];
        htmlElement.setAttribute("data-ref", ref.key);
      } else if (typeof this.props[propName] === "function") {
      } else if (this.tagName === "path") {
        // svg
        const dashedPropName = propName.replace(/[A-Z]/g, propName => "-" + propName.toLowerCase());
        htmlElement.setAttribute(dashedPropName, this.props[propName]);
      } else if (this.tagName === "rect") {
        // svg
        const dashedPropName = propName.replace(/[A-Z]/g, propName => "-" + propName.toLowerCase());
        htmlElement.setAttribute(dashedPropName, this.props[propName]);
      } else {
        htmlElement.setAttribute(propName, this.props[propName]);
      }
    });
    if (this.constructedBy) {
      if (this.constructedBy.attributes) {
        Object.keys(this.constructedBy.attributes).forEach((attributeName) => {
          htmlElement.setAttribute("attributeName", this.constructedBy.attributes[attributeName] ? this.constructedBy.attributes[attributeName] : "");
        });
      }
      if (this.constructedBy.dataAttributes) {
        Object.keys(this.constructedBy.dataAttributes).forEach((dataAttributeName) => {
          htmlElement.setAttribute(`data-${dataAttributeName}`, this.constructedBy.dataAttributes[dataAttributeName] ? this.constructedBy.dataAttributes[dataAttributeName] : "");
        });
      }
    }
    let innerHTML = "";
    this.getChildren().forEach((child) => {
      innerHTML += child.createHTMLString();
    });
    htmlElement.innerHTML = innerHTML;
    return htmlElement;
  };

  // attachToDOM

  attachToDOM() {
    this.addThisEventListeners();
    this.addConstructedByEventListeners();
    if (this.constructedBy) {
      if (this.constructedBy.attachToDOM) {
        this.constructedBy.attachToDOM();
      }
    }
  };

  // addThisEventListeners

  addThisEventListeners() {
    Object.keys(this.props).forEach((propName) => {
      if (typeof this.props[propName] !== "function") {
        return;
      }
      if (propName.indexOf("on") !== 0) {
        return;
      }
      const eventType = propName.substring(2).toLowerCase();
      this.addThisEventListener(eventType, propName);
    });
  };

  // addThisEventListener

  addThisEventListener(eventType, functionName) {
    const handlerName = `$thisEventHandler${functionName}`;
    const that = this;
    this.props[handlerName] = (event) => {
      let result = that.props[functionName](event);
      if (result !== false) {
        // return false to continue bubbling
        event.stopPropagation();
        event.preventDefault();
      }
    };
    const htmlElement = this.getHTMLElement();
    if (htmlElement) {
      htmlElement.addEventListener(eventType, this.props[handlerName]);
    }
  };

  // addConstructedByEventListeners

  addConstructedByEventListeners() {
    if (!this.constructedBy) {
      return;
    }
    Object.keys(this.constructedBy).forEach((memberName) => {
      if (typeof this.constructedBy[memberName] !== "function") {
        return;
      }
      if (memberName.indexOf("on") !== 0) {
        return;
      }
      const eventType = memberName.substring(2).toLowerCase();
      this.addConstructedByEventListener(eventType, memberName);
    });
  };

  // addConstructedByEventListener

  addConstructedByEventListener(eventType, functionName) {
    const handlerName = `$constructedByEventHandler${functionName}`;
    const that = this.constructedBy;
    this.props[handlerName] = (event) => {
      let result = that[functionName](event);
      if (result !== false) {
        // return false to continue bubbling
        event.stopPropagation();
        event.preventDefault();
      }
    };
    const htmlElement = this.getHTMLElement();
    if (htmlElement) {
      htmlElement.addEventListener(eventType, this.props[handlerName]);
    }
  };

  // getHTMLElement

  getHTMLElement() {
    let elements = document.querySelectorAll(`[data-key=${this.key}]`);
    if (elements.length !== 1) {
      return null;
    }
    return elements.item(0) as HTMLElement;
  };

  // detachFromDOM

  detachFromDOM() {
    this.removeThisEventListeners();
    this.removeConstructedByEventListeners();
    if (this.constructedBy) {
      if (this.constructedBy.detachFromDOM) {
        this.constructedBy.detachFromDOM();
      }
    }
  };

  // removeThisEventListeners

  removeThisEventListeners() {
    Object.keys(this.props).forEach((propName) => {
      if (typeof this.props[propName] !== "function") {
        return;
      }
      if (propName.indexOf("on") !== 0) {
        return;
      }
      const eventType = propName.substring(2).toLowerCase();
      this.removeThisEventListener(eventType, propName);
    });
  };

  // removeThisEventListener

  removeThisEventListener(eventType, functionName) {
    const handlerName = `$thisEventHandler${functionName}`;
    const htmlElement = this.getHTMLElement();
    if (htmlElement) {
      htmlElement.removeEventListener(eventType, this.props[handlerName]);
    }
  };

  // removeConstructedByEventListeners

  removeConstructedByEventListeners() {
    if (!this.constructedBy) {
      return;
    }
    Object.keys(this.constructedBy).forEach((memberName) => {
      if (typeof this.constructedBy[memberName] !== "function") {
        return;
      }
      if (memberName.indexOf("on") !== 0) {
        return;
      }
      const eventType = memberName.substring(2).toLowerCase();
      this.removeConstructedByEventListener(eventType, memberName);
    });
  };

  // removeConstructedByEventListener

  removeConstructedByEventListener(eventType, functionName) {
    const handlerName = `$constructedByEventHandler${functionName}`;
    const htmlElement = this.getHTMLElement();
    if (htmlElement) {
      htmlElement.removeEventListener(eventType, this.props[handlerName]);
    }
  };
}

export default VirtualElement;
