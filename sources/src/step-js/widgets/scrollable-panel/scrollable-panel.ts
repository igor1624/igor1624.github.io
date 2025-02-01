import {
  DIV
} from "@step-js-core/index";
import ScrollBars from "./scroll-bars";
import "./scrollable-panel.scss";

class ScrollablePanel extends DIV {
  scrollBars: ScrollBars;
  scrollBarSize = 8;
  scrollBarsVisibilityPolicy: "when-necessary" | "always" | "never" = "when-necessary";

  constructor(type: "x-scroll-bar" | "y-scroll-bar" | "xy-scroll-bars", ...params: any) {
    super(...params);
    this.addClassNames(`step-js-scrollable-panel -${type}`);
    this.setScrollBarSize(this.scrollBarSize);
    this.scrollBars = new ScrollBars(this, type);
  }

  setScrollBarSize(size: number) {
    this.scrollBarSize = size;
    this.setStyleRule("--step-js-scrollable-panel-scroll-bar-size", `${this.scrollBarSize}px`);
  }

  setScrollBarsVisibilityPolicy(visibilityPolicy: "when-necessary" | "always" | "never") {
    this.scrollBarsVisibilityPolicy = visibilityPolicy;
  }

  createVirtualElement() {
    if (this.scrollBars) {
      return this.scrollBars.createVirtualElementForParent();
    }
    return super.createVirtualElement();
  }

  adjustLayout() {
    if (this.scrollBars) {
      this.scrollBars.adjustScrollBars();
    }
  }
}

// XScrollablePanel

class XScrollablePanel extends ScrollablePanel {

  constructor(...params: any) {
    super("x-scroll-bar", ...params);
  }
}

// YScrollablePanel

class YScrollablePanel extends ScrollablePanel {

  constructor(...params: any) {
    super("y-scroll-bar", ...params);
  }
}

// XYScrollablePanel

class XYScrollablePanel extends ScrollablePanel {

  constructor(...params: any) {
    super("xy-scroll-bars", ...params);
  }
}

export {
  ScrollablePanel,
  XScrollablePanel,
  YScrollablePanel,
  XYScrollablePanel,
};
