export default class Gallery {
  constructor($module) {
    this.$module = $module;
    this.$itemsContainer =
      $module && $module.querySelector(".tna-gallery__items");
    this.$items =
      this.$itemsContainer &&
      this.$itemsContainer.querySelectorAll(".tna-gallery__item");
    this.$navigation =
      $module && $module.querySelector(".tna-gallery__navigation");
    this.$navigationItems =
      this.$navigation &&
      $module.querySelectorAll(".tna-gallery__navigation-item");
    this.$navigationButtons =
      $module && $module.querySelector(".tna-gallery__navigation-buttons");

    if (
      !this.$module ||
      !this.$itemsContainer ||
      !this.$items ||
      /* eslint-disable-next-line no-magic-numbers */
      this.$items.length < 2 ||
      !this.$navigation ||
      !this.$navigationItems ||
      !this.$navigationButtons
    ) {
      return;
    }

    this.$module.classList.add("tna-gallery--interactive");

    this.$navigationButtonPrev = this.$navigationButtons.querySelector(
      ".tna-gallery__navigation-prev",
    );
    this.$navigationButtonNext = this.$navigationButtons.querySelector(
      ".tna-gallery__navigation-next",
    );

    this.setup_();
    /* eslint-disable-next-line no-magic-numbers */
    this.currentId = this.$items[0].id;
    this.showItem(this.currentId);
  }

  setup_() {
    this.$items.forEach(($item) => {
      $item.setAttribute("hidden", "");
      $item.setAttribute("aria-hidden", "true");
      $item
        .querySelector(".tna-gallery__item-header")
        ?.setAttribute("aria-hidden", "true");
    });
    this.$navigation.removeAttribute("hidden");
    this.$navigationItems.forEach(($item) => {
      $item.addEventListener("click", () => {
        this.showItem($item.getAttribute("aria-controls"));
        this.$itemsContainer.setAttribute("tabindex", "0");
        this.$itemsContainer.focus();
      });
    });
    this.$module.addEventListener("keydown", (event) => {
      let preventDefaultKeyAction = false;
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          this.showPreviousItem_();
          preventDefaultKeyAction = true;
          break;
        case "ArrowRight":
        case "ArrowDown":
          this.showNextItem_();
          preventDefaultKeyAction = true;
          break;
        case "Home":
          this.showFirstItem_();
          preventDefaultKeyAction = true;
          break;
        case "End":
          this.showLastItem_();
          preventDefaultKeyAction = true;
          break;
        default:
          break;
      }
      if (preventDefaultKeyAction) {
        event.stopPropagation();
        event.preventDefault();
      }
    });

    this.$navigationButtons?.removeAttribute("hidden");
    this.$navigationButtonPrev?.addEventListener("click", () => {
      this.showPreviousItem_();
    });
    this.$navigationButtonNext?.addEventListener("click", () => {
      this.showNextItem_();
    });

    this.$liveRegion = document.createElement("div");
    this.$liveRegion.setAttribute("aria-live", "polite");
    this.$liveRegion.setAttribute("aria-atomic", "true");
    this.$liveRegion.setAttribute("class", "tna-gallery__item-header");
    this.$itemsContainer.prepend(this.$liveRegion);
    this.$itemsContainer.classList.add("tna-gallery__items--hide-item-titles");
    this.$itemsContainer.addEventListener("blur", () =>
      this.$itemsContainer.removeAttribute("tabindex"),
    );
  }

  showItem_(id) {
    this.$items.forEach(($item) => {
      if (id && $item.id === id) {
        $item.removeAttribute("hidden");
        $item.removeAttribute("aria-hidden");
      } else {
        $item.setAttribute("hidden", "");
        $item.setAttribute("aria-hidden", "true");
      }
    });
    this.$navigationItems.forEach(($item) => {
      if (id) {
        if ($item.getAttribute("aria-controls") === id) {
          $item.setAttribute("aria-current", "true");
        } else {
          $item.setAttribute("aria-current", "false");
        }
      } else {
        $item.setAttribute("aria-current", "false");
      }
    });
    this.currentId = id;
    /* eslint-disable-next-line no-magic-numbers */
    this.$liveRegion.textContent = `Image ${this.getCurrentItemIndex_() + 1} of ${this.$items.length}`;
  }

  getCurrentItemIndex_() {
    return Array.from(this.$items).findIndex(
      ($item) => $item.id === this.currentId,
    );
  }

  showPreviousItem_() {
    /* eslint-disable-next-line no-magic-numbers */
    let nextIndexToShow = this.getCurrentItemIndex_() - 1;
    /* eslint-disable-next-line no-magic-numbers */
    if (nextIndexToShow < 0) {
      /* eslint-disable-next-line no-magic-numbers */
      nextIndexToShow = this.$items.length - 1;
    }
    this.showItem_(this.$items[nextIndexToShow].id);
  }

  showNextItem_() {
    /* eslint-disable-next-line no-magic-numbers */
    let nextIndexToShow = this.getCurrentItemIndex_() + 1;
    if (nextIndexToShow >= this.$items.length) {
      /* eslint-disable-next-line no-magic-numbers */
      nextIndexToShow = 0;
    }
    this.showItem_(this.$items[nextIndexToShow].id);
  }

  showFirstItem_() {
    /* eslint-disable-next-line no-magic-numbers */
    this.showItem_(this.$items[0].id);
  }

  showLastItem_() {
    /* eslint-disable-next-line no-magic-numbers */
    this.showItem_(this.$items[this.$items.length - 1].id);
  }
}
