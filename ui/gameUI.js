// UI Layer for mobile web game.
// Renders: decision moments, dissonance, reduction, summary.
//
// Classic script global export for file:// compatibility.

class GameUI {
  constructor(gameLoop, { personaState, beliefSystem, strainSystem }) {
    this.loop = gameLoop;
    this.persona = personaState;
    this.beliefSystem = beliefSystem;
    this.strainSystem = strainSystem;

    this.screens = {};
  }

  init() {
    this.cacheElements();
    this.syncStrainHeaderUI();
    this.wireEvents();
    this.wireRegistration();
    this.loop.subscribe((event) => this.handleGameEvent(event));
    this.buildBeliefPickList();
    this.wireOnboarding();
    this.syncPlayerNameInputFromPersona();
    this.updateBeliefPickHint();
    this.updateOnboardingContinueEnabled();
    this.updateBeliefListScrollableState();
    if (!this.persona.registrationDone) {
      this.showScreen("registration");
    } else if (this.persona.onboardingDone) {
      this.updateStartScreenCopy();
      this.showScreen("start");
    } else {
      this.showScreen("onboarding");
    }
    this.renderPersona();
    this.renderProgressDots();
    this.initTutorialEngine();
  }

  cacheElements() {
    this.appEl = document.getElementById("app");
    this.screens = {
      registration: document.getElementById("screen-registration"),
      onboarding: document.getElementById("screen-onboarding"),
      start: document.getElementById("screen-start"),
      scenario: document.getElementById("screen-scenario"),
      decision: document.getElementById("screen-decision"),
      dissonance: document.getElementById("screen-dissonance"),
      reduction: document.getElementById("screen-reduction"),
      summary: document.getElementById("screen-summary")
    };

    this.personaNameEl = document.getElementById("personaName");
    this.personaTraitsEl = document.getElementById("personaTraits");
    this.strainFillEl = document.getElementById("strainFill");
    this.strainPercentEl = document.getElementById("strainPercent");
    this.strainLabelEl = document.getElementById("strainLabel");
    this.strainMeterEl = document.getElementById("strainMeter");
    this.progressDotsEl = document.getElementById("progressDots");
    this.statusPillEl = document.getElementById("statusPill");
    this.statusLabelEl = document.getElementById("statusLabel");

    this.scenarioEpisodeLabelEl = document.getElementById("scenarioEpisodeLabel");
    this.scenarioTitleEl = document.getElementById("scenarioTitle");
    this.scenarioBeliefLineEl = document.getElementById("scenarioBeliefLine");
    this.scenarioTextEl = document.getElementById("scenarioText");
    this.scenarioInnerVoicesEl = document.getElementById("scenarioInnerVoices");
    this.scenarioDecisionMomentEl = document.getElementById("scenarioDecisionMoment");
    this.scenarioFocusTagEl = document.getElementById("scenarioFocusTag");
    this.scenarioStakesTagEl = document.getElementById("scenarioStakesTag");

    this.decisionTitleEl = document.getElementById("decisionTitle");
    this.decisionPromptEl = document.getElementById("decisionPrompt");
    this.decisionOptionsEl = document.getElementById("decisionOptions");
    this.btnCommitDecision = document.getElementById("btnCommitDecision");

    this.dissonanceTitleEl = document.getElementById("dissonanceTitle");
    this.dissonanceBodyEl = document.getElementById("dissonanceBody");
    this.dissonanceInsightEl = document.getElementById("dissonanceInsight");
    this.decisionStrainDeltaLabelEl = document.getElementById("decisionStrainDeltaLabel");
    this.dissonanceConflictNoteEl = document.getElementById("dissonanceConflictNote");
    this.keyTraitTensionLabelEl = document.getElementById("keyTraitTensionLabel");
    this.dissonanceTensionVisualEl = document.getElementById("dissonanceTensionVisual");
    this.dissonanceTensionFillEl = document.getElementById("dissonanceTensionFill");
    this.dissonanceTensionLevelLabelEl = document.getElementById("dissonanceTensionLevelLabel");
    this.dissonanceTensionIconEl = document.getElementById("dissonanceTensionIcon");
    this.dissonanceTensionHintEl = document.getElementById("dissonanceTensionHint");

    this.reductionButtonsEl = document.getElementById("reductionButtons");

    this.beliefDeltaVizEl = document.getElementById("beliefDeltaViz");
    this.tensionRippleEl = document.getElementById("tensionRipple");
    this.tensionRippleHostEl = document.getElementById("tensionRippleHost");

    this.summaryCompactEl = document.getElementById("summaryCompact");
    this.summaryExtraEl = document.getElementById("summaryExtra");
    this.summaryExtraBodyEl = document.getElementById("summaryExtraBody");
    this.summaryStrainBandEl = document.getElementById("summaryStrainBand");
    this.summaryStrainPctEl = document.getElementById("summaryStrainPct");
    this.summaryStrainFillEl = document.getElementById("summaryStrainFill");
    this.nextScenarioLabelEl = document.getElementById("nextScenarioLabel");
    this.nextScenarioSubtitleEl = document.getElementById("nextScenarioSubtitle");
    this.btnRestartEl = document.getElementById("btnRestart");

    this.btnStart = document.getElementById("btnStart");
    this.btnToDecision = document.getElementById("btnToDecision");
    this.btnToReduction = document.getElementById("btnToReduction");
    this.btnNextScenario = document.getElementById("btnNextScenario");

    this.playerNameInput = document.getElementById("playerNameInput");
    this.beliefPickList = document.getElementById("beliefPickList");
    this.onboardingErrorEl = document.getElementById("onboardingError");
    this.btnOnboardingContinue = document.getElementById("btnOnboardingContinue");
    this.onboardingContinueSubtitleEl = document.getElementById(
      "onboardingContinueSubtitle"
    );
    this.beliefPickHintEl = document.getElementById("beliefPickHint");
    this.beliefPickScrollHintEl = document.getElementById("beliefPickScrollHint");
    this.startTitleEl = document.getElementById("startTitle");
    this.startBodyEl = document.getElementById("startBody");
    this.startNameLineEl = document.getElementById("startNameLine");
    this.onboardingAppearAsNameEl = document.getElementById("onboardingAppearAsName");
    this.reductionScreenSubtitleEl = document.getElementById("reductionScreenSubtitle");

    this.regFullNameEl = document.getElementById("regFullName");
    this.regEmailEl = document.getElementById("regEmail");
    this.regConsentEl = document.getElementById("regConsent");
    this.registrationErrorEl = document.getElementById("registrationError");
    this.btnRegistrationSubmit = document.getElementById("btnRegistrationSubmit");
    this.registrationSubmitSubtitleEl = document.getElementById("registrationSubmitSubtitle");

    this.btnSettings = document.getElementById("btnSettings");
    this.btnHelp = document.getElementById("btnHelp");
    this.settingsPanelEl = document.getElementById("settingsPanel");
    this.btnReplayTutorial = document.getElementById("btnReplayTutorial");
    this.btnRestartFromSettings = document.getElementById("btnRestartFromSettings");
    this.btnCloseSettings = document.getElementById("btnCloseSettings");
    this.helpPanelEl = document.getElementById("helpPanel");
    this.btnCloseHelp = document.getElementById("btnCloseHelp");

    this.tutorialLayerEl = document.getElementById("tutorialLayer");
    this.tutorialHighlightEl = document.getElementById("tutorialHighlight");
    this.tutorialCardEl = document.getElementById("tutorialCard");
    this.tutorialStepLabelEl = document.getElementById("tutorialStepLabel");
    this.tutorialTextEl = document.getElementById("tutorialText");
    this.btnTutorialBack = document.getElementById("btnTutorialBack");
    this.btnTutorialNext = document.getElementById("btnTutorialNext");
    this.btnTutorialSkip = document.getElementById("btnTutorialSkip");
  }

