// https://www.youtube.com/watch?v=KEEGIRGDMLg

import {
  VirtualElement
} from "@step-js-core/index";
import {
  ScrollablePanel
} from "./scrollable-panel";
import ScrollBar from "./scroll-bar";

class ScrollBars {
  parent: ScrollablePanel;
  type: "x-scroll-bar" | "y-scroll-bar" | "xy-scroll-bars";
  viewportVirtualElement: VirtualElement | null = null;
  contentWrapperVirtualElement: VirtualElement | null = null;
  xScrollBar?: ScrollBar;
  yScrollBar?: ScrollBar;

  constructor(parent: ScrollablePanel, type: "x-scroll-bar" | "y-scroll-bar" | "xy-scroll-bars") {
    this.parent = parent;
    this.type = type;
  }

  createVirtualElementForParent() {
    if ((this.parent as any)["mount"]) {
      this.parent.destroyChildren();
      (this.parent as any)["mount"]();
    }

    this.parent.props.style = this.parent.props.style || {};
    this.parent.props.style.overflow = "hidden";

    this.parent.virtualElement = new VirtualElement(this.parent, this.parent.tagName, this.parent.props || {});

    let className = this.parent.getClassName();
    if (className) {
      this.parent.virtualElement.props.className = className;
    }
    this.xScrollBar = undefined;
    this.yScrollBar = undefined;
    this.viewportVirtualElement = this.createViewportVirtualElement();
    this.parent.virtualElement.addChild(this.viewportVirtualElement);
    this.viewportVirtualElement.props.onScroll = (event: any) => {
      this.handleScroll(event);
    };
    this.contentWrapperVirtualElement = new VirtualElement(undefined, "div", {
      className: "step-js-scrollable-panel-content-wrapper",
    });
    this.viewportVirtualElement.addChild(this.contentWrapperVirtualElement);
    this.parent.addVirtualElementsTo(this.contentWrapperVirtualElement);
    this.addScrollBars();
    return this.parent.virtualElement;
  }

  createViewportVirtualElement() {
    const style: any = {};
    if (this.type === "y-scroll-bar") {
      style.overflowY = "scroll";
      style.overflowX = "hidden";
    } else if (this.type === "x-scroll-bar") {
      style.overflowY = "hidden";
      style.overflowX = "scroll";
    } else if (this.type === "xy-scroll-bars") {
      style.overflow = "scroll";
    }
    return new VirtualElement(undefined, "div", {
      className: "step-js-scrollable-panel-viewport",
      style: style
    });
  }

  addScrollBars() {
    if (!this.parent.virtualElement) {
      return;
    }

    if ((this.type === "x-scroll-bar") || (this.type === "xy-scroll-bars")) {
      this.xScrollBar = new ScrollBar();
      let left = 0;
      let right = 0;
      this.xScrollBar.trackVirtualElement = new VirtualElement(undefined, "div", {
        className: "step-js-scroll-bar-track",
        style: {
          left: left + "px",
          bottom: 0,
          right: right + "px",
          height: `${this.parent.scrollBarSize}px`,
        }
      });
      this.parent.virtualElement.addChild(this.xScrollBar.trackVirtualElement);
      this.xScrollBar.trackVirtualElement.props.onPointerDown = (event: any) => {
        this.handleXScrollBarPointerDown(event);
      };
      this.xScrollBar.trackVirtualElement.props.onPointerUp = (event: any) => {
        this.handleXScrollBarPointerUp(event);
      };
      this.xScrollBar.thumbVirtualElement = new VirtualElement(undefined, "div", {
        className: "step-js-scroll-bar-thumb",
        style: {
          display: "none",
          top: 0,
          bottom: 0,
        }
      });
      this.xScrollBar.trackVirtualElement.addChild(this.xScrollBar.thumbVirtualElement);
      this.xScrollBar.thumbVirtualElement.props.onPointerMove = (event: any) => {
        this.handleXScrollBarPointerMove(event);
      };
    }
    if ((this.type === "y-scroll-bar") || (this.type === "xy-scroll-bars")) {
      let top = 0;
      let bottom = 0;
      this.yScrollBar = new ScrollBar();
      this.yScrollBar.trackVirtualElement = new VirtualElement(undefined, "div", {
        className: "step-js-scroll-bar-track",
        style: {
          right: 0,
          top: top + "px",
          width: `${this.parent.scrollBarSize}px`,
          bottom: bottom + "px",
        }
      });
      this.parent.virtualElement.addChild(this.yScrollBar.trackVirtualElement);
      this.yScrollBar.trackVirtualElement.props.onPointerDown = (event: any) => {
        this.handleYScrollBarPointerDown(event);
      };
      this.yScrollBar.trackVirtualElement.props.onPointerUp = (event: any) => {
        this.handleYScrollBarPointerUp(event);
      };
      this.yScrollBar.thumbVirtualElement = new VirtualElement(undefined, "div", {
        className: "step-js-scroll-bar-thumb",
        style: {
          display: "none",
          left: 0,
          right: 0,
        }
      });
      this.yScrollBar.trackVirtualElement.addChild(this.yScrollBar.thumbVirtualElement);
      this.yScrollBar.thumbVirtualElement.props.onPointerMove = (event: any) => {
        this.handleYScrollBarPointerMove(event);
      };
    }
  }

