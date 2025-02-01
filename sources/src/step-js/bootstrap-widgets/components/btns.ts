import {
  BUTTON
} from "@step-js-core/index";

class Btn extends BUTTON {

  constructor(type: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link", text: string | undefined, ...params: any) {
    super(...params);
    this.addClassNames(`btn btn-${type} step-js-select-none`);
    if (text) {
      this.setInnerText(text);
    }
  }
}

// BtnPrimary

class BtnPrimary extends Btn {

  constructor(text: string | undefined, ...params: any) {
    super("primary", text, ...params);
  }
}

// BtnSecondary

class BtnSecondary extends Btn {

  constructor(text: string | undefined, ...params: any) {
    super("secondary", text, ...params);
  }
}

// BtnSuccess

class BtnSuccess extends Btn {

  constructor(text: string | undefined, ...params: any) {
    super("success", text, ...params);
  }
}

// BtnDanger

class BtnDanger extends Btn {

  constructor(text: string | undefined, ...params: any) {
    super("danger", text, ...params);
  }
}

// BtnWarning

class BtnWarning extends Btn {

  constructor(text: string | undefined, ...params: any) {
    super("warning", text, ...params);
  }
}

// BtnInfo

class BtnInfo extends Btn {

  constructor(text: string | undefined, ...params: any) {
    super("info", text, ...params);
  }
}

// BtnLight

class BtnLight extends Btn {

  constructor(text: string | undefined, ...params: any) {
    super("light", text, ...params);
  }
}

// BtnDark

class BtnDark extends Btn {

  constructor(text: string, ...params: any) {
    super("dark", text, ...params);
  }
}

// BtnLink

class BtnLink extends Btn {

  constructor(text: string | undefined, ...params: any) {
    super("link", text, ...params);
  }
}

export {
  Btn,
  BtnPrimary,
  BtnSecondary,
  BtnSuccess,
  BtnDanger,
  BtnWarning,
  BtnInfo,
  BtnLight,
  BtnDark,
  BtnLink,
};