  wireEvents() {
    if (!this.btnStart) {
      throw new Error("Start button (#btnStart) not found in DOM.");
    }

    bindPrimaryAction(this.btnStart, () => {
      this.showScenario();
    });

    bindPrimaryAction(this.btnToDecision, () => {
      this.showDecision();
    });

    if (this.btnCommitDecision) {
      bindPrimaryAction(this.btnCommitDecision, () => {
        this.loop.commitDecision();
      });
    }

    bindPrimaryAction(this.btnToReduction, () => {
      this.showReduction();
    });

    bindPrimaryAction(this.btnNextScenario, () => {
      this.loop.goToNextDecision();
      this.showScenario();
      this.updateProgressDotsActive();
    });

    bindPrimaryAction(this.btnRestartEl, () => this.performFullRestart());

    if (this.btnSettings) {
      bindPrimaryAction(this.btnSettings, () => this.openSettingsPanel());
    }
    if (this.btnHelp) {
      bindPrimaryAction(this.btnHelp, () => this.openHelpPanel());
    }
    if (this.btnCloseSettings) {
      bindPrimaryAction(this.btnCloseSettings, () => this.closeSettingsPanel());
    }
    if (this.btnCloseHelp) {
      bindPrimaryAction(this.btnCloseHelp, () => this.closeHelpPanel());
    }
    if (this.btnReplayTutorial) {
      bindPrimaryAction(this.btnReplayTutorial, () => {
        this.closeSettingsPanel();
        if (this.tutorial && this.tutorial.replay) {
          this.tutorial.replay();
        }
      });
    }
    if (this.btnRestartFromSettings) {
      bindPrimaryAction(this.btnRestartFromSettings, () => this.performFullRestart());
    }
    if (this.settingsPanelEl) {
      this.settingsPanelEl.addEventListener("click", (e) => {
        if (e.target === this.settingsPanelEl) {
          this.closeSettingsPanel();
        }
      });
    }
    if (this.helpPanelEl) {
      this.helpPanelEl.addEventListener("click", (e) => {
        if (e.target === this.helpPanelEl) {
          this.closeHelpPanel();
        }
      });
    }
    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      this.closeSettingsPanel();
      this.closeHelpPanel();
    });
  }

  handleGameEvent(event) {
    if (event.type === "DecisionCommitted") {
      this.renderPersona();
      const decision = event.decision || null;
      const primaryChoice = event.primaryChoice || null;
      if (shouldShowCoping(decision, primaryChoice, event.dissonance)) {
        this.renderDissonance(event);
        this.showScreen("dissonance");
      } else {
        this.renderNoCopingSummary(event);
        this.showScreen("summary");
      }
    } else if (event.type === "RationalizationApplied") {
      this.renderPersona();
      this.renderSummary(event);
      this.showScreen("summary");
    } else if (event.type === "StateUpdated") {
      this.renderPersona();
      this.renderProgressDots();
    }
  }

  renderNoCopingSummary(event) {
    const primaryChoice = event.primaryChoice || null;
    const decisionStrainDelta =
      typeof event.decisionStrainDelta === "number" ? event.decisionStrainDelta : 0;
    const episodeStrainDelta =
      typeof event.episodeStrainDelta === "number" ? event.episodeStrainDelta : 0;
    const episodeBeliefChanges = event.episodeBeliefChanges || [];

    this.renderBeliefDeltaViz(episodeBeliefChanges);

    const c = this.summaryCompactEl;
    if (c) {
      c.innerHTML = "";
      c.appendChild(
        buildSummaryVisualBoard({
          identityName: this.getCommittedPlayerDisplayName() || "you",
          choiceLabel: primaryChoice && primaryChoice.label ? primaryChoice.label : "—",
          strips: [
            { key: "choice", label: "After choice", delta: decisionStrainDelta },
            { key: "scene", label: "Scene total", delta: episodeStrainDelta }
          ],
          copingLabel: null,
          justificationUsesTotal: 0
        })
      );
    }

    this.fillSummaryExtraSection(null, {
      rationalization: null,
      moment: this.loop.getCurrentDecisionMoment(),
      choiceCategory: this.loop.getLastChoiceCategory()
    });

    const strain = this.strainSystem.getStrain();
    this.applySummaryStrainFoot(strain);

    this.playSummaryTensionRipple(episodeStrainDelta);

    const isLast =
      this.loop.currentIndex === this.loop.getDecisionMoments().length - 1;
    if (isLast) {
      this.nextScenarioLabelEl.textContent = "Overview";
      this.nextScenarioSubtitleEl.textContent = "See the pattern.";
      this.btnRestartEl.style.display = "inline-flex";
    } else {
      this.nextScenarioLabelEl.textContent = "Next scene";
      this.nextScenarioSubtitleEl.textContent = "Continue the story.";
      this.btnRestartEl.style.display = "none";
    }
  }

  showScreen(name) {
    Object.values(this.screens).forEach((el) => {
      if (el) el.classList.remove("screen--active");
    });
    const target = this.screens[name];
    if (target) target.classList.add("screen--active");
    this.syncAppPhase(name);
    if (name === "onboarding") {
      window.requestAnimationFrame(() => this.updateBeliefListScrollableState());
    }
    if (this.tutorial && this.tutorial.onScreenChanged) {
      window.requestAnimationFrame(() => this.tutorial.onScreenChanged());
    }
  }

  syncAppPhase(screenName) {
    if (!this.appEl) return;
    const phase =
      screenName === "registration"
        ? "registration"
        : screenName === "onboarding"
          ? "onboarding"
          : "ingame";
    this.appEl.setAttribute("data-phase", phase);
  }

  wireRegistration() {
    const sync = () => this.updateRegistrationSubmitEnabled();
    [this.regFullNameEl, this.regEmailEl, this.regConsentEl].forEach(
      (el) => {
        if (!el) return;
        el.addEventListener("input", sync);
        el.addEventListener("change", sync);
      }
    );
    if (this.btnRegistrationSubmit) {
      bindPrimaryAction(this.btnRegistrationSubmit, () => {
        this.submitRegistration();
      });
    }
    this.updateRegistrationSubmitEnabled();
  }

  updateRegistrationSubmitEnabled() {
    if (!this.btnRegistrationSubmit) return;
    const fullName =
      this.regFullNameEl && typeof this.regFullNameEl.value === "string"
        ? this.regFullNameEl.value.trim()
        : "";
    const email =
      this.regEmailEl && typeof this.regEmailEl.value === "string"
        ? this.regEmailEl.value.trim()
        : "";
    const consent = !!(this.regConsentEl && this.regConsentEl.checked);
    const ok = !!fullName && isLikelyEmail(email) && consent;
    this.btnRegistrationSubmit.disabled = !ok;
    this.btnRegistrationSubmit.setAttribute("aria-disabled", ok ? "false" : "true");
    if (this.registrationSubmitSubtitleEl) {
      this.registrationSubmitSubtitleEl.textContent = ok
        ? "Ready to submit."
        : "Complete required fields.";
    }
  }

  showRegistrationError(msg) {
    if (!this.registrationErrorEl) return;
    this.registrationErrorEl.textContent = msg || "";
    this.registrationErrorEl.hidden = !msg;
  }

  async submitRegistration() {
    this.showRegistrationError("");
    const payload = {
      fullName:
        this.regFullNameEl && typeof this.regFullNameEl.value === "string"
          ? this.regFullNameEl.value.trim().slice(0, 80)
          : "",
      email:
        this.regEmailEl && typeof this.regEmailEl.value === "string"
          ? this.regEmailEl.value.trim().slice(0, 120)
          : "",
      consent: !!(this.regConsentEl && this.regConsentEl.checked)
    };
    if (!payload.fullName || !isLikelyEmail(payload.email) || !payload.consent) {
      this.showRegistrationError("Please complete all required fields.");
      this.updateRegistrationSubmitEnabled();
      return;
    }

    if (this.btnRegistrationSubmit) {
      this.btnRegistrationSubmit.disabled = true;
      this.btnRegistrationSubmit.setAttribute("aria-disabled", "true");
    }
    if (this.registrationSubmitSubtitleEl) {
      this.registrationSubmitSubtitleEl.textContent = "Submitting...";
    }

    try {
      const result = await postRegistrationPayload(payload);
      this.persona.registrationDone = true;
      this.persona.registrationRef =
        result && typeof result.registrationId === "string" ? result.registrationId : "";
      // Use registration name as onboarding default.
      if (!this.persona.name) {
        this.persona.name = payload.fullName.slice(0, 40);
      }
      this.syncPlayerNameInputFromPersona();
      this.refreshDisplayedName();

      if (
        window.GamePersistence &&
        window.GamePersistence.save &&
        window.GamePersistence.snapshotFromPersona
      ) {
        window.GamePersistence.save(window.GamePersistence.snapshotFromPersona(this.persona));
      }

      this.updateOnboardingContinueEnabled();
      this.showScreen("onboarding");
    } catch (err) {
      this.showRegistrationError(
        (err && err.message) ||
          "Registration failed. Check your network or API setup and try again."
      );
    } finally {
      this.updateRegistrationSubmitEnabled();
    }
  }

  buildBeliefPickList() {
    if (!this.beliefPickList) return;
    const opts = Array.isArray(window.ONBOARDING_BELIEF_OPTIONS)
      ? window.ONBOARDING_BELIEF_OPTIONS
      : [];
    this.beliefPickList.innerHTML = "";
    opts.forEach((o) => {
      if (!o || !o.id) return;
      const lab = document.createElement("label");
      lab.className = "belief-pick-item";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.beliefId = o.id;
      input.setAttribute("aria-label", o.label || o.id);
      const span = document.createElement("span");
      span.className = "belief-pick-text";
      span.textContent = o.label || o.id;
      lab.appendChild(input);
      lab.appendChild(span);
      this.beliefPickList.appendChild(lab);
    });
    this.beliefPickList.scrollTop = 0;
    this.updateBeliefListScrollableState();
  }

  wireOnboarding() {
    if (this.playerNameInput) {
      const sync = () => {
        if (!this.persona.onboardingDone) {
          const v = this.playerNameInput.value;
          this.persona.name = typeof v === "string" ? v.slice(0, 40) : "";
        }
        this.refreshDisplayedName();
        this.updateOnboardingContinueEnabled();
        this.updateBeliefPickHint();
      };
      this.playerNameInput.addEventListener("input", sync);
      this.playerNameInput.addEventListener("change", sync);
    }
    if (this.beliefPickList) {
      this.beliefPickList.addEventListener("scroll", () => {
        this.updateBeliefListScrollableState();
      });
      this.beliefPickList.addEventListener("change", (e) => {
        const t = e.target;
        if (!t || t.type !== "checkbox") return;
        const checked = this.beliefPickList.querySelectorAll("input[type=checkbox]:checked");
        if (checked.length > 3) {
          t.checked = false;
        }
        this.updateBeliefPickHint();
        this.updateOnboardingContinueEnabled();
      });
    }
    window.addEventListener("resize", () => {
      this.updateBeliefListScrollableState();
    });
    window.addEventListener("orientationchange", () => {
      this.updateBeliefListScrollableState();
    });
    if (this.btnOnboardingContinue) {
      bindPrimaryAction(this.btnOnboardingContinue, () => {
        this.submitOnboarding();
      });
    }
  }

  updateBeliefPickHint() {
    if (!this.beliefPickHintEl) return;
    if (!this.beliefPickList) {
      this.beliefPickHintEl.textContent = "";
      return;
    }
    const n = this.beliefPickList.querySelectorAll("input[type=checkbox]:checked").length;
    const nameOk =
      this.playerNameInput &&
      typeof this.playerNameInput.value === "string" &&
      this.playerNameInput.value.trim().length > 0;
    if (n < 3) {
      this.beliefPickHintEl.textContent =
        "Selected: " + n + "/3 · Continue unlocks at 3/3.";
    } else if (!nameOk) {
      this.beliefPickHintEl.textContent =
        "Selected: 3/3 · Enter your name to unlock Continue.";
    } else {
      this.beliefPickHintEl.textContent =
        "Selected: 3/3 · Tap Continue to save and start.";
    }
  }

  updateBeliefListScrollableState() {
    if (!this.beliefPickList) return;
    const list = this.beliefPickList;
    const hasOverflow = list.scrollHeight - list.clientHeight > 2;
    const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 2;
    list.classList.toggle("is-scrollable", hasOverflow);
    list.classList.toggle("is-at-bottom", !hasOverflow || atBottom);
    if (this.beliefPickScrollHintEl) {
      this.beliefPickScrollHintEl.hidden = !hasOverflow || atBottom;
    }
  }

  updateOnboardingContinueEnabled() {
    if (!this.btnOnboardingContinue) return;
    if (this.persona.onboardingDone) {
      this.btnOnboardingContinue.disabled = false;
      this.btnOnboardingContinue.setAttribute("aria-disabled", "false");
      return;
    }
    const raw =
      this.playerNameInput && typeof this.playerNameInput.value === "string"
        ? this.playerNameInput.value.trim()
        : "";
    const n = this.beliefPickList
      ? this.beliefPickList.querySelectorAll("input[type=checkbox]:checked").length
      : 0;
    const ok = raw.length >= 1 && n === 3;
    this.btnOnboardingContinue.disabled = !ok;
    this.btnOnboardingContinue.setAttribute("aria-disabled", ok ? "false" : "true");
    if (this.onboardingContinueSubtitleEl) {
      this.onboardingContinueSubtitleEl.textContent = ok
        ? "Save and start."
        : "Unlocks with name + 3 picks.";
    }
  }

  openSettingsPanel() {
    if (!this.settingsPanelEl) return;
    this.closeHelpPanel();
    this.settingsPanelEl.hidden = false;
    this.updateModalBodyLock();
  }

  closeSettingsPanel() {
    if (!this.settingsPanelEl) return;
    this.settingsPanelEl.hidden = true;
    this.updateModalBodyLock();
  }

  openHelpPanel() {
    if (!this.helpPanelEl) return;
    this.closeSettingsPanel();
    this.helpPanelEl.hidden = false;
    this.updateModalBodyLock();
  }

  closeHelpPanel() {
    if (!this.helpPanelEl) return;
    this.helpPanelEl.hidden = true;
    this.updateModalBodyLock();
  }

  updateModalBodyLock() {
    var body = document.body;
    if (!body) return;
    var settingsOpen = this.settingsPanelEl && !this.settingsPanelEl.hidden;
    var helpOpen = this.helpPanelEl && !this.helpPanelEl.hidden;
    body.classList.toggle("body--modal-lock", !!(settingsOpen || helpOpen));
  }

  initTutorialEngine() {
    if (!window.TutorialEngine || !this.tutorialLayerEl) return;
    this.tutorial = new window.TutorialEngine({
      steps: [
        {
          id: "start",
          selector: "#btnStart",
          text: "Start begins the first scene. You can continue playing without closing this hint."
        },
        {
          id: "strain",
          selector: ".strain-meter",
          text: "Strain shows Low, Medium, or High first. The percentage is a finer read of the same tension."
        },
        {
          id: "beliefs",
          selector: "#personaTraits .pill",
          text: "Belief pills show your strongest active beliefs right now."
        },
        {
          id: "status",
          selector: "#statusPill",
          text: "Status gives a quick read of your overall dissonance state."
        }
      ],
      elements: {
        layer: this.tutorialLayerEl,
        highlight: this.tutorialHighlightEl,
        card: this.tutorialCardEl,
        stepLabel: this.tutorialStepLabelEl,
        text: this.tutorialTextEl,
        btnBack: this.btnTutorialBack,
        btnNext: this.btnTutorialNext,
        btnSkip: this.btnTutorialSkip
      }
    });

    if (this.btnTutorialNext) {
      this.btnTutorialNext.addEventListener("click", () => this.tutorial.next());
    }
    if (this.btnTutorialBack) {
      this.btnTutorialBack.addEventListener("click", () => this.tutorial.back());
    }
    if (this.btnTutorialSkip) {
      this.btnTutorialSkip.addEventListener("click", () => this.tutorial.skip());
    }

    // First run: auto-show only when onboarding is done.
    if (this.persona.onboardingDone && this.tutorial.shouldAutoStart()) {
      this.tutorial.start();
    }
  }

  showOnboardingError(msg) {
    if (!this.onboardingErrorEl) return;
    this.onboardingErrorEl.textContent = msg || "";
    this.onboardingErrorEl.hidden = !msg;
  }

  submitOnboarding() {
    this.showOnboardingError("");
    const raw =
      this.playerNameInput && typeof this.playerNameInput.value === "string"
        ? this.playerNameInput.value.trim()
        : "";
    if (raw.length < 1) {
      this.showOnboardingError("Please enter a name.");
      return;
    }
    const checked = this.beliefPickList
      ? Array.from(this.beliefPickList.querySelectorAll("input[type=checkbox]:checked"))
      : [];
    if (checked.length !== 3) {
      this.showOnboardingError("Pick three beliefs to continue.");
      return;
    }
    const ids = checked.map((el) => el.dataset.beliefId).filter(Boolean);
    if (ids.length !== 3 || new Set(ids).size !== 3) {
      this.showOnboardingError("Pick three different beliefs.");
      return;
    }

    this.persona.name = raw.slice(0, 40);
    this.persona.playerPriorityBeliefIds = ids;
    this.persona.onboardingDone = true;

    ids.forEach((id) => {
      const b = this.beliefSystem.getBelief(id);
      if (b) {
        b.strength = Math.min(95, (typeof b.strength === "number" ? b.strength : 0) + 5);
        b.lastUpdated = Date.now();
      }
    });
    this.beliefSystem.rebuildStabilityIndex();

    if (
      window.GamePersistence &&
      window.GamePersistence.save &&
      window.GamePersistence.snapshotFromPersona
    ) {
      window.GamePersistence.save(window.GamePersistence.snapshotFromPersona(this.persona));
    }

    this.updateStartScreenCopy();
    this.renderPersona();
    this.showScreen("start");
    if (this.tutorial && this.tutorial.shouldAutoStart && this.tutorial.shouldAutoStart()) {
      this.tutorial.start();
    }
  }

  updateStartScreenCopy() {
    if (this.startTitleEl) {
      const n = (this.persona.name && String(this.persona.name).trim()) || "you";
      this.startTitleEl.textContent = "Help " + n + " choose.";
    }
    if (this.startBodyEl) {
      this.startBodyEl.textContent = "Short scenes. One choice each.";
    }
    if (this.startNameLineEl) {
      if (this.persona.onboardingDone) {
        const label =
          (this.persona.name && String(this.persona.name).trim()) || "you";
        this.startNameLineEl.textContent = "Playing as: " + label;
        this.startNameLineEl.removeAttribute("hidden");
      } else {
        this.startNameLineEl.textContent = "";
        this.startNameLineEl.setAttribute("hidden", "");
      }
    }
  }

  /** Keep the DOM field aligned with `persona.name` (e.g. after load). */
  syncPlayerNameInputFromPersona() {
    if (!this.playerNameInput) return;
    var n = this.persona && this.persona.name != null ? String(this.persona.name) : "";
    this.playerNameInput.value = n.length > 40 ? n.slice(0, 40) : n;
  }

  /** Non-empty trimmed name after onboarding; null if not set. */
  getCommittedPlayerDisplayName() {
    if (!this.persona || !this.persona.onboardingDone) return null;
    const n = this.persona.name && String(this.persona.name).trim();
    return n ? n.slice(0, 40) : null;
  }

  getDisplayedPlayerName() {
    // Single source: `persona.name` (mirrors save `playerName`). While onboarding, the input
    // handler copies keystrokes into `persona.name` before `refreshDisplayedName()`.
    if (this.persona.onboardingDone) {
      const n = this.persona.name && String(this.persona.name).trim();
      return n || "you";
    }
    const draft = this.persona.name && String(this.persona.name).trim();
    if (draft) return draft.slice(0, 40);
    return "Add your name";
  }

  refreshDisplayedName() {
    const t = this.getDisplayedPlayerName();
    if (this.personaNameEl) {
      this.personaNameEl.textContent = t;
      this.personaNameEl.title = t;
    }
    if (this.onboardingAppearAsNameEl) {
      this.onboardingAppearAsNameEl.textContent = t;
      this.onboardingAppearAsNameEl.title = t;
    }
  }

  renderPersona() {
    this.refreshDisplayedName();
    this.personaTraitsEl.innerHTML = "";

    const beliefs = this.beliefSystem.listBeliefs();
    const moment = this.loop && this.loop.getCurrentDecisionMoment
      ? this.loop.getCurrentDecisionMoment()
      : null;

    // Focus Mode: show at most 2 pills by default.
    // 1) Focal belief: moment.beliefId (required if available)
    // 2) Support belief: from moment.beliefsToHighlight or fallback (highest strength among remaining)
    const focalId = moment && moment.beliefId ? moment.beliefId : null;
    const authored =
      moment && Array.isArray(moment.beliefsToHighlight)
        ? moment.beliefsToHighlight.filter((x) => typeof x === "string" && x.trim())
        : [];

    const highlightIds = [];
    if (authored.length) {
      authored.forEach((id) => {
        if (highlightIds.length >= 2) return;
        if (!highlightIds.includes(id)) highlightIds.push(id);
      });
    } else if (focalId) {
      highlightIds.push(focalId);
      // v1 fallback: support belief = highest strength among remaining beliefs.
      const support = beliefs
        .filter((b) => b && b.id && b.id !== focalId)
        .sort((a, b) => (b.strength || 0) - (a.strength || 0))[0];
      if (support && support.id) highlightIds.push(support.id);
    } else {
      // No focal belief found: fall back to showing top 2 strongest.
      beliefs
        .slice()
        .sort((a, b) => (b.strength || 0) - (a.strength || 0))
        .slice(0, 2)
        .forEach((b) => highlightIds.push(b.id));
    }

    const priorityIds = Array.isArray(this.persona.playerPriorityBeliefIds)
      ? this.persona.playerPriorityBeliefIds
      : [];

    function makePill(b, { isFocus }) {
      const pill = document.createElement("div");
      pill.className = "pill";
      pill.dataset.beliefId = b.id;
      if (isFocus) pill.classList.add("pill--focus");
      if (priorityIds.includes(b.id)) pill.classList.add("pill--priority");
      pill.textContent = `${b.coreClaim.split(".")[0]} (${Math.round(b.strength)}%)`;
      return pill;
    }

    // Collapsed (default) row: 1–2 highlighted pills.
    const focusRow = document.createElement("div");
    focusRow.className = "persona-traits persona-traits--focus";
    const highlightBeliefs = highlightIds
      .map((id) => beliefs.find((b) => b && b.id === id))
      .filter(Boolean);
    highlightBeliefs.forEach((b) => {
      focusRow.appendChild(makePill(b, { isFocus: focalId && b.id === focalId }));
    });
    this.personaTraitsEl.appendChild(focusRow);

    // Other beliefs disclosure.
    const otherBeliefs = beliefs.filter((b) => b && b.id && !highlightIds.includes(b.id));
    const details = document.createElement("details");
    details.className = "belief-disclosure";

    const summary = document.createElement("summary");
    summary.className = "belief-disclosure__summary";
    summary.textContent = `Other beliefs (${otherBeliefs.length})`;
    details.appendChild(summary);

    const otherWrap = document.createElement("div");
    otherWrap.className = "persona-traits persona-traits--other";
    otherBeliefs.forEach((b) => {
      otherWrap.appendChild(makePill(b, { isFocus: false }));
    });
    details.appendChild(otherWrap);

    this.personaTraitsEl.appendChild(details);

    this.syncStrainHeaderUI();
  }

  /** Top bar strain meter + status pill (same source as persona model). */
  syncStrainHeaderUI() {
    if (!this.strainFillEl || !this.strainPercentEl || !this.strainLabelEl || !this.statusPillEl) return;
    const strain = this.strainSystem.getStrain();
    const pct = Math.round(strain);
    const band = this.strainSystem.getBandLabel();
    this.strainLabelEl.textContent = band;
    this.strainPercentEl.textContent = `${pct}%`;
    if (this.strainMeterEl) {
      this.strainMeterEl.setAttribute("data-strain-band", band.toLowerCase());
      this.strainMeterEl.setAttribute(
        "aria-label",
        "Strain: " + band + ", " + pct + " percent"
      );
    }

    const scale = Math.max(0.04, strain / 100);
    this.strainFillEl.style.transform = `scaleX(${scale})`;

    this.statusPillEl.classList.remove("status-pill--high", "status-pill--med");
    if (strain >= 70) {
      this.statusPillEl.classList.add("status-pill--high");
      this.statusLabelEl.textContent = "High Dissonance";
    } else if (strain >= 40) {
      this.statusPillEl.classList.add("status-pill--med");
      this.statusLabelEl.textContent = "Rising Dissonance";
    } else {
      this.statusLabelEl.textContent = "Stable";
    }
  }

  renderProgressDots() {
    const moments = this.loop.getDecisionMoments();
    this.progressDotsEl.innerHTML = "";
    if (!moments.length) return;
    moments.forEach((_, idx) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (idx === this.loop.currentIndex) dot.classList.add("dot--active");
      this.progressDotsEl.appendChild(dot);
    });
  }

  updateProgressDotsActive() {
    const dots = this.progressDotsEl.querySelectorAll(".dot");
    dots.forEach((d, i) => {
      d.classList.toggle("dot--active", i === this.loop.currentIndex);
    });
  }

  showScenario() {
    const moment = this.loop.getCurrentDecisionMoment();
    if (!moment) {
      this.scenarioTitleEl.textContent = "No scenarios";
      this.scenarioTextEl.textContent =
        "Add content/scenarios.js before gameLoop.js, then reload.";
      if (this.scenarioBeliefLineEl) {
        this.scenarioBeliefLineEl.setAttribute("hidden", "");
      }
      this.showScreen("scenario");
      return;
    }
    this.scenarioEpisodeLabelEl.textContent = moment.episodeLabel;
    this.scenarioTitleEl.textContent = moment.title || "Scene";

    if (this.scenarioBeliefLineEl) {
      if (moment.belief) {
        this.scenarioBeliefLineEl.textContent = moment.belief;
        this.scenarioBeliefLineEl.removeAttribute("hidden");
      } else {
        this.scenarioBeliefLineEl.textContent = "";
        this.scenarioBeliefLineEl.setAttribute("hidden", "");
      }
    }

    this.scenarioTextEl.textContent = moment.situation || "";

    if (this.scenarioInnerVoicesEl) {
      this.scenarioInnerVoicesEl.innerHTML = "";
      (moment.innerVoices || []).forEach((line) => {
        const div = document.createElement("div");
        div.className = "inner-voice";
        div.textContent = line;
        this.scenarioInnerVoicesEl.appendChild(div);
      });
    }

    if (this.scenarioDecisionMomentEl) {
      this.scenarioDecisionMomentEl.textContent = moment.decision || "";
    }

    const focus = moment.beliefFocusLabel
      ? moment.beliefFocusLabel
      : capitalize(moment.beliefId || (moment.contextTags || [])[0] || "belief");
    this.scenarioFocusTagEl.textContent = `Belief focus: ${focus}`;
    this.scenarioStakesTagEl.textContent = "Stakes: Identity & relationships";

    this.showScreen("scenario");
  }

  showDecision() {
    this.clearBeliefHitHighlight();
    const moment = this.loop.getCurrentDecisionMoment();
    if (!moment) {
      this.showScenario();
      return;
    }
    this.decisionTitleEl.textContent = "Choose one action";
    if (this.decisionPromptEl) {
      this.decisionPromptEl.textContent =
        "Pick one action. Others disappear.";
    }

    if (this.decisionOptionsEl) {
      const options = this.loop.getAvailablePrimaryChoices();
      const selectedId = this.loop.getSelectedPrimaryChoiceId();
      this.decisionOptionsEl.innerHTML = "";

      if (options && options.length) {
        options.forEach((opt) => {
          const btn = document.createElement("button");
          btn.className = "btn btn-outline";
          btn.type = "button";

          const isSelected = selectedId
            ? opt.id === selectedId
            : opt.id === options[0].id;
          if (isSelected) btn.classList.add("btn--selected");

          // Render label + optional description (two-line clamp via CSS).
          btn.innerHTML = "";
          const labelWrap = document.createElement("span");
          labelWrap.className = "btn-label";

          const title = document.createElement("span");
          title.className = "btn-title";
          title.textContent = opt.label || "";

          const desc = document.createElement("span");
          desc.className = "subtitle btn-option-desc";
          desc.textContent = opt.description || "";

          labelWrap.appendChild(title);
          labelWrap.appendChild(desc);

          const chev = document.createElement("span");
          chev.className = "chevron";
          chev.textContent = "›";

          btn.appendChild(labelWrap);
          btn.appendChild(chev);

          bindPrimaryAction(btn, () => {
            this.loop.selectPrimaryChoice(opt.id);
            this.showDecision();
          });

          this.decisionOptionsEl.appendChild(btn);
        });
      }
    }

    this.showScreen("decision");
  }

  renderDissonance(event) {
    const primaryChoice = event.primaryChoice || {};
    const dissonance = event.dissonance || {};
    const conflictDelta =
      typeof dissonance.strainDelta === "number" ? dissonance.strainDelta : 0;
    const triggered = !!dissonance.triggered;
    const tone = primaryChoice.tone || "mixed";
    const level =
      conflictDelta < 5
        ? "low"
        : conflictDelta < 10
          ? "mild"
          : conflictDelta < 18
            ? "medium"
            : "high";

    let title;
    if (!triggered) title = "Very light strain.";
    else if (level === "low") title = "Small strain.";
    else if (level === "mild") title = "Some inner pull.";
    else if (level === "medium") title = "Strong pull.";
    else title = "Heavy strain.";

    this.dissonanceTitleEl.textContent = title;

    let body;
    if (!triggered) {
      body = "This felt close to what you say you believe.";
    } else if (tone === "conflict") {
      body = "You feel you crossed a line your beliefs usually protect.";
    } else if (tone === "aligned") {
      body = "Mostly fits what you say you value.";
    } else {
      body = "You can spin this both ways.";
    }
    this.dissonanceBodyEl.textContent = body;

    let insight;
    if (!triggered) {
      insight = "Low strain. Little need to justify.";
    } else if (tone === "conflict") {
      insight = "High strain. You may justify, reframe, or change the belief.";
    } else {
      insight = "Medium strain. You can reframe what happened.";
    }
    this.dissonanceInsightEl.textContent = insight;

    // Single metric: net strain change from this choice (primary delta + belief-conflict if any).
    const totalDelta = typeof event.episodeStrainDelta === "number" ? event.episodeStrainDelta : 0;
    if (this.decisionStrainDeltaLabelEl && this.decisionStrainDeltaLabelEl.classList) {
      this.decisionStrainDeltaLabelEl.textContent =
        (totalDelta >= 0 ? "+" : "") + Math.round(totalDelta) + " pts";
      this.decisionStrainDeltaLabelEl.classList.remove(
        "metric-value--danger",
        "metric-value--ok"
      );
      if (totalDelta >= 0) {
        this.decisionStrainDeltaLabelEl.classList.add("metric-value--danger");
      } else {
        this.decisionStrainDeltaLabelEl.classList.add("metric-value--ok");
      }
    }

    if (this.dissonanceConflictNoteEl) {
      if (triggered && conflictDelta > 0) {
        this.dissonanceConflictNoteEl.hidden = false;
        this.dissonanceConflictNoteEl.textContent =
          "Part of this change comes from tension between your choice and what you believe.";
      } else {
        this.dissonanceConflictNoteEl.hidden = true;
        this.dissonanceConflictNoteEl.textContent = "";
      }
    }

    const conflicts = dissonance.conflicts || [];
    if (!conflicts.length) {
      this.keyTraitTensionLabelEl.textContent = "No single belief strongly opposed this action.";
    } else {
      const main = conflicts[0];
      const belief = this.beliefSystem.getBelief(main.beliefId);
      const label = belief ? belief.coreClaim : main.beliefId;
      this.keyTraitTensionLabelEl.textContent = `Hit belief: “${label}”`;
    }

    this.updateDissonanceTensionVisual(triggered, conflictDelta);
    this.applyBeliefHitHighlight(
      conflicts.length && conflicts[0].beliefId ? conflicts[0].beliefId : null
    );
  }

  clearBeliefHitHighlight() {
    if (!this.personaTraitsEl) return;
    this.personaTraitsEl.querySelectorAll(".pill").forEach((p) => {
      p.classList.remove("belief-pill--hit");
    });
  }

  applyBeliefHitHighlight(beliefId) {
    if (!this.personaTraitsEl || !beliefId) return;
    this.personaTraitsEl.querySelectorAll(".pill").forEach((p) => {
      p.classList.toggle("belief-pill--hit", p.dataset.beliefId === beliefId);
    });
  }

  /**
   * Primary visual read for dissonance: gradient bar + Calm/Uneasy/Tense/Overloaded.
   * conflictDelta = dissonance.strainDelta from engine (used for this moment's bar only).
   */
  updateDissonanceTensionVisual(triggered, conflictDelta) {
    const visual = this.dissonanceTensionVisualEl;
    const fill = this.dissonanceTensionFillEl;
    if (!visual || !fill) return;

    const maxBar = 25;
    const d = typeof conflictDelta === "number" ? conflictDelta : 0;

    let tierClass = "tension--calm";
    let label = "Calm";
    let icon = "○";
    let fillScale = 0.14;

    if (!triggered || d <= 0) {
      tierClass = "tension--calm";
      label = "Calm";
      icon = "○";
      fillScale = 0.14;
      if (this.dissonanceTensionHintEl) {
        this.dissonanceTensionHintEl.textContent = "Little inner pull from this moment.";
      }
    } else if (d < 5) {
      tierClass = "tension--uneasy";
      label = "Uneasy";
      icon = "◐";
      fillScale = Math.max(0.22, Math.min(1, d / maxBar));
      if (this.dissonanceTensionHintEl) {
        this.dissonanceTensionHintEl.textContent = "A bit of discomfort—your belief is nudging you.";
      }
    } else if (d < 10) {
      tierClass = "tension--uneasy";
      label = "Uneasy";
      icon = "◐";
      fillScale = Math.min(1, d / maxBar);
      if (this.dissonanceTensionHintEl) {
        this.dissonanceTensionHintEl.textContent = "Noticeable pull between what you did and what you hold true.";
      }
    } else if (d < 18) {
      tierClass = "tension--tense";
      label = "Tense";
      icon = "◉";
      fillScale = Math.min(1, d / maxBar);
      if (this.dissonanceTensionHintEl) {
        this.dissonanceTensionHintEl.textContent = "Strong tension—worth sitting with before you move on.";
      }
    } else {
      tierClass = "tension--overloaded";
      label = "Overloaded";
      icon = "✦";
      fillScale = Math.min(1, d / maxBar);
      if (this.dissonanceTensionHintEl) {
        this.dissonanceTensionHintEl.textContent = "Heavy load—this moment asks a lot of your inner story.";
      }
    }

    visual.classList.remove("tension--calm", "tension--uneasy", "tension--tense", "tension--overloaded");
    visual.classList.add(tierClass);
    if (this.dissonanceTensionLevelLabelEl) {
      this.dissonanceTensionLevelLabelEl.textContent = label;
    }
    if (this.dissonanceTensionIconEl) {
      this.dissonanceTensionIconEl.textContent = icon;
    }

    fill.style.transform = "scaleX(0)";
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        fill.style.transform = `scaleX(${fillScale})`;
      });
    });
  }

  renderBeliefDeltaViz(episodeBeliefChanges) {
    const host = this.beliefDeltaVizEl;
    if (!host) return;
    host.innerHTML = "";
    if (!episodeBeliefChanges || !episodeBeliefChanges.length) {
      host.setAttribute("hidden", "");
      this.flashBeliefPillsForEpisodeChanges([]);
      return;
    }
    host.removeAttribute("hidden");

    const moment =
      this.loop && this.loop.getCurrentDecisionMoment
        ? this.loop.getCurrentDecisionMoment()
        : null;
    const focalId = moment && moment.beliefId ? moment.beliefId : null;
    const sorted = sortEpisodeBeliefChanges(episodeBeliefChanges, focalId);
    const animate = !prefersReducedMotionUi();

    sorted.forEach((c) => {
      host.appendChild(mountBeliefChangeCard(c, this.beliefSystem, animate));
    });

    this.flashBeliefPillsForEpisodeChanges(sorted);
  }

  /**
   * One-shot highlight on persona pills matching summary belief rows (top strip + disclosure).
   */
  flashBeliefPillsForEpisodeChanges(changeList) {
    const root = this.personaTraitsEl;
    if (!root) return;
    if (this._beliefShiftClearTimer != null) {
      window.clearTimeout(this._beliefShiftClearTimer);
      this._beliefShiftClearTimer = null;
    }
    root.querySelectorAll(".pill.pill--belief-shift").forEach((p) => {
      p.classList.remove("pill--belief-shift");
    });
    const ids = new Set(
      (changeList || []).map((c) => c && c.beliefId).filter(Boolean)
    );
    if (!ids.size) return;
    root.querySelectorAll(".pill[data-belief-id]").forEach((p) => {
      if (ids.has(p.dataset.beliefId)) p.classList.add("pill--belief-shift");
    });
    this._beliefShiftClearTimer = window.setTimeout(() => {
      root.querySelectorAll(".pill.pill--belief-shift").forEach((p) => {
        p.classList.remove("pill--belief-shift");
      });
      this._beliefShiftClearTimer = null;
    }, 1100);
  }

  playSummaryTensionRipple(episodeStrainDelta) {
    const el = this.tensionRippleEl;
    if (!el) return;
    const delta =
      typeof episodeStrainDelta === "number" ? episodeStrainDelta : 0;
    el.classList.remove("tension-ripple--play", "tension-ripple--calm");
    void el.offsetWidth;
    if (delta <= 0) {
      el.classList.add("tension-ripple--calm");
    }
    el.classList.add("tension-ripple--play");
    window.setTimeout(() => {
      el.classList.remove("tension-ripple--play");
    }, 900);
  }

  showReduction() {
    this.clearBeliefHitHighlight();
    teardownReductionPopoverListeners();
    if (this.reductionScreenSubtitleEl) {
      const n = (this.persona.name && String(this.persona.name).trim()) || "you";
      this.reductionScreenSubtitleEl.textContent = "Pick how " + n + " copes.";
    }
    const strategies = this.loop.getAvailableRationalizations();
    this.reductionButtonsEl.innerHTML = "";

    const diss =
      typeof this.loop.getDecisionDissonanceStrainDelta === "function"
        ? this.loop.getDecisionDissonanceStrainDelta()
        : 0;
    const coarsePointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    var hasJustificationOption = false;

    strategies.forEach((s) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline";
      btn.type = "button";
      const label = document.createElement("span");
      label.className = "btn-label";
      const title = document.createElement("span");
      title.className = "btn-title";
      title.textContent = s.label || "";
      const sub = document.createElement("span");
      sub.className = "subtitle btn-option-desc";
      if (s.reductionType === "justification") {
        hasJustificationOption = true;
        sub.appendChild(document.createTextNode(s.explanation || ""));
        const note = document.createElement("span");
        note.className = "reduction-relief-note";
        note.textContent =
          diss > 0
            ? " Relieves about −" +
              diss +
              " strain (this scene’s dissonance)."
            : " Uses a small default relief when this choice didn’t add dissonance strain.";
        sub.appendChild(document.createElement("br"));
        sub.appendChild(note);
      } else {
        sub.textContent = s.explanation || "";
      }
      label.appendChild(title);
      label.appendChild(sub);
      const chev = document.createElement("span");
      chev.className = "chevron";
      chev.textContent = "›";
      btn.appendChild(label);
      btn.appendChild(chev);
      var id = s.id;
      bindPrimaryAction(btn, () => {
        this.loop.applyRationalization(id);
      });

      if (s.reductionType !== "justification") {
        this.reductionButtonsEl.appendChild(btn);
        return;
      }

      btn.classList.add("reduction-option-row__main");
      const row = document.createElement("div");
      row.className = "reduction-option-row";

      const hintWrap = document.createElement("div");
      hintWrap.className = "reduction-hint-wrap";

      const hintBtn = document.createElement("button");
      hintBtn.type = "button";
      hintBtn.className = "reduction-hint-btn";
      hintBtn.setAttribute(
        "aria-label",
        "Why leaning on justification often has side effects"
      );
      hintBtn.setAttribute("aria-expanded", "false");
      hintBtn.textContent = "ⓘ";

      const pop = document.createElement("div");
      pop.className = "reduction-popover";
      pop.setAttribute("role", "tooltip");
      pop.hidden = true;
      pop.innerHTML =
        '<p class="reduction-popover__title">Habit &amp; hangover</p>' +
        "<p>Relief can track this scene’s dissonance—but using justification a lot can dull how clearly you feel discomfort, soften the pull of your own standards, and bring tension back when a similar choice appears.</p>";

      const popId =
        "reduction-pop-" + String(s.id || "j") + "-" + String(Date.now());
      pop.id = popId;
      hintBtn.setAttribute("aria-controls", popId);

      function setPopOpen(open) {
        pop.hidden = !open;
        hintBtn.setAttribute("aria-expanded", open ? "true" : "false");
      }

      if (coarsePointer) {
        hintBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          setPopOpen(pop.hidden);
        });
      } else {
        hintWrap.addEventListener("mouseenter", function () {
          setPopOpen(true);
        });
        hintWrap.addEventListener("mouseleave", function () {
          setPopOpen(false);
        });
        hintBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          setPopOpen(!pop.hidden);
        });
      }

      hintWrap.appendChild(hintBtn);
      hintWrap.appendChild(pop);
      row.appendChild(btn);
      row.appendChild(hintWrap);
      this.reductionButtonsEl.appendChild(row);
    });

    if (hasJustificationOption) {
      reductionPopoverOutsideClose = function (ev) {
        if (ev.type === "keydown") {
          if (ev.key !== "Escape") return;
        } else if (ev.type === "click") {
          var t = ev.target;
          if (t && t.closest && t.closest(".reduction-hint-wrap")) return;
        }
        document.querySelectorAll(".reduction-popover").forEach(function (p) {
          p.hidden = true;
        });
        document.querySelectorAll(".reduction-hint-btn").forEach(function (b) {
          b.setAttribute("aria-expanded", "false");
        });
      };
      window.setTimeout(function () {
        document.addEventListener("click", reductionPopoverOutsideClose);
        document.addEventListener("keydown", reductionPopoverOutsideClose);
      }, 0);
    }

    this.showScreen("reduction");
  }

  renderSummary(event) {
    const rationalization = event.rationalization;
    const strainBefore = event.strainBefore;
    const strainAfter = event.strainAfter;
    const episodeStrainDelta =
      typeof event.episodeStrainDelta === "number" ? event.episodeStrainDelta : 0;
    const decisionStrainDelta =
      typeof event.decisionStrainDelta === "number" ? event.decisionStrainDelta : 0;
    const episodeBeliefChanges = event.episodeBeliefChanges || [];
    const primaryChoice = event.primaryChoice || null;
    const justificationUsesTotal =
      typeof event.justificationUsesTotal === "number"
        ? event.justificationUsesTotal
        : 0;

    this.renderBeliefDeltaViz(episodeBeliefChanges);

    const copingDelta = strainAfter - strainBefore;
    const c = this.summaryCompactEl;
    if (c) {
      c.innerHTML = "";
      c.appendChild(
        buildSummaryVisualBoard({
          identityName: this.getCommittedPlayerDisplayName() || "you",
          choiceLabel: primaryChoice && primaryChoice.label ? primaryChoice.label : "—",
          strips: [
            { key: "choice", label: "After choice", delta: decisionStrainDelta },
            { key: "cope", label: "Coping", delta: copingDelta },
            { key: "scene", label: "Scene total", delta: episodeStrainDelta }
          ],
          copingLabel:
            rationalization && rationalization.label ? rationalization.label : null,
          justificationUsesTotal: justificationUsesTotal
        })
      );
    }

    this.fillSummaryExtraSection(rationalization, {
      moment: this.loop.getCurrentDecisionMoment(),
      choiceCategory: this.loop.getLastChoiceCategory()
    });

    this.applySummaryStrainFoot(strainAfter);

    this.playSummaryTensionRipple(episodeStrainDelta);

    const isLast =
      this.loop.currentIndex === this.loop.getDecisionMoments().length - 1;
    if (isLast) {
      this.nextScenarioLabelEl.textContent = "Overview";
      this.nextScenarioSubtitleEl.textContent =
        "See the pattern.";
      this.btnRestartEl.style.display = "inline-flex";
    } else {
      this.nextScenarioLabelEl.textContent = "Next scene";
      this.nextScenarioSubtitleEl.textContent =
        "Continue the story.";
      this.btnRestartEl.style.display = "none";
    }
  }

  fillSummaryExtraSection(rationalization, ctx) {
    const body = this.summaryExtraBodyEl;
    const det = this.summaryExtraEl;
    if (!body || !det) return;
    body.innerHTML = "";
    const blocks = [];

    if (rationalization && rationalization.explanation) {
      const ex = String(rationalization.explanation).trim();
      if (ex) {
        blocks.push({
          title: rationalization.label || "Coping",
          text: ex
        });
      }
    }

    if (rationalization && rationalization.copingCaveat) {
      const cave = String(rationalization.copingCaveat).trim();
      if (cave) {
        blocks.push({
          title: "Trade-off",
          text: cave
        });
      }
    }

    const moment = ctx && ctx.moment;
    const choiceCategory = ctx && ctx.choiceCategory;
    if (moment && moment.systemFeedback && choiceCategory) {
      const fb = moment.systemFeedback[choiceCategory];
      if (fb) {
        const parts = [];
        if (fb.dissonance) parts.push("Dissonance: " + fb.dissonance + ".");
        if (fb.beliefStrength) parts.push("Beliefs: " + fb.beliefStrength + ".");
        if (fb.longTerm) parts.push("Long-term: " + fb.longTerm + ".");
        const joined = parts.join(" ").trim();
        if (joined) blocks.push({ title: "Designer note", text: joined });
      }
    }

    if (moment && Array.isArray(moment.reflectionPrompts) && moment.reflectionPrompts.length) {
      blocks.push({
        title: "Reflect",
        text: moment.reflectionPrompts.join("\n\n")
      });
    }

    if (!blocks.length) {
      det.setAttribute("hidden", "");
      return;
    }

    blocks.forEach((b) => {
      const wrap = document.createElement("div");
      wrap.className = "summary-extra__block";
      const h = document.createElement("div");
      h.className = "summary-extra__block-title";
      h.textContent = b.title;
      wrap.appendChild(h);
      const p = document.createElement("p");
      p.className = "summary-extra__block-text";
      p.textContent = b.text;
      wrap.appendChild(p);
      body.appendChild(wrap);
    });
    det.removeAttribute("hidden");
  }

  applySummaryStrainFoot(strainRaw) {
    const s = typeof strainRaw === "number" ? strainRaw : 0;
    const pct = Math.max(0, Math.min(100, Math.round(s)));
    var band =
      window.StrainSystem && typeof window.StrainSystem.bandLabelForValue === "function"
        ? window.StrainSystem.bandLabelForValue(s)
        : "Low";
    if (this.summaryStrainBandEl) {
      this.summaryStrainBandEl.textContent = band;
    }
    if (this.summaryStrainPctEl) {
      this.summaryStrainPctEl.textContent = pct + "%";
    }
    if (this.summaryStrainFillEl) {
      const fill01 = Math.max(0, Math.min(1, s / 100));
      this.summaryStrainFillEl.style.transform = "scaleX(" + fill01 + ")";
    }
  }

  /** Clears persisted persona save and reloads (same as summary Restart). */
  performFullRestart() {
    try {
      if (window.GamePersistence && window.GamePersistence.STORAGE_KEY) {
        localStorage.removeItem(window.GamePersistence.STORAGE_KEY);
      }
    } catch (e) {}
    window.location.reload();
  }
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

