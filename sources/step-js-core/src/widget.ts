import Utils from "./utils";
import Component from "./component";
import VirtualElement from "./virtual-element";

type ON_CLICK = (event?: any) => void | false | true;
type ON_DBL_CLICK = (event?: any) => void | false | true;

class Widget extends Component {

  readonly tagName: string;
  classNames: string[] = [];

  innerHTML: any;
  children: Component[] | undefined;

  constructor(tagName: string, ...params: any) {
    super();
    this.tagName = tagName;
    if (typeof params[0] === "string") {
      this.addClassNames(params[0]);
    } else if (params[0] instanceof Widget) {
      params[0].addChild(this);
    } else if (typeof params[0] === "object") {
      this.props = Object.assign({}, params[0]);
    }
    if (typeof params[1] === "string") {
      this.addClassNames(params[1]);
    } else if (params[1] instanceof Widget) {
      params[1].addChild(this);
    } else if (typeof params[1] === "object") {
      this.props = Object.assign({}, params[1]);
    }
    if (typeof params[2] === "string") {
      this.addClassNames(params[2]);
    } else if (params[2] instanceof Widget) {
      params[2].addChild(this);
    } else if (typeof params[2] === "object") {
      this.props = Object.assign({}, params[2]);
    }
    this.props = this.props || {};
  }

  destroy() {
    // called from VirtualElement.destroy
    super.destroy();
    this.classNames = [];
    this.innerHTML = null;
    this.virtualElement = null;
  }

  destroyChildren() {
    if (this.children) {
      this.children.forEach((component: Component) => {
        component.destroy();
      });
    }
    this.children = [];
  }

  getClassName() {
    return this.classNames.join(" ");
  }

  hasClassName(className: string) {
    if (!this.classNames) {
      return false;
    }
    return this.classNames.includes(className);
  }

  addClassNames(className: string) {
    const classNames = className.split(" ");
    classNames.forEach((className: string) => {
      if (this.classNames.indexOf(className) === -1) {
        this.classNames.push(className);
      }
    });
    const htmlElement = this.getHTMLElement();
    if (htmlElement) {
      htmlElement.classList.add(className);
    }
    return this;
  }

  removeClassName(className: string) {
    const classNames = className.split(" ");
    classNames.forEach((className: string) => {
      const i = this.classNames.indexOf(className);
      if (i >= 0) {
        this.classNames.splice(i, 1);
      }
    });
    if (this.getHTMLElement()) {
      this.getHTMLElement()?.classList.remove(className);
    }
    return this;
  }

  toggleClassName(className: string) {
    const classNames = className.split(" ");
    classNames.forEach((className: string) => {
      const i = this.classNames.indexOf(className);
      if (i >= 0) {
        this.classNames.splice(i, 1);
      } else {
        this.classNames.push(className);
      }
    });
    if (this.getHTMLElement()) {
      this.getHTMLElement()!.className = this.getClassName();
    }
    return this;
  }

  resetClassName() {
    this.classNames = [];
    return this;
  }

  getStyle() {
    if (!this.props) {
      return {};
    }
    return this.props.style || {};
  }

  setStyle(style: Object) {
    this.props.style = style;
    if (this.virtualElement) {
      const htmlElement = this.virtualElement.getHTMLElement() as HTMLElement;
      if (htmlElement) {
        Object.keys(this.props.style).forEach((ruleName: string) => {
          (htmlElement.style as any)[ruleName] = this.props.style[ruleName];
        });
      }
    }
    return this;
  }

  getStyleRule(name: string) {
    if (!this.props) {
      return null;
    }
    if (!this.props.style) {
      return null;
    }
    return this.props.style[name];
  }

  setStyleRule(name: string, value: string) {
    this.props.style = this.props.style || {};
    this.props.style[name] = value;
    if (this.getHTMLElement()) {
      (this.getHTMLElement()!.style as any)[name] = value;
    }
    return this;
  }

  setInnerText(innerText: string) {
    this.setInnerHTML(Utils.textToHTML(innerText));
    return this;
  }

  setInnerHTML(innerHTML: string) {
    this.innerHTML = innerHTML;
    const htmlElement = this.virtualElement?.getHTMLElement();
    if (htmlElement) {
      htmlElement.innerHTML = this.innerHTML;
    }
    return this;
  }

  getChildren() {
    return this.children ? this.children : [];
  }

  addChild(child: any) {
    if (!this.children) {
      this.children = [child];
    } else {
      this.children.push(child);
    }
    return child;
  }

  createVirtualElement() {
    if ((this as any)["mount"]) {
      this.destroyChildren();
      (this as any)["mount"]();
    }

    this.virtualElement = new VirtualElement(this, this.tagName, this.props || {});

    let className = this.getClassName();
    if (className) {
      this.virtualElement.props.className = className;
    }
    this.addVirtualElementsTo(this.virtualElement);
    return this.virtualElement;
  }

  addVirtualElementsTo(parentVirtualElement: VirtualElement) {
    this.getChildren().forEach((child: any) => {
      this.addVirtualElement(parentVirtualElement, child);
    });
  }

  addVirtualElement(parentVirtualElement: VirtualElement, child: any) {
    if (child instanceof VirtualElement) {
      // is ready-to-go
      parentVirtualElement.addChild(child);
    } else if (child instanceof Component) {
      parentVirtualElement.addChild(child.createVirtualElement());
    }
  }

  callWidgetDidMount() {
    // restore observers if any
    this.mountObservedShelves();
    this.widgetDidMount();
  }

  widgetDidMount() {
  }

  callWidgetWillUnmount() {
    this.widgetWillUnmount();
    // store observers if any
    this.unmountObservedShelves();
  }

  widgetWillUnmount() {
  }

  onClick: ON_CLICK | undefined = undefined;
  onDblClick: ON_DBL_CLICK | undefined = undefined;
}

export default Widget;
