import Component from "../component";

class Store {
  protected state: any;
  storeObserverDescriptors: StoreObserverDescriptor[] = [];

  constructor() {
    stores.push(this);
  }

  startObservingKeys(component: Component, keys: string[]) {
    let freeStoreObserverDescriptor: StoreObserverDescriptor | null = null;
    for (let i0 = 0; i0 < keys.length; i0++) {
      for (let i1 = 0; i1 < this.storeObserverDescriptors.length; i1++) {
        if (!this.storeObserverDescriptors[i1].component) {
          freeStoreObserverDescriptor = this.storeObserverDescriptors[i1];
          continue;
        }
        if ((this.storeObserverDescriptors[i1].component as any)["key"] !== (component as any)["key"]) {
          continue;
        }
        if (this.storeObserverDescriptors[i1].key !== keys[i0]) {
          continue;
        }
        // registered already
        break;
      }
      if (freeStoreObserverDescriptor) {
        freeStoreObserverDescriptor.component = component;
        freeStoreObserverDescriptor.key = keys[i0];
      } else {
        this.storeObserverDescriptors.push(new StoreObserverDescriptor(component, keys[i0]));
      }
    }
    return component;
  }

  stopObservingKey(component: Component, key: string) {
    this.storeObserverDescriptors.forEach((storeObserverDescriptor: StoreObserverDescriptor) => {
      if (!storeObserverDescriptor.component) {
        // free descriptor
        return;
      }
      if ((storeObserverDescriptor.component as any)["key"] !== (component as any)["key"]) {
        return;
      }
      if (storeObserverDescriptor.key !== key) {
        return;
      }
      // detach observer and store descriptor for future use
      storeObserverDescriptor.component = null;
    });
  }

  removeObserver(component: Component) {
    let i = 0;
    while (i < this.storeObserverDescriptors.length) {
      if ((this.storeObserverDescriptors[i].component as any)["key"] !== (component as any)["key"]) {
        i++;
        continue;
      }
      // detach observer and store descriptor for future use
      this.storeObserverDescriptors[i].component = null;
    }
  }

  getState() {
    return this.state;
  }

  cloneState() {
    return Object.assign({}, this.state);
  }

  setState(state: any, affectedKeys?: string[]) {
    if (!affectedKeys) {
      // collect affected keys
      affectedKeys = [];
      this.storeObserverDescriptors.forEach((storeObserverDescriptor: StoreObserverDescriptor) => {
        if (!storeObserverDescriptor.component) {
          return;
        }
        if (!storeObserverDescriptor.key) {
          return;
        }
        if (affectedKeys!.includes(storeObserverDescriptor.key)) {
          return;
        }
        affectedKeys!.push(storeObserverDescriptor.key);
      });
    }
    for (let i = 0; i < affectedKeys.length; i++) {
      affectedKeys[i] = affectedKeys[i] + ".";
    }
    this.storeObserverDescriptors.forEach((storeObserverDescriptor: StoreObserverDescriptor) => {
      if (!storeObserverDescriptor.component) {
        return;
      }
      affectedKeys!.forEach((key: string) => {
        if (key.indexOf(storeObserverDescriptor.key + ".") === 0) {
          storeObserverDescriptor.needsUpdate = true;
        }
      });
    });
    this.state = state;
    this.forceUpdate();
  }

  forceUpdate() {
    for (let i = 0; i < this.storeObserverDescriptors.length; i++) {
      if (!this.storeObserverDescriptors[i].component) {
        continue;
      }
      if (this.storeObserverDescriptors[i].needsUpdate) {
        this.storeObserverDescriptors[i].needsUpdate = false;
        const component = this.storeObserverDescriptors[i].component;
        if (component) {
          component.onObservedStorePathChanged(this.storeObserverDescriptors[i].key);
        }
      }
    }
  }
}

// StoreObserverDescriptor

class StoreObserverDescriptor {
  component: Component | null;
  key: string;
  needsUpdate: boolean = false;

  constructor(component: Component, key: string) {
    this.component = component;
    this.key = key;
  }
}

const stores: Store[] = [];

export {
  Store,
  StoreObserverDescriptor,
  stores
}
