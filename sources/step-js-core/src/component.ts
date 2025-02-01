import Utils from "./utils";
import VirtualElement from "./virtual-element";
import {
  Store,
  stores,
  StoreObserverDescriptor
} from "./store/store";
import Browser from "./browser";

// Component

class Component {
  readonly key: string;

  props: any;
  attributes?: Object;
  dataAttributes?: Object;
  state: any;
  observedKeys: ObservedKey[] = [];
  disabled: boolean = false;

  // need for jsx

  refs: any;
  context: any;

  virtualElement: VirtualElement | null = null;

  constructor(props?: any) {
    this.key = this.getKeyPrefix() + "_" + Utils.getNextKey().toString();
    this.props = props || {};

    this.callComponentWillMount();
  }

  getKeyPrefix() {
    return this.constructor.name.toLowerCase();
  }

  callComponentWillMount() {
    this.componentWillMount();
  }

  componentWillMount() {
  }

  destroy() {
    this.virtualElement = null;
    this.observedKeys = [];
  }

  setAttribute(name: string, value?: string) {
    if (!this.attributes) {
      this.attributes = {};
    }
    this.attributes[name] = value;
    this.getHTMLElement()?.setAttribute(name, value ? value : "");
  }

  getAttributeValue(name: string) {
    return this.attributes?.[name];
  }

  setDataAttribute(name: string, value: string) {
    if (!this.dataAttributes) {
      this.dataAttributes = {};
    }
    this.dataAttributes[name] = value;
    this.getHTMLElement()?.setAttribute(`data-${name}`, value);
  }

  getDataAttributeValue(name: string) {
    return this.dataAttributes?.[name];
  }

  getState() {
    return this.state;
  }

  cloneState() {
    return Object.assign({}, this.state);
  }

  setState(state: any) {
    this.state = state;
    this.forceUpdate();
  }

  createVirtualElement() {
    const renderResult = this.render();
    if (Array.isArray(renderResult)) {
      // map
      this.virtualElement = new VirtualElement(undefined, "");
      renderResult.forEach((virtualElement: VirtualElement) => {
        this.virtualElement?.addChild(virtualElement);
      });
    } else {
      this.virtualElement = renderResult;
      if (this.virtualElement) {
        this.virtualElement.constructedBy = this;
        this.virtualElement.key = this.key;
      }
    }
    return this.virtualElement;
  }

  attachToDOM() {
  }

  render(): any {
    return new VirtualElement(this, "div");
  }

  callComponentDidMount() {
    // restore observers if any
    this.mountObservedShelves();
    this.componentDidMount();
  }

  mountObservedShelves() {
    if (this.observedKeys) {
      this.observedKeys.forEach((observedKey: ObservedKey) => {
        observedKey.store.startObservingKeys(this, [observedKey.key]);
      })
    }
  }

  componentDidMount() {
  }

  getHTMLElement() {
    if (this.virtualElement) {
      return this.virtualElement.getHTMLElement() as HTMLElement;
    }
    return null;
  }

  onObservedStorePathChanged(path: string) {
    this.forceUpdate();
  }

  forceUpdate() {
    if (this.virtualElement) {
      Browser.smudgeVirtualElement(this.virtualElement);
    }
  }

  callComponentWillUnmount() {
    this.componentWillUnmount();
    // store observers if any
    this.unmountObservedShelves();
  }

  unmountObservedShelves() {
    let observedKeys: ObservedKey[] = [];
    stores.forEach((store: Store) => {
      store.storeObserverDescriptors.forEach((storeObserverDescriptor: StoreObserverDescriptor) => {
        if (!storeObserverDescriptor.component) {
          return;
        }
        if ((storeObserverDescriptor.component as any)["key"] !== this.key) {
          return;
        }
        observedKeys.push(new ObservedKey(store, storeObserverDescriptor.key));
        // detach from observed device controls
        storeObserverDescriptor.component = null;
      });
    });
    this.observedKeys = observedKeys;
  }

  componentWillUnmount() {
  }

  detachFromDOM() {
  }
}

// Observed Key

class ObservedKey {
  store: Store;
  key: string;

  constructor(store: Store, key: string) {
    this.store = store;
    this.key = key;
  }
}

export default Component;
