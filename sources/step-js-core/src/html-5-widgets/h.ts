import Widget from "../widget";

class H extends Widget {

  constructor(type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6", innerText?: string, ...params: any) {
    super(type, ...params);
    if (innerText) {
      this.setInnerText(innerText);
    }
  }
}

// H1

class H1 extends H {

  constructor(innerText?: string, ...params: any) {
    super("h1", innerText, ...params);
  }
}

// H2

class H2 extends H {

  constructor(innerText?: string, ...params: any) {
    super("h2", innerText, ...params);
  }
}

// H3

class H3 extends H {

  constructor(innerText?: string, ...params: any) {
    super("h3", innerText, ...params);
  }
}

// H4

class H4 extends H {

  constructor(innerText?: string, ...params: any) {
    super("h4", innerText, ...params);
  }
}

// H5

class H5 extends H {

  constructor(innerText?: string, ...params: any) {
    super("h5", innerText, ...params);
  }
}

// H6

class H6 extends H {

  constructor(innerText?: string, ...params: any) {
    super("h6", innerText, ...params);
  }
}

export {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6
};
