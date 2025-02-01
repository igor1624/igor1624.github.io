import "./style.scss";

// engine

import Utils from "./utils";
import Browser from "./browser";
import VirtualElement from "./virtual-element";
import Component from "./component";
import Widget from "./widget";
import Router from "./router/router";
import {
  Store,
  stores
} from "./store/store";
import Network from "./network/network";
import StyleRuleAnimations from "./animations/style-rule-animations";

export {
  Utils,
  Browser,
  VirtualElement,
  Component,
  Widget,
  Router,
  Store,
  stores,
  Network,
  StyleRuleAnimations,
}

// html-5

import A from "./html-5-widgets/a";
import ABBR from "./html-5-widgets/abbr";
import ADDRESS from "./html-5-widgets/address";
import AREA from "./html-5-widgets/area";
import ARTICLE from "./html-5-widgets/article";
import ASIDE from "./html-5-widgets/aside";
import AUDIO from "./html-5-widgets/audio";
import B from "./html-5-widgets/b";
import BASE from "./html-5-widgets/base";
import BDI from "./html-5-widgets/bdi";
import BDO from "./html-5-widgets/bdo";
import BLOCKQUOTE from "./html-5-widgets/blockquote";
import BUTTON from "./html-5-widgets/button";
import CANVAS from "./html-5-widgets/canvas";
import CAPTION from "./html-5-widgets/caption";
import CITE from "./html-5-widgets/cite";
import CODE from "./html-5-widgets/code";
import COL from "./html-5-widgets/col";
import COLGROUP from "./html-5-widgets/colgroup";
import DATA from "./html-5-widgets/data";
import DATALIST from "./html-5-widgets/datalist";
import DD from "./html-5-widgets/dd";
import DEL from "./html-5-widgets/del";
import DETAILS from "./html-5-widgets/details";
import DFN from "./html-5-widgets/dfn";
import DIALOG from "./html-5-widgets/dialog";
import DIV from "./html-5-widgets/div";
import DL from "./html-5-widgets/dl";
import DT from "./html-5-widgets/dt";
import EM from "./html-5-widgets/em";
import EMBED from "./html-5-widgets/embed";
import FIELDSET from "./html-5-widgets/fieldset";
import FIGCAPTION from "./html-5-widgets/figcaption";
import FIGURE from "./html-5-widgets/figure";
import FOOTER from "./html-5-widgets/footer";
import FORM from "./html-5-widgets/form";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6
} from "./html-5-widgets/h";
import HEAD from "./html-5-widgets/head";
import HEADER from "./html-5-widgets/header";
import HGROUP from "./html-5-widgets/hgroup";
import HR from "./html-5-widgets/hr";
import I from "./html-5-widgets/i";
import IFRAME from "./html-5-widgets/iframe";
import IMG from "./html-5-widgets/img";
import INPUT from "./html-5-widgets/input";
import INS from "./html-5-widgets/ins";
import KBD from "./html-5-widgets/kbd";
import KEYGEN from "./html-5-widgets/keygen";
import LABEL from "./html-5-widgets/label";
import LEGEND from "./html-5-widgets/legend";
import LI from "./html-5-widgets/li";
import LINK from "./html-5-widgets/link";
import MAIN from "./html-5-widgets/main";
import MAP from "./html-5-widgets/map";
import MARK from "./html-5-widgets/mark";
import MENU from "./html-5-widgets/menu";
import MENUITEM from "./html-5-widgets/menuitem";
import META from "./html-5-widgets/meta";
import METER from "./html-5-widgets/meter";
import NAV from "./html-5-widgets/nav";
import NOSCRIPT from "./html-5-widgets/noscript";
import OBJECT from "./html-5-widgets/object";
import OL from "./html-5-widgets/ol";
import OPTGROUP from "./html-5-widgets/optgroup";
import OPTION from "./html-5-widgets/option";
import OUTPUT from "./html-5-widgets/output";
import P from "./html-5-widgets/p";
import PARAM from "./html-5-widgets/param";
import PICTURE from "./html-5-widgets/picture";
import PRE from "./html-5-widgets/pre";
import PROGRESS from "./html-5-widgets/progress";
import Q from "./html-5-widgets/q";
import SAMP from "./html-5-widgets/samp";
import SCRIPT from "./html-5-widgets/script";
import SECTION from "./html-5-widgets/section";
import SELECT from "./html-5-widgets/select";
import SMALL from "./html-5-widgets/small";
import SOURCE from "./html-5-widgets/source";
import SPAN from "./html-5-widgets/span";
import STRONG from "./html-5-widgets/strong";
import SUB from "./html-5-widgets/sub";
import SUMMARY from "./html-5-widgets/summary";
import SUP from "./html-5-widgets/sup";
import SVG from "./html-5-widgets/svg";
import TABLE from "./html-5-widgets/table";
import TBODY from "./html-5-widgets/tbody";
import TD from "./html-5-widgets/td";
import TEMPLATE from "./html-5-widgets/template";
import TEXTAREA from "./html-5-widgets/textarea";
import TFOOT from "./html-5-widgets/tfoot";
import TH from "./html-5-widgets/th";
import THEAD from "./html-5-widgets/thead";
import TIME from "./html-5-widgets/time";
import TITLE from "./html-5-widgets/title";
import TR from "./html-5-widgets/tr";
import TRACK from "./html-5-widgets/track";
import U from "./html-5-widgets/u";
import UL from "./html-5-widgets/ul";
import VIDEO from "./html-5-widgets/video";
import WBR from "./html-5-widgets/wbr";

export {
  A,
  ABBR,
  ADDRESS,
  AREA,
  ARTICLE,
  ASIDE,
  AUDIO,
  B,
  BASE,
  BDI,
  BDO,
  BLOCKQUOTE,
  BUTTON,
  CANVAS,
  CAPTION,
  CITE,
  CODE,
  COL,
  COLGROUP,
  DATA,
  DATALIST,
  DD,
  DEL,
  DETAILS,
  DFN,
  DIALOG,
  DIV,
  DL,
  DT,
  EM,
  EMBED,
  FIELDSET,
  FIGCAPTION,
  FIGURE,
  FOOTER,
  FORM,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  HEAD,
  HEADER,
  HGROUP,
  HR,
  I,
  IFRAME,
  IMG,
  INPUT,
  INS,
  KBD,
  KEYGEN,
  LABEL,
  LEGEND,
  LI,
  LINK,
  MAIN,
  MAP,
  MARK,
  MENU,
  MENUITEM,
  META,
  METER,
  NAV,
  NOSCRIPT,
  OBJECT,
  OL,
  OPTGROUP,
  OPTION,
  OUTPUT,
  P,
  PARAM,
  PICTURE,
  PRE,
  PROGRESS,
  Q,
  SAMP,
  SCRIPT,
  SECTION,
  SELECT,
  SMALL,
  SOURCE,
  SPAN,
  STRONG,
  SUB,
  SUMMARY,
  SUP,
  SVG,
  TABLE,
  TBODY,
  TD,
  TEMPLATE,
  TEXTAREA,
  TFOOT,
  TH,
  THEAD,
  TIME,
  TITLE,
  TR,
  TRACK,
  U,
  UL,
  VIDEO,
  WBR,
}

// Ref

import Ref from "./ref";

// React

const React = {

  createElement: Browser.createVirtualElement,

  Component: Component,

  createRef: function() {
    return new Ref();
  }
};

export {
  React
}