var reductionPopoverOutsideClose = null;

function teardownReductionPopoverListeners() {
  if (reductionPopoverOutsideClose) {
    document.removeEventListener("click", reductionPopoverOutsideClose);
    document.removeEventListener("keydown", reductionPopoverOutsideClose);
    reductionPopoverOutsideClose = null;
  }
}

/**
 * Reliable tap on mobile: touchstart (non-passive) + click dedupe.
 */
function bindPrimaryAction(element, handler) {
  if (!element || typeof handler !== "function") return;
  var touchStarted = false;
  element.addEventListener(
    "touchstart",
    function (evt) {
      touchStarted = true;
      evt.preventDefault();
      try {
        handler(evt);
      } catch (e) {
        try {
          if (typeof console !== "undefined" && console.error) {
            console.error("UI action failed:", e);
          }
        } catch (_) {}
      } finally {
        window.setTimeout(function () {
          touchStarted = false;
        }, 400);
      }
    },
    { passive: false }
  );
  element.addEventListener("click", function (evt) {
    if (touchStarted) return;
    try {
      handler(evt);
    } catch (e) {
      try {
        if (typeof console !== "undefined" && console.error) {
          console.error("UI click failed:", e);
        }
      } catch (_) {}
    }
  });
}

/**
 * Minimum belief–action dissonance strain (from DissonanceEngine, multiples of 5)
 * to show the Dissonance + Coping flow. Below this, skip straight to summary like an aligned path.
 */
