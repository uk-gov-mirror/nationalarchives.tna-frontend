export default class DateInputProgressive {
  constructor($module) {
    this.$module = $module;
    this.$yearWrapper =
      $module && $module.querySelector(".tna-date-input__item--year");
    this.$yearInput =
      this.$yearWrapper && this.$yearWrapper.querySelector("input");
    this.$monthWrapper =
      $module && $module.querySelector(".tna-date-input__item--month");
    this.$monthInput =
      this.$monthWrapper && this.$monthWrapper.querySelector("input");
    this.$dayWrapper =
      $module && $module.querySelector(".tna-date-input__item--day");
    this.$dayInput =
      this.$dayWrapper && this.$dayWrapper.querySelector("input");

    if (!this.$module) {
      return;
    }

    this.update_();
    window.addEventListener("pageshow", () => this.update_());

    if (this.$yearInput) {
      this.$yearInput.addEventListener("keyup", () => this.update_());
      this.$yearInput.addEventListener("change", () => this.update_());
    }
    if (this.$monthInput) {
      this.$monthInput.addEventListener("keyup", () => this.update_());
      this.$monthInput.addEventListener("change", () => this.update_());
    }
    if (this.$dayInput) {
      this.$dayInput.addEventListener("keyup", () => this.update_());
      this.$dayInput.addEventListener("change", () => this.update_());
    }
  }

  update_() {
    if (this.isValidYear_()) {
      this.showMonth_();
      if (this.isValidMonth_()) {
        this.showDay_();
      } else {
        this.hideDay_();
      }
    } else {
      this.hideMonth_();
      this.hideDay_();
    }
  }

  isValidYear_() {
    if (!this.$yearInput) {
      return true;
    }
    const yearValue = parseInt(this.$yearInput.value.trim(), 10);
    /* eslint-disable-next-line no-magic-numbers */
    return !isNaN(this.$yearInput.value) && !isNaN(yearValue) && yearValue > 0;
  }

  isValidMonth_() {
    if (!this.$monthInput) {
      return true;
    }
    const monthRawValue = this.$monthInput.value.trim();
    const monthIntValue = parseInt(monthRawValue, 10);
    const validFullMonthStrings = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const validMonthStrings = validFullMonthStrings.concat(
      validFullMonthStrings.map((month) => month.slice(0, 3)),
    );
    return (
      (!isNaN(this.$monthInput.value) &&
        !isNaN(monthIntValue) &&
        /* eslint-disable-next-line no-magic-numbers */
        monthIntValue > 0 &&
        /* eslint-disable-next-line no-magic-numbers */
        monthIntValue <= 12) ||
      validMonthStrings.includes(monthRawValue.toLowerCase())
    );
  }

  showMonth_() {
    if (this.$monthWrapper) {
      this.$monthWrapper.removeAttribute("hidden");
    }
  }

  hideMonth_() {
    if (this.$monthWrapper) {
      this.$monthWrapper.setAttribute("hidden", "");
    }
  }

  showDay_() {
    if (this.$dayWrapper) {
      this.$dayWrapper.removeAttribute("hidden");
    }
  }

  hideDay_() {
    if (this.$dayWrapper) {
      this.$dayWrapper.setAttribute("hidden", "");
    }
  }
}
