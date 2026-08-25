/* eslint-disable no-new */
import Accordion from "./components/accordion/accordion.mjs";
import Breadcrumbs from "./components/breadcrumbs/breadcrumbs.mjs";
import CodeBlock from "./components/code-block/code-block.mjs";
import CookieBanner from "./components/cookie-banner/cookie-banner.mjs";
import DateInputProgressive from "./components/date-input/date-input.mjs";
import ErrorSummary from "./components/error-summary/error-summary.mjs";
import FileInputDroppable from "./components/file-input/file-input.mjs";
import Footer from "./components/footer/footer.mjs";
import Gallery from "./components/gallery/gallery.mjs";
import GlobalHeader from "./components/global-header/global-header.mjs";
import Header from "./components/header/header.mjs";
import Picture from "./components/picture/picture.mjs";
import Sidebar from "./components/sidebar/sidebar.mjs";
import SkipLink from "./components/skip-link/skip-link.mjs";
import Tabs from "./components/tabs/tabs.mjs";
import TextInputPassword from "./components/text-input/text-input.mjs";
import TextAreaItemisedRows from "./components/textarea/textarea.mjs";
import { checkTableForScroll, updateTimeElement } from "./lib/helpers.mjs";

const scopeFromOptions = (options = {}) => {
  const { scope } = options;
  if (!scope) {
    return document;
  }
  if (!(scope instanceof HTMLElement)) {
    throw new Error("Scope must be an HTMLElement");
  }
  return scope;
};