var COPING_MIN_DISSONANCE_STRAIN = 15;

function shouldShowCoping(decision, primaryChoice, dissonance) {
  if (!decision || !primaryChoice) return true;
  var beliefId = decision.beliefId;
  var onConflictPath = false;
  if (
    beliefId &&
    primaryChoice.beliefImpact &&
    typeof primaryChoice.beliefImpact[beliefId] === "number"
  ) {
    onConflictPath = primaryChoice.beliefImpact[beliefId] < 0;
  } else {
    onConflictPath = primaryChoice.tone !== "aligned";
  }
  if (!onConflictPath) return false;

  var dissDelta =
    dissonance && typeof dissonance.strainDelta === "number" ? dissonance.strainDelta : 0;
  var triggered = !!(dissonance && dissonance.triggered);
  if (!triggered || dissDelta < COPING_MIN_DISSONANCE_STRAIN) {
    return false;
  }
  return true;
}

function formatSummaryPts(delta) {
  var v = Math.round(delta);
  return (v >= 0 ? "+" : "") + v + " pts";
}

/** Shared scale for strip widths in one summary so proportions match; pts text stays exact. */
function computeSummaryStripMaxAbs(strips) {
  var m = 0;
  (strips || []).forEach(function (s) {
    var d = typeof s.delta === "number" ? s.delta : 0;
    var a = Math.abs(d);
    if (a > m) m = a;
  });
  return Math.max(10, m, 1);
}