  adjustScrollBars() {
    if ((this.xScrollBar) || (this.yScrollBar)) {
      if (this.xScrollBar) {
        this.xScrollBar.thumbSize = 0.0;
      }
      if (this.yScrollBar) {
        this.yScrollBar.thumbSize = 0.0;
      }
    } else {
      return;
    }

    const scrollBarSize = this.parent.scrollBarSize;
    const viewportSize = this.calculateViewportSize();
    const contentWrapperSize = this.calculateContentWrapperSize();

    if (this.xScrollBar) {
      if (this.xScrollBar.trackVirtualElement) {
        let htmlElement = this.xScrollBar.trackVirtualElement.getHTMLElement();
        if (htmlElement) {
          const rect = htmlElement.getBoundingClientRect();
          this.xScrollBar.viewportSize = viewportSize[0];
          this.xScrollBar.contentWrapperSize = contentWrapperSize[0];
          this.xScrollBar.trackSize = rect.width;
          if (viewportSize[0] < contentWrapperSize[0]) {
            this.xScrollBar.thumbSize = Math.max(viewportSize[0] * this.xScrollBar.trackSize / contentWrapperSize[0], scrollBarSize * 2 + 1);
            //console.log('viewportSize', this.yScrollBar.viewportSize, 'this.yScrollBar.contentWrapperSize', this.yScrollBar.contentWrapperSize, 'this.yScrollBar.trackSize', this.yScrollBar.trackSize, this.yScrollBar.thumbSize)
          }
        }
      }
    }

    if (this.yScrollBar) {
      if (this.yScrollBar.trackVirtualElement) {
        let htmlElement = this.yScrollBar.trackVirtualElement.getHTMLElement();
        if (htmlElement) {
          const rect = htmlElement.getBoundingClientRect();
          this.yScrollBar.viewportSize = viewportSize[1];
          this.yScrollBar.contentWrapperSize = contentWrapperSize[1];
          this.yScrollBar.trackSize = rect.height;
          if (viewportSize[1] < contentWrapperSize[1]) {
            this.yScrollBar.thumbSize = Math.max(viewportSize[1] * this.yScrollBar.trackSize / contentWrapperSize[1], scrollBarSize * 2 + 1);
            //console.log('viewportSize', this.yScrollBar.viewportSize, 'this.yScrollBar.contentWrapperSize', this.yScrollBar.contentWrapperSize, 'this.yScrollBar.trackSize', this.yScrollBar.trackSize, this.yScrollBar.thumbSize)
          }
        }
      }
    }
    this.updateXScrollBar();
    this.updateYScrollBar();
  }

  calculateViewportSize() {
    let size = [0.0, 0.0];
    if (!this.viewportVirtualElement) {
      return size;
    }
    let htmlElement = this.viewportVirtualElement.getHTMLElement();
    if (!htmlElement) {
      return size;
    }
    size[0] = htmlElement.offsetWidth;
    size[1] = htmlElement.offsetHeight;
    return size;
  }

