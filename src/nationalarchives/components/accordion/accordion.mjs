import { checkTableForScroll } from "../../lib/helpers.mjs";

export default class Accordion {
  constructor($module) {
    this.$module = $module;
    this.$items = $module && $module.querySelectorAll(".tna-accordion__item");
    if (!this.$module || !this.$items) {
      return;
    }

    this.allowMultipleItemsOpen =
      this.$module.dataset.singleOpenItem !== "true";

    this.$items.forEach(($item) => this.initItem_($item));
    this.initState_();

    this.$toggleAllButton = this.$module.querySelector(
      ".tna-accordion__toggle-all",
    );
    if (this.$toggleAllButton) {
      this.syncToggleAllButton_();
      this.$toggleAllButton.removeAttribute("hidden");
      this.$toggleAllButton.addEventListener("click", () => {
        if (this.isAllOpen()) {
          this.$items.forEach(($item) => this.closeItem($item));
        } else {
          this.$items.forEach(($item) => this.openItem($item));
        }
        this.syncToggleAllButton_();
      });
    }
  }

  initItem_($item) {
    const $heading = $item.querySelector(".tna-accordion__heading");
    const $content = $item.querySelector(".tna-accordion__body");

    if (!$heading || !$content) {
      return;
    }

    $item.classList.add("tna-accordion__details");
    $item.classList.remove("tna-accordion__item");

    $heading.removeAttribute("class");

    $content.classList.add("tna-accordion__content");
    $content.classList.remove("tna-accordion__body");
    $content.setAttribute("hidden", "");

    const $headingButton = document.createElement("button");
    $headingButton.classList.add("tna-accordion__summary");
    $headingButton.setAttribute("type", "button");
    $headingButton.setAttribute("aria-controls", $content.id);
    $headingButton.innerText = $heading.innerText;
    $heading.innerText = "";
    $heading.appendChild($headingButton);

    $headingButton.addEventListener("click", () => {
      const isOpen = $headingButton.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        this.closeItem_($item);
      } else {
        this.openItem_($item);
      }
    });
  }

  initState_() {
    this.$items.forEach(($item) => {
      if ($item.dataset.isopen === "true") {
        this.openItem_($item);
      } else {
        this.closeItem_($item);
      }
      $item.removeAttribute("data-isopen");
    });
  }

  openItem_($item) {
    if (!this.allowMultipleItemsOpen) {
      this.closeAllItemsExcept_($item);
    }
    const $headingButton = $item.querySelector(".tna-accordion__summary");
    const $content = $item.querySelector(".tna-accordion__content");
    $headingButton.setAttribute("aria-expanded", "true");
    $headingButton.setAttribute(
      "aria-label",
      `${$headingButton.innerText.trim()}, Hide this section`,
    );
    $content.removeAttribute("hidden");
    // $content.setAttribute("tabindex", "0");
    this.syncToggleAllButton_();

    const $tableWrapper = $content.querySelectorAll(".tna-table-wrapper");
    if ($tableWrapper) {
      $tableWrapper.forEach(($wrapper) => {
        checkTableForScroll($wrapper);
      });
    }
  }

  closeItem_($item) {
    const $headingButton = $item.querySelector(".tna-accordion__summary");
    const $content = $item.querySelector(".tna-accordion__content");
    $headingButton.setAttribute("aria-expanded", "false");
    $headingButton.setAttribute(
      "aria-label",
      `${$headingButton.innerText.trim()}, Show this section`,
    );
    $content.setAttribute("hidden", "");
    // $content.setAttribute("tabindex", "-1");
    this.syncToggleAllButton_();
  }

  closeAllItemsExcept_($excludeItem) {
    Array.from(this.$items)
      .filter(
        ($item) =>
          $item.querySelector(".tna-accordion__summary") !== $excludeItem &&
          $item
            .querySelector(".tna-accordion__summary")
            .getAttribute("aria-expanded") === "true",
      )
      .forEach(($item) => this.closeItem_($item));
  }

  isAllOpen_() {
    return Array.from(this.$items).every(
      ($item) =>
        $item
          .querySelector(".tna-accordion__summary")
          .getAttribute("aria-expanded") === "true",
    );
  }

  syncToggleAllButton_() {
    if (this.$toggleAllButton) {
      if (this.isAllOpen_()) {
        this.$toggleAllButton.innerText =
          this.$toggleAllButton.dataset.closeAllLabel || "Hide all sections";
      } else {
        this.$toggleAllButton.innerText =
          this.$toggleAllButton.dataset.openAllLabel || "Show all sections";
      }
    }
  }
}