function buildSummaryStripRow(label, delta, maxAbs) {
  var row = document.createElement("div");
  row.className = "summary-strip-row";
  row.setAttribute("role", "listitem");
  var d = typeof delta === "number" ? delta : 0;
  var ariaPts = formatSummaryPts(d);
  row.setAttribute("aria-label", label + ": " + ariaPts);

  var top = document.createElement("div");
  top.className = "summary-strip-row__top";
  var lab = document.createElement("span");
  lab.className = "summary-strip-row__label";
  lab.textContent = label;
  var pts = document.createElement("span");
  pts.className = "summary-strip-row__pts";
  pts.textContent = ariaPts;
  top.appendChild(lab);
  top.appendChild(pts);

  var track = document.createElement("div");
  track.className = "summary-strip-row__track";
  var fill = document.createElement("div");
  fill.className = "summary-strip-row__fill";
  fill.setAttribute("aria-hidden", "true");
  var abs = Math.abs(d);
  var pct = maxAbs > 0 ? Math.min(100, (abs / maxAbs) * 100) : 0;
  if (d > 0) fill.classList.add("summary-strip-row__fill--up");
  else if (d < 0) fill.classList.add("summary-strip-row__fill--down");
  fill.style.width = pct + "%";

  track.appendChild(fill);
  row.appendChild(top);
  row.appendChild(track);
  return row;
}