  calculateContentWrapperSize() {
    let size = [0.0, 0.0];
    if (!this.contentWrapperVirtualElement) {
      return size;
    }
    let htmlElement = this.contentWrapperVirtualElement.getHTMLElement();
    if (!htmlElement) {
      return size;
    }
    size[0] = htmlElement.offsetWidth;
    size[1] = htmlElement.offsetHeight;
    return size;
  }

  updateXScrollBar() {
    if (!this.xScrollBar) {
      return;
    }
    if (this.parent.scrollBarsVisibilityPolicy == "never") {
      const htmlElement = this.xScrollBar?.trackVirtualElement?.getHTMLElement();
      if (htmlElement) {
        htmlElement.style.display = "none";
      }
      return;
    }
    if (this.xScrollBar.thumbSize < this.parent.scrollBarSize / 2) {
      if (this.xScrollBar.trackVirtualElement) {
        const htmlElement = this.xScrollBar.trackVirtualElement.getHTMLElement();
        if (htmlElement) {
          switch (this.parent.scrollBarsVisibilityPolicy) {
            case "always":
              htmlElement.style.display = "block";
              break;
            case "when-necessary":
              htmlElement.style.display = "none";
              break;
          }
        }
      }
      if (this.xScrollBar.thumbVirtualElement) {
        const htmlElement = this.xScrollBar.thumbVirtualElement.getHTMLElement();
        if (htmlElement) {
          htmlElement.style.display = "none";
        }
      }
      return;
    }
    let htmlElement;
    if (this.xScrollBar.trackVirtualElement) {
      htmlElement = this.xScrollBar.trackVirtualElement.getHTMLElement();
      if (htmlElement) {
        htmlElement.style.display = "block";
      }
    }
    this.xScrollBar.thumbXY = 0.0;
    if (this.viewportVirtualElement) {
      const htmlElement = this.viewportVirtualElement.getHTMLElement();
      if (!htmlElement) {
        return;
      }
      this.xScrollBar.thumbXY = htmlElement.scrollLeft * this.xScrollBar.trackSize / this.xScrollBar.contentWrapperSize;
      this.xScrollBar.thumbXY = Math.min(this.xScrollBar.trackSize - this.xScrollBar.thumbSize, this.xScrollBar.thumbXY);
    }
    if (this.xScrollBar.thumbVirtualElement) {
      htmlElement = this.xScrollBar.thumbVirtualElement.getHTMLElement();
      if (htmlElement) {
        htmlElement.style.display = "block";
        htmlElement.style.left = `${this.xScrollBar.thumbXY}px`;
        htmlElement.style.width = `${this.xScrollBar.thumbSize}px`;
      }
    }
  }

  updateYScrollBar() {
    if (!this.yScrollBar) {
      return;
    }
    if (this.parent.scrollBarsVisibilityPolicy == "never") {
      const htmlElement = this.yScrollBar?.trackVirtualElement?.getHTMLElement();
      if (htmlElement) {
        htmlElement.style.display = "none";
      }
      return;
    }
    if (this.yScrollBar.thumbSize < this.parent.scrollBarSize / 2) {
      if (this.yScrollBar.trackVirtualElement) {
        const htmlElement = this.yScrollBar.trackVirtualElement.getHTMLElement();
        if (htmlElement) {
          switch (this.parent.scrollBarsVisibilityPolicy) {
            case "always":
              htmlElement.style.display = "block";
              break;
            case "when-necessary":
              htmlElement.style.display = "none";
              break;
          }
        }
      }
      if (this.yScrollBar.thumbVirtualElement) {
        const htmlElement = this.yScrollBar.thumbVirtualElement.getHTMLElement();
        if (htmlElement) {
          htmlElement.style.display = "none";
        }
      }
      return;
    }
    let htmlElement;
    if (this.yScrollBar.trackVirtualElement) {
      htmlElement = this.yScrollBar.trackVirtualElement.getHTMLElement();
      if (htmlElement) {
        htmlElement.style.display = "block";
      }
    }
    this.yScrollBar.thumbXY = 0.0;
    if (this.viewportVirtualElement) {
      const htmlElement = this.viewportVirtualElement.getHTMLElement();
      if (!htmlElement) {
        return;
      }
      this.yScrollBar.thumbXY = htmlElement.scrollTop * this.yScrollBar.trackSize / this.yScrollBar.contentWrapperSize;
      this.yScrollBar.thumbXY = Math.min(this.yScrollBar.trackSize - this.yScrollBar.thumbSize, this.yScrollBar.thumbXY);
    }
    if (this.yScrollBar.thumbVirtualElement) {
      htmlElement = this.yScrollBar.thumbVirtualElement.getHTMLElement();
      if (htmlElement) {
        htmlElement.style.display = "block";
        htmlElement.style.top = `${this.yScrollBar.thumbXY}px`;
        htmlElement.style.height = `${this.yScrollBar.thumbSize}px`;
      }
    }
  }