const initSingleComponentInstance = (Module, moduleName, options) => {
  const $scope = scopeFromOptions(options);
  const dataModuleName = `tna-${moduleName.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
  const $el = $scope.querySelector(`[data-module="${dataModuleName}"]`);
  if ($el) {
    new Module($el);
  }
};

const initAllComponentInstances = (Module, moduleName, options) => {
  const $scope = scopeFromOptions(options);
  const dataModuleName = `tna-${moduleName.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
  $scope
    .querySelectorAll(`[data-module="${dataModuleName}"]`)
    .forEach(($el) => {
      new Module($el);
    });
};

const initAccordion = (options) =>
  initAllComponentInstances(Accordion, "tna-accordion", options);
const initBreadcrumbs = (options) =>
  initSingleComponentInstance(Breadcrumbs, "tna-breadcrumbs", options);
const initCodeBlock = (options) =>
  initAllComponentInstances(CodeBlock, "tna-code-block", options);
const initCookieBanner = (options) =>
  initSingleComponentInstance(CookieBanner, "tna-cookie-banner", options);
const initDateInputProgressive = (options) =>
  initAllComponentInstances(
    DateInputProgressive,
    "tna-date-input-progressive",
    options,
  );
const initErrorSummary = (options) =>
  initSingleComponentInstance(ErrorSummary, "tna-error-summary", options);
const initFileInputDroppable = (options) =>
  initAllComponentInstances(FileInputDroppable, "tna-file-input", options);
const initFooter = (options) =>
  initSingleComponentInstance(Footer, "tna-footer", options);
const initGallery = (options) =>
  initAllComponentInstances(Gallery, "tna-gallery", options);
const initGlobalHeader = (options) =>
  initSingleComponentInstance(GlobalHeader, "tna-global-header", options);
const initHeader = (options) =>
  initSingleComponentInstance(Header, "tna-header", options);
const initPicture = (options) =>
  initAllComponentInstances(Picture, "tna-picture", options);
const initSidebar = (options) => {
  const $scope = scopeFromOptions(options);
  const $sidebar = $scope.querySelector('[data-module="tna-sidebar-sections"]');
  if ($sidebar) {
    const { scrollTopThreshold, disableHighlightSize } = $sidebar.dataset;
    new Sidebar($sidebar, { scrollTopThreshold, disableHighlightSize });
  }
};
const initSkipLink = (options) =>
  initAllComponentInstances(SkipLink, "tna-skip-link", options);
const initTabs = (options) =>
  initAllComponentInstances(Tabs, "tna-tabs", options);
const initTextAreaItemisedRows = (options) => {
  const $scope = scopeFromOptions(options);
  $scope
    .querySelectorAll('[data-module="tna-textarea-itemised-rows"]')
    .forEach(($textAreaWithItemisedRows) => {
      const { enhancedHint } = $textAreaWithItemisedRows.dataset;
      new TextAreaItemisedRows($textAreaWithItemisedRows, { enhancedHint });
    });
};
const initTextInputPassword = (options) =>
  initAllComponentInstances(
    TextInputPassword,
    "tna-text-input-password",
    options,
  );

const preInit = (options) => {
  const $scope = scopeFromOptions(options);

  const $html = document.documentElement;
  $html.classList.add("tna-template--js-enabled");

  const onFirstTouch = () => {
    window.removeEventListener("touchstart", onFirstTouch);
    $html.classList.add("tna-template--touched");
  };
  window.addEventListener("touchstart", onFirstTouch);

  const onKeyDown = (event) => {
    if (event.key === "Tab") {
      $html.classList.add("tna-template--tabbed");
      $html.classList.remove("tna-template--clicked");
    }
  };
  window.addEventListener("keydown", onKeyDown);

  const onMouseDown = () => {
    $html.classList.add("tna-template--clicked");
    $html.classList.remove("tna-template--tabbed");
  };
  window.addEventListener("mousedown", onMouseDown);

  /*
   * ==========================================
   * Checks if widths of all tables on the page
   * are wider than their parent container, and
   * allowing horizontal scrolling if they are.
   * This is done both on load and on resize.
   * ==========================================
   */
  const $tableWrappers = $scope.querySelectorAll(".tna-table-wrapper");
  $tableWrappers.forEach(($tableWrapper) => checkTableForScroll($tableWrapper));
  window.addEventListener("resize", () => {
    $tableWrappers.forEach(($tableWrapper) =>
      checkTableForScroll($tableWrapper),
    );
  });

  // Remove this opt-in class in a later release
  if ($html.classList.contains("tna-template--enhance-time-elements")) {
    document.querySelectorAll("time[datetime]").forEach(updateTimeElement);
  }
};

const postInit = (options) => {
  const $scope = scopeFromOptions(options);

  window.matchMedia("print").addEventListener("change", (evt) => {
    if (evt.matches) {
      $scope
        .querySelectorAll(".tna-details__details:not([open])")
        .forEach(($element) => {
          $element.setAttribute("open", "");
          $element.dataset.wasClosed = "";
        });
      $scope
        .querySelectorAll(
          ".tna-accordion__content[hidden], .tna-picture__transcript[hidden]",
        )
        .forEach(($element) => {
          $element.removeAttribute("hidden");
          $element.dataset.wasClosed = "";
        });
    } else {
      $scope
        .querySelectorAll(".tna-details__details[data-was-closed]")
        .forEach(($element) => {
          $element.removeAttribute("open");
          delete $element.dataset.wasClosed;
        });
      $scope
        .querySelectorAll(
          ".tna-accordion__content[data-was-closed], .tna-picture__transcript[data-was-closed]",
        )
        .forEach(($element) => {
          $element.setAttribute("hidden", "");
          $element.dataset.wasClosed = "";
        });
    }
  });
};

const initAll = (options) => {
  preInit(options);

  initAccordion(options);
  initBreadcrumbs(options);
  initCodeBlock(options);
  initCookieBanner(options);
  initDateInputProgressive(options);
  initErrorSummary(options);
  initFileInputDroppable(options);
  initFooter(options);
  initGallery(options);
  initGlobalHeader(options);
  initHeader(options);
  initPicture(options);
  initSidebar(options);
  initSkipLink(options);
  initTabs(options);
  initTextAreaItemisedRows(options);
  initTextInputPassword(options);

  postInit(options);
};

const TNAFrontend = {
  initAll,
  Accordion,
  Breadcrumbs,
  CodeBlock,
  CookieBanner,
  DateInputProgressive,
  ErrorSummary,
  FileInputDroppable,
  Footer,
  Gallery,
  GlobalHeader,
  Header,
  Picture,
  Sidebar,
  SkipLink,
  Tabs,
  TextInputPassword,
  TextAreaItemisedRows,
  initAccordion,
  initBreadcrumbs,
  initCodeBlock,
  initCookieBanner,
  initDateInputProgressive,
  initErrorSummary,
  initFileInputDroppable,
  initFooter,
  initGallery,
  initGlobalHeader,
  initHeader,
  initPicture,
  initSidebar,
  initSkipLink,
  initTabs,
  initTextAreaItemisedRows,
  initTextInputPassword,
  preInit,
  postInit,
  checkTableForScroll,
  updateTimeElement,
};

export default TNAFrontend;

export {
  preInit,
  postInit,
  initAll,
  Accordion,
  initAccordion,
  Breadcrumbs,
  initBreadcrumbs,
  CodeBlock,
  initCodeBlock,
  CookieBanner,
  initCookieBanner,
  DateInputProgressive,
  initDateInputProgressive,
  ErrorSummary,
  initErrorSummary,
  FileInputDroppable,
  initFileInputDroppable,
  Footer,
  initFooter,
  Gallery,
  initGallery,
  GlobalHeader,
  initGlobalHeader,
  Header,
  initHeader,
  Picture,
  initPicture,
  Sidebar,
  initSidebar,
  SkipLink,
  initSkipLink,
  Tabs,
  initTabs,
  TextInputPassword,
  initTextAreaItemisedRows,
  TextAreaItemisedRows,
  initTextInputPassword,
};
