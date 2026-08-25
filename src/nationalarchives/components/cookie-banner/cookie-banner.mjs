import Cookies from "@nationalarchives/cookies/src/index.js";

export { Cookies };

export default class CookieBanner {
  constructor($module) {
    this.$module = $module;
    this.$acceptButton = $module && $module.querySelector('[value="accept"]');
    this.$rejectButton = $module && $module.querySelector('[value="reject"]');
    this.$prompt =
      $module && $module.querySelector(".tna-cookie-banner__message--prompt");
    this.$acceptedMessage =
      $module && $module.querySelector(".tna-cookie-banner__message--accepted");
    this.$rejectedMessage =
      $module && $module.querySelector(".tna-cookie-banner__message--rejected");
    this.$closeButtons = $module && $module.querySelectorAll('[value="close"]');

    if (
      !this.$module ||
      !this.$acceptButton ||
      !this.$rejectButton ||
      !this.$prompt ||
      !this.$acceptedMessage ||
      !this.$rejectedMessage ||
      !this.$closeButtons
    ) {
      return;
    }

    this.cookies = new Cookies();

    this.cookiePreferencesSetKey =
      this.$module.dataset.preferencesKey || "cookie_preferences_set";

    if (!this.cookies.preferencesCorrectOnInit) {
      this.cookies.delete(this.cookiePreferencesSetKey);
    }

    if (
      !this.cookies.exists(this.cookiePreferencesSetKey) ||
      !this.cookies.hasValue(this.cookiePreferencesSetKey, "true")
    ) {
      this.$module.removeAttribute("hidden");

      this.$acceptButton.addEventListener("click", () => this.accept_());
      this.$rejectButton.addEventListener("click", () => this.reject_());
    }
  }

  accept_() {
    this.$prompt.setAttribute("hidden", "");
    this.complete_();
    this.cookies.enableAllPreferences();
    this.$acceptedMessage.removeAttribute("hidden");
    this.$acceptedMessage.setAttribute("tabindex", "0");
    this.$acceptedMessage.focus();
    this.$acceptedMessage.addEventListener("blur", () => {
      this.$acceptedMessage.removeAttribute("tabindex");
    });
  }

  reject_() {
    this.$prompt.setAttribute("hidden", "");
    this.complete_();
    this.cookies.disableAllPreferences();
    this.$rejectedMessage.removeAttribute("hidden");
    this.$rejectedMessage.setAttribute("tabindex", "0");
    this.$rejectedMessage.focus();
    this.$rejectedMessage.addEventListener("blur", () => {
      this.$rejectedMessage.removeAttribute("tabindex");
    });
  }

  complete_() {
    this.cookies.set(this.cookiePreferencesSetKey, true);
    this.$closeButtons.forEach(($closeButton) => {
      $closeButton.addEventListener("click", () => this.close_());
    });
  }

  close_() {
    this.$module.setAttribute("hidden", "");
  }
}
