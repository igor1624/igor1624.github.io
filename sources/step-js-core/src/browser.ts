import VirtualElement from "./virtual-element";
import Ref from "./ref";
import Component from "./component";

class Browser {
  static mountedVirtualElements: VirtualElement[] = [];
  static hasDirtyVirtualElements = false;

  static mount(object: any, parentHTMLElement: HTMLElement | null) {
    if (!parentHTMLElement) {
      alert("parentHTMLElement not found");
      return;
    }
    const virtualElement = this.createVirtualElement(object);
    Browser.mountVirtualElement(parentHTMLElement, virtualElement);
  }

  static createVirtualElement(object: any, props?: any, ...children: any) {
    props = props || {};
    children = Array.isArray(children[0]) ? children[0] : children;

    if (typeof object === "function") {
      // merge props and children
      props = {...props, children: (props.children || []).concat(children)};

      const narrowsComponent = (object: any) => {
        while (object) {
          if (object instanceof Component) {
            return true;
          }
          object = object.prototype;
        }
        return false;
      };

      if (narrowsComponent(object)) {
        const component = new object(props);
        return component.createVirtualElement();
      }
      return object(props);
    }

    if (typeof object === "object") {
      // was created by new
      return object.createVirtualElement();
    }

    // object may be undefined for <>
    const virtualElement = new VirtualElement(undefined, object, props);
    if (children) {
      children.forEach((child: any) => {
        if (child == null) {
        } else if (child === true) {
        } else if (child === false) {
        } else if (child instanceof VirtualElement) {
          virtualElement.addChild(child);
        } else {
          // html
          virtualElement.addChild(new VirtualElement(undefined, "-text", child));
        }
      });
    }
    return virtualElement;
  }

  // mount modal

  static mountModal(component: Component) {
    const htmlElement = document.createElement("div");
    document.body.appendChild(htmlElement);
    Browser.mount(component, htmlElement);
  }

  // unmountModal

  static unmountModal(component: Component) {

    for (let i = 0; i < Browser.mountedVirtualElements.length; i++) {
      const virtualElement = Browser.mountedVirtualElements[i];
      if (component.virtualElement !== virtualElement) {
        continue;
      }
      Browser.unmountVirtualElement(virtualElement);
      break;
    }
  }

  // show virtual element, used for popups

  static showVirtualElement(virtualElement: VirtualElement | null) {
    if (!virtualElement) {
      return;
    }
    const htmlElement = virtualElement.getHTMLElement();
    if (!htmlElement) {
      return;
    }
    let parentHTMLElement;
    if (virtualElement.parent) {
      parentHTMLElement = virtualElement.parent.getHTMLElement()
    }
    virtualElement["mounted-parent"] = virtualElement.parent;
    virtualElement.parent = null;
    Browser.mountedVirtualElements.push(virtualElement);

    const fixedHTMLElement = document.createElement("div");
    fixedHTMLElement.style.position = "fixed";
    fixedHTMLElement.style.left = "0";
    fixedHTMLElement.style.top = "0";
    fixedHTMLElement.style.right = "0";
    fixedHTMLElement.style.bottom = "0";
    fixedHTMLElement.setAttribute("data-key", `-fixed-${virtualElement.key}`);
    document.body.appendChild(fixedHTMLElement);

    if (parentHTMLElement) {
      parentHTMLElement.removeChild(htmlElement);
    }
    htmlElement.style.position = "fixed";
    fixedHTMLElement.appendChild(htmlElement);
    fixedHTMLElement.addEventListener("click", Browser.handleDummyClick);
    Browser.passCalculateLayout(virtualElement);
    Browser.passAdjustLayout(virtualElement);
  }

  // hide virtual element, used for popups

