import {
  VirtualElement,
  DIV,
} from "@step-js-core/index";
import "./sidebars.scss";

class Sidebar extends DIV {
  side: "left" | "right";
  breakpoint: "sm" | "md" | "lg";
  panelWrapperVirtualElement?: VirtualElement;
  contentWrapperVirtualElement?: VirtualElement;
  contentCoverVirtualElement?: VirtualElement;

  constructor(side: "left" | "right", breakpoint: "sm" | "md" | "lg", ...params: any) {
    super(...params);
    this.addClassNames(`step-js-sidebar step-js-sidebar-${side}-${breakpoint}`);
    this.setPanelWidth("15rem");
    this.setClosedPanelWidth("3rem");
    this.side = side;
    this.breakpoint = breakpoint
  }

  setPanelWidth(width: string) {
    this.setStyleRule("--step-js-sidebar-panel-width", width);
  }

  setClosedPanelWidth(width: string) {
    this.setStyleRule("--step-js-sidebar-closed-panel-width", width);
  }

  addVirtualElementsTo(parentVirtualElement: VirtualElement) {
    this.panelWrapperVirtualElement = new VirtualElement(null, "div", {
      className: "step-js-sidebar-panel-wrapper"
    });
    this.contentWrapperVirtualElement = new VirtualElement(null, "div", {
      className: "step-js-sidebar-content-wrapper"
    });
    this.contentCoverVirtualElement = new VirtualElement(null, "div", {
      className: "step-js-sidebar-content-cover"
    });
    if (this.side === "left") {
      parentVirtualElement.addChild(this.contentWrapperVirtualElement);
      if (this.getChildren().length > 1) {
        this.contentWrapperVirtualElement.addChild(this.getChildren()[1].createVirtualElement());
      }
      this.contentWrapperVirtualElement.addChild(this.contentCoverVirtualElement);
      parentVirtualElement.addChild(this.panelWrapperVirtualElement);
      if (this.getChildren().length > 0) {
        this.panelWrapperVirtualElement.addChild(this.getChildren()[0].createVirtualElement());
      }
    } else {
      parentVirtualElement.addChild(this.contentWrapperVirtualElement);
      if (this.getChildren().length > 0) {
        this.contentWrapperVirtualElement.addChild(this.getChildren()[0].createVirtualElement());
      }
      this.contentWrapperVirtualElement.addChild(this.contentCoverVirtualElement);
      parentVirtualElement.addChild(this.panelWrapperVirtualElement);
      if (this.getChildren().length > 1) {
        this.panelWrapperVirtualElement.addChild(this.getChildren()[1].createVirtualElement());
      }
    }
    this.contentCoverVirtualElement.props.onClick = () => {
      this.togglePanel();
    }
  }

  togglePanel() {
    // open / close panel
    this.toggleClassName("--panel-closed");
  }

  closeIfNecessary() {
    // close if overlaps
    if (this.hasClassName("--panel-closed")) {
      return;
    }
    this.togglePanel();
  }
}

class LeftSidebarSM extends Sidebar {

  constructor(...params: any) {
    super("left", "sm", ...params);
  }
}

class LeftSidebarMD extends Sidebar {

  constructor(...params: any) {
    super("left", "md", ...params);
  }
}

class LeftSidebarLG extends Sidebar {

  constructor(...params: any) {
    super("left", "lg", ...params);
  }
}

class RightSidebarSM extends Sidebar {

  constructor(...params: any) {
    super("right", "sm", ...params);
  }
}

class RightSidebarMD extends Sidebar {

  constructor(...params: any) {
    super("right", "md", ...params);
  }
}

class RightSidebarLG extends Sidebar {

  constructor(...params: any) {
    super("right", "lg", ...params);
  }
}

export {
  Sidebar,
  LeftSidebarSM,
  LeftSidebarMD,
  LeftSidebarLG,
  RightSidebarSM,
  RightSidebarMD,
  RightSidebarLG
}