  handleScroll = (event: any) => {
    this.updateXScrollBar();
    this.updateYScrollBar();
  };

  //  x scroll bar

  handleXScrollBarPointerDown = (event: any) => {
    if (!this.xScrollBar) {
      return;
    }
    const {trackHTMLElement, thumbHTMLElement} = this.getPointedHTMLElements(this.xScrollBar, event);
    if (trackHTMLElement) {
      const rect0 = trackHTMLElement.getBoundingClientRect();
      const {clientY} = event;
      event.preventDefault();
      event.stopPropagation();
      // TODO
      return;
    }
    if (!thumbHTMLElement) {
      return;
    }
    if (this.viewportVirtualElement) {
      if (!this.viewportVirtualElement.getHTMLElement()) {
        return;
      }
      this.xScrollBar.pointedThumbXY = this.xScrollBar.thumbXY;
    }
    event.preventDefault();
    event.stopPropagation();
    this.xScrollBar.thumbHTMLElement = thumbHTMLElement;
    this.xScrollBar.clientXY = event.clientX;
    this.xScrollBar.pointerId = event.pointerId;
    //this.yScrollBar.thumbHTMLElement.addEventListener("pointermove", this.handleYScrollBarPointerMove);
    this.xScrollBar.thumbHTMLElement.setPointerCapture(this.xScrollBar.pointerId);
  };

  handleXScrollBarPointerMove = (event: any) => {
    if (!this.xScrollBar) {
      return;
    }
    if (!this.viewportVirtualElement) {
      return;
    }
    if (!this.xScrollBar.pointerId) {
      return;
    }
    const htmlElement = this.viewportVirtualElement.getHTMLElement();
    if (!htmlElement) {
      return;
    }
    // reverse math to updateScrollBar()
    let scrollLeft = (event.clientX - this.xScrollBar.clientXY);
    scrollLeft += this.xScrollBar.pointedThumbXY;
    scrollLeft = scrollLeft * this.xScrollBar.contentWrapperSize / this.xScrollBar.trackSize;
    scrollLeft = Math.max(scrollLeft, 0);
    scrollLeft = Math.min(this.xScrollBar.contentWrapperSize - this.xScrollBar.viewportSize, scrollLeft);
    htmlElement.scrollLeft = scrollLeft;
    this.updateXScrollBar();
  };

