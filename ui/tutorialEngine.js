(function () {
  var STORAGE_KEY = "dissonantChoices_tutorial_v1";

  function readState() {
    try {
      if (typeof localStorage === "undefined") return { completed: false, currentStep: 0 };
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { completed: false, currentStep: 0 };
      var parsed = JSON.parse(raw);
      return {
        completed: !!(parsed && parsed.completed),
        currentStep:
          parsed && typeof parsed.currentStep === "number" && parsed.currentStep >= 0
            ? Math.floor(parsed.currentStep)
            : 0
      };
    } catch (e) {
      return { completed: false, currentStep: 0 };
    }
  }

  function writeState(next) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next || {}));
    } catch (e) {}
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  class TutorialEngine {
    constructor(opts) {
      this.steps = Array.isArray(opts.steps) ? opts.steps : [];
      this.elements = opts.elements || {};
      this.state = readState();
      this.isActive = false;
      this.currentIndex = clamp(this.state.currentStep || 0, 0, Math.max(this.steps.length - 1, 0));

      this._onResize = () => this.render();
      this._onScroll = () => this.render();
    }

    getState() {
      return {
        completed: !!this.state.completed,
        currentStep: this.currentIndex
      };
    }

    shouldAutoStart() {
      return !this.state.completed && this.steps.length > 0;
    }

    start(startIndex) {
      if (!this.steps.length) return;
      var idx =
        typeof startIndex === "number"
          ? clamp(Math.floor(startIndex), 0, this.steps.length - 1)
          : clamp(this.currentIndex, 0, this.steps.length - 1);
      this.currentIndex = idx;
      this.isActive = true;
      this.attachListeners();
      this.elements.layer.hidden = false;
      this.advanceToRenderable(1);
    }

    replay() {
      this.state = { completed: false, currentStep: 0 };
      writeState(this.state);
      this.currentIndex = 0;
      this.start(0);
    }

    next() {
      if (!this.isActive) return;
      this.currentIndex += 1;
      if (this.currentIndex >= this.steps.length) {
        this.complete();
        return;
      }
      this.advanceToRenderable(1);
    }

    back() {
      if (!this.isActive) return;
      this.currentIndex -= 1;
      if (this.currentIndex < 0) this.currentIndex = 0;
      this.advanceToRenderable(-1);
    }

    skip() {
      this.complete();
    }

    onScreenChanged() {
      if (!this.isActive) return;
      this.advanceToRenderable(1);
    }

    complete() {
      this.isActive = false;
      this.state.completed = true;
      this.state.currentStep = 0;
      writeState(this.state);
      this.clearAnchor();
      this.elements.layer.hidden = true;
      this.detachListeners();
    }

    attachListeners() {
      window.addEventListener("resize", this._onResize);
      document.addEventListener("scroll", this._onScroll, true);
    }

    detachListeners() {
      window.removeEventListener("resize", this._onResize);
      document.removeEventListener("scroll", this._onScroll, true);
    }

    findAnchor(step) {
      if (!step || !step.selector) return null;
      try {
        return document.querySelector(step.selector);
      } catch (e) {
        return null;
      }
    }

    advanceToRenderable(direction) {
      if (!this.isActive) return;
      var visited = new Set();
      while (this.currentIndex >= 0 && this.currentIndex < this.steps.length) {
        if (visited.has(this.currentIndex)) break;
        visited.add(this.currentIndex);
        var step = this.steps[this.currentIndex];
        var anchor = this.findAnchor(step);
        if (anchor) {
          this.render(anchor, step);
          this.state.currentStep = this.currentIndex;
          writeState(this.state);
          return;
        }
        this.currentIndex += direction >= 0 ? 1 : -1;
      }
      this.complete();
    }

    clearAnchor() {
      if (this._activeAnchor) {
        this._activeAnchor.classList.remove("tutorial-anchor-active");
      }
      this._activeAnchor = null;
    }

    render(anchor, step) {
      if (!this.isActive) return;
      if (!anchor) {
        this.advanceToRenderable(1);
        return;
      }

      this.clearAnchor();
      this._activeAnchor = anchor;
      anchor.classList.add("tutorial-anchor-active");

      this.elements.stepLabel.textContent =
        "Step " + (this.currentIndex + 1) + "/" + this.steps.length;
      this.elements.text.textContent = step.text || "";
      this.elements.btnBack.disabled = this.currentIndex <= 0;
      this.elements.btnNext.textContent =
        this.currentIndex >= this.steps.length - 1 ? "Done" : "Next";

      var rect = anchor.getBoundingClientRect();
      var pad = 6;
      this.elements.highlight.style.left = rect.left - pad + "px";
      this.elements.highlight.style.top = rect.top - pad + "px";
      this.elements.highlight.style.width = rect.width + pad * 2 + "px";
      this.elements.highlight.style.height = rect.height + pad * 2 + "px";

      var card = this.elements.card;
      card.style.left = "12px";
      card.style.right = "12px";
      card.style.top = "auto";
      card.style.bottom = "auto";
      var cardRect = card.getBoundingClientRect();
      var vpH = window.innerHeight || document.documentElement.clientHeight || 0;
      var topSpace = rect.top;
      var bottomSpace = vpH - rect.bottom;
      if (bottomSpace > cardRect.height + 12) {
        card.style.top = Math.max(8, rect.bottom + 10) + "px";
      } else if (topSpace > cardRect.height + 12) {
        card.style.top = Math.max(8, rect.top - cardRect.height - 10) + "px";
      } else {
        card.style.top = Math.max(8, vpH - cardRect.height - 12) + "px";
      }
    }
  }

  window.TutorialEngine = TutorialEngine;
  window.TutorialStorageKey = STORAGE_KEY;
})();