/**
 * Visual-first summary block. Strip lengths use max(|Δ|) this screen (min scale 10 pts);
 * labeled values are always the real rounded deltas from the event payload.
 */
function buildSummaryVisualBoard(opts) {
  var root = document.createElement("div");
  root.className = "summary-visual-root";

  var idLine = document.createElement("p");
  idLine.className = "summary-visual-id";
  idLine.textContent = "Recap · " + (opts.identityName || "you");
  root.appendChild(idLine);

  var hero = document.createElement("div");
  hero.className = "summary-choice-hero";
  hero.textContent = opts.choiceLabel || "—";
  root.appendChild(hero);

  var stack = document.createElement("div");
  stack.className = "summary-strip-stack";
  stack.setAttribute("role", "list");
  var maxAbs = computeSummaryStripMaxAbs(opts.strips);
  (opts.strips || []).forEach(function (s) {
    stack.appendChild(buildSummaryStripRow(s.label, s.delta, maxAbs));
  });
  root.appendChild(stack);

  if (opts.copingLabel) {
    var tag = document.createElement("div");
    tag.className = "summary-coping-tag";
    tag.textContent = opts.copingLabel;
    root.appendChild(tag);
  }

  if (opts.justificationUsesTotal > 0) {
    var chip = document.createElement("div");
    chip.className = "summary-justify-chip";
    chip.textContent = "Justify ×" + opts.justificationUsesTotal;
    chip.setAttribute(
      "title",
      "Times you picked justification-style coping this run."
    );
    root.appendChild(chip);
  }

  return root;
}

