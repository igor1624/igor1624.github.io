import Utils from "../utils";
import Widget from "../widget";

class Router extends Widget {
  static instance: Router;

  constructor(...params: any) {
    super("div", ...params);
    Router.instance = this;

    window.addEventListener("navigate", () => {
      this.handleWindowLocationChange();
    });

    window.addEventListener("popstate", () => {
      this.handleWindowLocationChange();
    });

    const handleResizeEvent = (event: any) => {
      this.handleResizeEvent(event);
    };
    window.addEventListener("resize", Utils.debounce(handleResizeEvent, 500));

    this.setState({
      pathname: window.location.pathname,
      search: window.location.search,
    });
  }

  static navigateTo(event: any, href: string) {
    if (!Router.instance) {
      return;
    }
    if (event) {
      // stop handling
      event.preventDefault();
    }
    if ((!href) || (href === "#")) {
      return;
    }
    if ((window.location.pathname + window.location.search) !== href) {
      // do change
      window.history.pushState({}, "", href);
      const navigatorEvent = new PopStateEvent("navigate");
      window.dispatchEvent(navigatorEvent);
    }
  };

  handleWindowLocationChange() {
    this.setState({
      pathname: window.location.pathname,
      search: window.location.search,
    });
  }

  handleResizeEvent(event: any) {
  }
}

namespace Router {

  export class Link extends Widget {

    constructor(href: string | undefined, ...params: any) {
      super("a", ...params);
      this.props.href = href ? href : "";
    }

    onClick = (event: any) => {
      if (this.props.href !== "") {
        Router.navigateTo(event, this.props.href);
      }
    }
  }
}

export default Router;