  handleXScrollBarPointerUp = (event: any) => {
    if (!this.xScrollBar) {
      return;
    }
    if (!this.xScrollBar.thumbHTMLElement) {
      return;
    }
    if (!this.xScrollBar.pointerId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.xScrollBar.thumbHTMLElement.releasePointerCapture(this.xScrollBar.pointerId);
    //this.yScrollBar.thumbHTMLElement.removeEventListener("pointermove", this.handleYScrollBarPointerMove);
    this.xScrollBar.thumbHTMLElement = null;
    this.xScrollBar.pointerId = null;
  };

  // y scroll bar

  handleYScrollBarPointerDown = (event: any) => {
    if (!this.yScrollBar) {
      return;
    }
    const {trackHTMLElement, thumbHTMLElement} = this.getPointedHTMLElements(this.yScrollBar, event);
    if (trackHTMLElement) {
      const rect0 = trackHTMLElement.getBoundingClientRect();
      const {clientY} = event;
      event.preventDefault();
      event.stopPropagation();
      // TODO
      return;
    }
    if (!thumbHTMLElement) {
      return;
    }
    if (this.viewportVirtualElement) {
      if (!this.viewportVirtualElement.getHTMLElement()) {
        return;
      }
      this.yScrollBar.pointedThumbXY = this.yScrollBar.thumbXY;
    }
    event.preventDefault();
    event.stopPropagation();
    this.yScrollBar.thumbHTMLElement = thumbHTMLElement;
    this.yScrollBar.clientXY = event.clientY;
    this.yScrollBar.pointerId = event.pointerId;
    //this.yScrollBar.thumbHTMLElement.addEventListener("pointermove", this.handleYScrollBarPointerMove);
    this.yScrollBar.thumbHTMLElement.setPointerCapture(this.yScrollBar.pointerId);
  };

  handleYScrollBarPointerMove = (event: any) => {
    if (!this.yScrollBar) {
      return;
    }
    if (!this.viewportVirtualElement) {
      return;
    }
    if (!this.yScrollBar.pointerId) {
      return;
    }
    const htmlElement = this.viewportVirtualElement.getHTMLElement();
    if (!htmlElement) {
      return;
    }
    // reverse math to updateScrollBar()
    let scrollTop = (event.clientY - this.yScrollBar.clientXY);
    scrollTop += this.yScrollBar.pointedThumbXY;
    scrollTop = scrollTop * this.yScrollBar.contentWrapperSize / this.yScrollBar.trackSize;
    scrollTop = Math.max(scrollTop, 0);
    scrollTop = Math.min(this.yScrollBar.contentWrapperSize - this.yScrollBar.viewportSize, scrollTop);
    htmlElement.scrollTop = scrollTop;
    this.updateYScrollBar();
  };

  handleYScrollBarPointerUp = (event: any) => {
    if (!this.yScrollBar) {
      return;
    }
    if (!this.yScrollBar.thumbHTMLElement) {
      return;
    }
    if (!this.yScrollBar.pointerId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.yScrollBar.thumbHTMLElement.releasePointerCapture(this.yScrollBar.pointerId);
    //this.yScrollBar.thumbHTMLElement.removeEventListener("pointermove", this.handleYScrollBarPointerMove);
    this.yScrollBar.thumbHTMLElement = null;
    this.yScrollBar.pointerId = null;
  };

  getPointedHTMLElements(scrollBar: ScrollBar, event: any) {
    if (scrollBar.thumbSize < this.parent.scrollBarSize / 2) {
      // no thumb
      return {
        trackHTMLElement: undefined,
        thumbHTMLElement: undefined
      };
    }
    if (!scrollBar.trackVirtualElement) {
      return {
        trackHTMLElement: undefined,
        thumbHTMLElement: undefined
      };
    }
    let trackHTMLElement = scrollBar.trackVirtualElement.getHTMLElement();
    if (!trackHTMLElement) {
      return {
        trackHTMLElement: undefined,
        thumbHTMLElement: undefined
      };
    }
    if (event) {
      if (event.target === trackHTMLElement) {
        return {
          trackHTMLElement: trackHTMLElement,
          thumbHTMLElement: undefined
        };
      }
    }
    if (!scrollBar.thumbVirtualElement) {
      return {
        trackHTMLElement: undefined,
        thumbHTMLElement: undefined
      };
    }
    let thumbHTMLElement = scrollBar.thumbVirtualElement.getHTMLElement();
    if (!thumbHTMLElement) {
      return {
        trackHTMLElement: undefined,
        thumbHTMLElement: undefined
      };
    }
    if (event.target !== thumbHTMLElement) {
      return {
        trackHTMLElement: undefined,
        thumbHTMLElement: undefined
      };
    }
    return {
      trackHTMLElement: undefined,
      thumbHTMLElement: thumbHTMLElement
    }
  }
}

export default ScrollBars;