/**
 * Canonical belief delta from game events (`computeEpisodeDeltas`, reduction path):
 * `{ beliefId: string, beforeStrength: number, afterStrength: number }`.
 * Optional display line: first sentence of `BeliefSystem.getBelief(beliefId).coreClaim`.
 */
function prefersReducedMotionUi() {
  try {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch (e) {
    return false;
  }
}

function sortEpisodeBeliefChanges(changes, focalBeliefId) {
  const arr = (changes || []).filter(
    (c) =>
      c &&
      typeof c.beliefId === "string" &&
      typeof c.beforeStrength === "number" &&
      typeof c.afterStrength === "number"
  );
  arr.sort((a, b) => {
    if (focalBeliefId) {
      if (a.beliefId === focalBeliefId && b.beliefId !== focalBeliefId) return -1;
      if (b.beliefId === focalBeliefId && a.beliefId !== focalBeliefId) return 1;
    }
    const da = Math.abs(Math.round(a.afterStrength - a.beforeStrength));
    const db = Math.abs(Math.round(b.afterStrength - b.beforeStrength));
    if (db !== da) return db - da;
    return String(a.beliefId).localeCompare(String(b.beliefId));
  });
  return arr;
}

function mountBeliefChangeCard(change, beliefSystem, animate) {
  const before = Math.round(change.beforeStrength);
  const after = Math.round(change.afterStrength);
  const deltaPts = after - before;
  const belief = beliefSystem.getBelief(change.beliefId);
  const shortName = belief ? belief.coreClaim.split(".")[0] : change.beliefId;

  const card = document.createElement("article");
  card.className = "belief-change-card";
  card.dataset.beliefId = change.beliefId;
  const dirWord = deltaPts > 0 ? "Stronger" : deltaPts < 0 ? "Weaker" : "Unchanged";
  const dirIcon = deltaPts > 0 ? "↑" : deltaPts < 0 ? "↓" : "→";
  const absPts = Math.abs(deltaPts);
  card.setAttribute(
    "aria-label",
    shortName +
      ": belief strength was " +
      before +
      " percent, now " +
      after +
      " percent. " +
      dirWord +
      " by " +
      absPts +
      " points."
  );

  const title = document.createElement("h3");
  title.className = "belief-change-card__title";
  title.textContent = shortName;

  const direction = document.createElement("div");
  direction.className = "belief-change-card__direction";
  if (deltaPts > 0) direction.classList.add("belief-change-card__direction--stronger");
  if (deltaPts < 0) direction.classList.add("belief-change-card__direction--weaker");
  const ic = document.createElement("span");
  ic.className = "belief-change-card__dir-icon";
  ic.setAttribute("aria-hidden", "true");
  ic.textContent = dirIcon;
  const dirText = document.createElement("span");
  dirText.className = "belief-change-card__dir-text";
  dirText.textContent =
    dirWord + " · " + absPts + " pt" + (absPts === 1 ? "" : "s");
  direction.appendChild(ic);
  direction.appendChild(dirText);

  const lo = Math.min(before, after);
  const hi = Math.max(before, after);
  const bandW = Math.max(hi - lo, 1);

  const rail = document.createElement("div");
  rail.className = "belief-change-rail";
  rail.setAttribute("role", "presentation");

  const track = document.createElement("div");
  track.className = "belief-change-rail__track";

  const band = document.createElement("div");
  band.className = "belief-change-rail__band";
  band.style.left = lo + "%";
  band.style.width = bandW + "%";
  const motionOk = animate && !prefersReducedMotionUi();
  if (motionOk) band.style.opacity = "0";

  const nubBefore = document.createElement("div");
  nubBefore.className =
    "belief-change-rail__nub belief-change-rail__nub--before";
  nubBefore.style.left = before + "%";

  const nubAfter = document.createElement("div");
  nubAfter.className = "belief-change-rail__nub belief-change-rail__nub--after";
  nubAfter.style.left = before + "%";

  rail.appendChild(track);
  rail.appendChild(band);
  rail.appendChild(nubBefore);
  rail.appendChild(nubAfter);

  const numeric = document.createElement("p");
  numeric.className = "belief-change-card__numeric";
  const s1 = document.createElement("span");
  s1.textContent = "Before ";
  const b1 = document.createElement("strong");
  b1.textContent = before + "%";
  const mid = document.createElement("span");
  mid.textContent = " · Now ";
  const b2 = document.createElement("strong");
  b2.textContent = after + "%";
  numeric.appendChild(s1);
  numeric.appendChild(b1);
  numeric.appendChild(mid);
  numeric.appendChild(b2);

  card.appendChild(title);
  card.appendChild(direction);
  card.appendChild(rail);
  card.appendChild(numeric);

  if (!motionOk) {
    nubAfter.style.left = after + "%";
  } else {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        band.style.opacity = "1";
        nubAfter.style.left = after + "%";
      });
    });
  }

  return card;
}

function isLikelyEmail(v) {
  if (!v || typeof v !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

async function postRegistrationPayload(payload) {
  const endpoint = "/api/registrations";
  let res;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (networkError) {
    // Local file:// play mode has no API host; allow prototyping.
    if (typeof window !== "undefined" && window.location && window.location.protocol === "file:") {
      return {
        ok: true,
        registrationId: "local_" + Date.now().toString(36),
        message: "Saved locally in file mode."
      };
    }
    throw networkError;
  }
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch (_) {
    body = null;
  }
  if (!res.ok) {
    const detail =
      (body && (body.error || body.message)) ||
      (text && String(text).trim().slice(0, 400)) ||
      "";
    const hint = body && body.hint ? String(body.hint).trim() : "";
    let msg = detail
      ? detail
      : "Registration failed (HTTP " + res.status + ").";
    if (hint) msg = msg + " — " + hint;
    throw new Error(msg);
  }
  return body || {};
}

window.GameUI = GameUI;