  static hideVirtualElement(virtualElement: VirtualElement | null) {
    if (!virtualElement) {
      return;
    }
    const htmlElement = virtualElement.getHTMLElement();
    if (!htmlElement) {
      return;
    }
    let elements = document.querySelectorAll(`[data-key=-fixed-${virtualElement.key}]`);
    if (elements.length !== 1) {
      return;
    }
    const fixedHTMLElement = elements.item(0) as HTMLElement;
    fixedHTMLElement.removeEventListener("click", Browser.handleDummyClick);
    fixedHTMLElement.removeChild(htmlElement);
    virtualElement.parent = virtualElement["mounted-parent"];
    if (virtualElement.parent) {
      const parentHTMLElement = virtualElement.parent.getHTMLElement();
      if (parentHTMLElement) {
        parentHTMLElement.appendChild(htmlElement);
      }
    }
    Browser.deleteHTMLElement(fixedHTMLElement);
  }

  static handleDummyClick = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    let virtualElement = Browser.mountedVirtualElements[Browser.mountedVirtualElements.length - 1];
    if (!virtualElement) {
      return;
    }
    if (virtualElement.constructedBy) {
      if (virtualElement.constructedBy.hide) {
        virtualElement.constructedBy.hide();
      }
    }
  };

  // browser

  static mountVirtualElement(parentHTMLElement: HTMLElement, virtualElement: VirtualElement) {
    Browser.mountedVirtualElements.push(virtualElement);
    parentHTMLElement.innerHTML = virtualElement.createHTMLString();
    Browser.passCalculateLayout(virtualElement);
    Browser.passAdjustLayout(virtualElement);
    Browser.passAttachVirtualElementToDOM(virtualElement);
    Browser.passDidMount(virtualElement);
    if (Browser.mountedVirtualElements.length === 1) {
      window.onresize = () => {
        Browser.mountedVirtualElements.forEach((virtualElement) => {
          Browser.passCalculateLayout(virtualElement);
          Browser.passAdjustLayout(virtualElement);
        });
      };
    }
  }

  // passCalculateLayout

  static passCalculateLayout(virtualElement: VirtualElement) {
    const browseVirtualElements = (virtualElement) => {
      if (virtualElement.constructedBy) {
        if (virtualElement.constructedBy.calculateLayout) {
          virtualElement.constructedBy.calculateLayout();
        }
      }
      virtualElement.getChildren().forEach((child) => {
        browseVirtualElements(child);
      });
    };
    browseVirtualElements(virtualElement);
  }

  // passAdjustLayout

  static passAdjustLayout(virtualElement: VirtualElement) {
    const browseVirtualElements = (virtualElement) => {
      virtualElement.getChildren().forEach((child) => {
        browseVirtualElements(child);
      });
      if (virtualElement.constructedBy) {
        if (virtualElement.constructedBy.adjustLayout) {
          virtualElement.constructedBy.adjustLayout();
        }
      }
    };
    browseVirtualElements(virtualElement);
  }

  // passAttachVirtualElementToDOM

  static passAttachVirtualElementToDOM(virtualElement: VirtualElement) {
    const browseVirtualElement = (virtualElement) => {
      Object.keys(virtualElement.props).forEach((propName) => {
        if (propName === "ref") {
          Browser.setRef(virtualElement);
        }
      });
      virtualElement.getChildren().forEach((child) => {
        browseVirtualElement(child);
      });
      virtualElement.attachToDOM();
    };
    browseVirtualElement(virtualElement);
  }

  // setRef

  static setRef(virtualElement: VirtualElement | null) {
    while (virtualElement) {
      const constructedBy = virtualElement.constructedBy;
      if (constructedBy) {
        Object.keys(constructedBy).forEach((keyName) => {
          if (constructedBy) {
            if (constructedBy[keyName] instanceof Ref) {
              const ref = constructedBy[keyName];
              const nodes = document.querySelectorAll(`[data-ref="${ref.key}"]`);
              if (nodes.length === 1) {
                ref.current = nodes.item(0);
              }
            }
          }
        });
      }
      virtualElement = virtualElement.parent;
    }
  }

  // passDidMount

  static passDidMount(virtualElement: VirtualElement) {
    const browseVirtualElements = (virtualElement) => {
      virtualElement.getChildren().forEach((child) => {
        browseVirtualElements(child);
      });
      if (virtualElement.constructedBy) {
        if (virtualElement.constructedBy.callWidgetDidMount) {
          virtualElement.constructedBy.callWidgetDidMount();
        } else if (virtualElement.constructedBy.callComponentDidMount) {
          virtualElement.constructedBy.callComponentDidMount();
        }
      }
    };
    browseVirtualElements(virtualElement);
  }

  // smudge virtual element

  static smudgeVirtualElement(virtualElement: VirtualElement) {
    virtualElement.dirty = true;
    if (Browser.hasDirtyVirtualElements) {
      return;
    }
    Browser.hasDirtyVirtualElements = true;
    setTimeout(() => {
      Browser.remountDirtyVirtualElements();
    }, 0);
  }

  // remount dirty virtual elements

  static remountDirtyVirtualElements() {
    let milliseconds = new Date().getMilliseconds();
    let dirtyVirtualElement;
    const browseVirtualElements = (virtualElement) => {
      if (virtualElement.dirty) {
        dirtyVirtualElement = virtualElement;
        return;
      }
      virtualElement.getChildren().forEach((child) => {
        browseVirtualElements(child);
      });
    };
    for (let i = 0; i < Browser.mountedVirtualElements.length; i++) {
      browseVirtualElements(Browser.mountedVirtualElements[i]);
      if (dirtyVirtualElement) {
        if (dirtyVirtualElement.constructedBy) {
          if (dirtyVirtualElement.constructedBy.createVirtualElement) {
            let substitutionVirtualElement = dirtyVirtualElement.constructedBy.createVirtualElement();
            Browser.unmountVirtualElement(dirtyVirtualElement, substitutionVirtualElement);
          }
        }
      }
    }
    Browser.hasDirtyVirtualElements = false;
    milliseconds = new Date().getMilliseconds() - milliseconds;
    console.log(`Device.remountDirtyVirtualElements took ${milliseconds} milliseconds`);
  }

  // unmount virtual element

  static unmountVirtualElement(virtualElement: VirtualElement, substitutionVirtualElement?: VirtualElement) {
    let parentVirtualElement;
    let htmlElement;
    let parentElement;
    parentVirtualElement = virtualElement.parent;
    let virtualElements;
    if (parentVirtualElement) {
      virtualElements = parentVirtualElement.getChildren();
    } else {
      virtualElements = Browser.mountedVirtualElements;
    }
    let i;
    for (i = virtualElements.length - 1; i >= 0; i--) {
      if (virtualElements[i].key === virtualElement.key) {
        break;
      }
    }
    if (i < 0) {
      console.error("Existing virtual element not found:", virtualElement.key);
      return;
    }
    htmlElement = virtualElement.getHTMLElement();
    if (!htmlElement) {
      console.error("Virtual element not connected to DOM:", virtualElement.key);
      return;
    }
    parentElement = htmlElement.parentElement;
    if (!parentElement) {
      console.error("Existing virtual element doesn't have parentElement:", virtualElement.key);
      return;
    }
    Browser.passWillUnmount(virtualElement);
    Browser.passDetachVirtualElementFromDOM(virtualElement);
    if (!substitutionVirtualElement) {
      if (parentVirtualElement) {
        parentVirtualElement.children.splice(i, 1);
      } else {
        Browser.mountedVirtualElements.splice(i, 1);
      }
      parentElement.removeChild(htmlElement);
      Browser.deleteHTMLElement(htmlElement);
      return;
    }
    if (parentVirtualElement) {
      parentVirtualElement.children[i] = substitutionVirtualElement;
      substitutionVirtualElement.parent = parentVirtualElement;
    } else {
      Browser.mountedVirtualElements[i] = substitutionVirtualElement;
    }
    const substitutionHTMLElement = substitutionVirtualElement.createHTMLElement();
    parentElement.replaceChild(substitutionHTMLElement, htmlElement);
    Browser.deleteHTMLElement(htmlElement);
    Browser.passCalculateLayout(substitutionVirtualElement);
    Browser.passAdjustLayout(substitutionVirtualElement);
    Browser.passAttachVirtualElementToDOM(substitutionVirtualElement);
    Browser.passDidMount(substitutionVirtualElement);
  }

  // passWillUnmount

  static passWillUnmount(virtualElement: VirtualElement) {
    const browseVirtualElements = (virtualElement) => {
      if (!virtualElement) {
        return;
      }
      if (virtualElement.constructedBy) {
        if (virtualElement.constructedBy.callWidgetWillUnmount) {
          virtualElement.constructedBy.callWidgetWillUnmount();
        } else if (virtualElement.constructedBy.callComponentDidMount) {
          virtualElement.constructedBy.callComponentWillUnmount();
        }
      }
      virtualElement.getChildren().forEach((child) => {
        browseVirtualElements(child);
      });
    };
    browseVirtualElements(virtualElement);
  }

  // passDetachVirtualElementFromDOM

  static passDetachVirtualElementFromDOM(virtualElement: VirtualElement) {
    const browseVirtualElement = (virtualElement) => {
      if (!virtualElement) {
        return;
      }
      virtualElement.getChildren().forEach((child) => {
        browseVirtualElement(child);
      });
      virtualElement.detachFromDOM();
    };
    browseVirtualElement(virtualElement);
  }

  static deleteHTMLElement(htmlElement: HTMLElement) {
    let milliseconds = new Date().getMilliseconds();
    let i = 0;
    const browseElements = (element) => {
      while (element.firstChild) {
        browseElements(element.lastChild);
        element.removeChild(element.lastChild);
        i++;
      }
    };
    browseElements(htmlElement);
    htmlElement.remove();
    milliseconds = new Date().getMilliseconds() - milliseconds;
    console.log(`Device.deleteHTMLElement(${i}) took ${milliseconds} milliseconds`);
  }

  // find virtual element by key

  static findVirtualElementByKey(key: string | null) : VirtualElement | null {
    if (!key) {
      return null;
    }
    let foundVirtualElement = null;
    const browseVirtualElement = (virtualElement) => {
      if (virtualElement.key === key) {
        foundVirtualElement = virtualElement;
        return;
      }
      const children = virtualElement.getChildren();
      for (let i = 0; i < children.length; i++) {
        browseVirtualElement(children[i]);
        if (foundVirtualElement) {
          return;
        }
      }
    };
    for (let i = 0; i < Browser.mountedVirtualElements.length; i++) {
      browseVirtualElement(Browser.mountedVirtualElements[i]);
      if (foundVirtualElement) {
        break;
      }
    }
    return foundVirtualElement;
  }

  // mountHTMLElement

  static mountHTMLElement(parentHTMLElement: HTMLElement, tagName: string, props?: any) {
    const htmlElement = document.createElement(tagName);
    Object.keys(props || {}).forEach((propName) => {
      if (propName === "className") {
        htmlElement.className = props[propName];
      } else if (propName === "style") {
        Object.keys(props[propName]).forEach((ruleName) => {
          htmlElement.style[ruleName] = props.style[ruleName];
        });
      } else if (typeof props[propName] === "function") {
        if (propName.indexOf("on") === 0) {
          const handlerName = propName.substring(2).toLowerCase();
          htmlElement.addEventListener(handlerName, (event) => {
            props[propName](event);
          });
        }
      } else {
        htmlElement.setAttribute(propName, props[propName]);
      }
    });
    parentHTMLElement.appendChild(htmlElement);
    return htmlElement;
  }
}

export default Browser;
