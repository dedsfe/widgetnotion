(function () {
  const NOTION_CANVAS = {
    "notion-light": "#ffffff",
    "notion-dark": "#191919",
  };

  const POMODORO_RUNTIME_MODES = {
    focus: {
      label: "Pomodoro",
      hint: "sessao de foco",
      inputKey: "focusLength",
    },
    short: {
      label: "Short Break",
      hint: "pausa curta",
      inputKey: "shortBreakLength",
    },
    long: {
      label: "Long Break",
      hint: "pausa longa",
      inputKey: "longBreakLength",
    },
  };

  const COMMON_FIELDS = [
    {
      key: "canvas",
      label: "Fundo no Notion",
      type: "select",
      section: "No Notion",
      options: [
        { value: "notion-light", label: "Notion Light" },
        { value: "notion-dark", label: "Notion Dark" },
      ],
    },
    {
      key: "style",
      label: "Preset visual",
      type: "select",
      section: "Direção",
      options: [
        { value: "soft", label: "Soft" },
        { value: "glass", label: "Glass" },
        { value: "brutal", label: "Brutal" },
        { value: "editorial", label: "Editorial" },
        { value: "minimal", label: "Minimal" },
      ],
    },
    {
      key: "surface",
      label: "Surface",
      type: "select",
      section: "Direção",
      options: [
        { value: "gradient", label: "Gradient" },
        { value: "solid", label: "Solid" },
        { value: "quiet", label: "Quiet" },
      ],
    },
    {
      key: "texture",
      label: "Textura",
      type: "select",
      section: "Direção",
      options: [
        { value: "none", label: "None" },
        { value: "grid", label: "Grid" },
        { value: "noise", label: "Noise" },
      ],
    },
    {
      key: "font",
      label: "Fonte",
      type: "select",
      section: "Direção",
      options: [
        { value: "grotesk", label: "Grotesk" },
        { value: "mono", label: "Mono" },
        { value: "serif", label: "Serif" },
        { value: "sora", label: "Sora" },
        { value: "manrope", label: "Manrope" },
        { value: "outfit", label: "Outfit" },
        { value: "syne", label: "Syne" },
        { value: "intertight", label: "Inter Tight" },
        { value: "archivo", label: "Archivo Narrow" },
        { value: "bebas", label: "Bebas Neue" },
        { value: "playfair", label: "Playfair Display" },
        { value: "cormorant", label: "Cormorant Garamond" },
      ],
    },
    {
      key: "align",
      label: "Alinhamento",
      type: "select",
      section: "Direção",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
      ],
    },
    {
      key: "blur",
      label: "Blur no card",
      type: "checkbox",
      section: "Aparência",
    },
    {
      key: "border",
      label: "Borda",
      type: "select",
      section: "Aparência",
      options: [
        { value: "line", label: "Line" },
        { value: "none", label: "None" },
        { value: "frame", label: "Frame" },
        { value: "accent", label: "Accent" },
      ],
    },
    {
      key: "shadow",
      label: "Sombra",
      type: "select",
      section: "Aparência",
      options: [
        { value: "soft", label: "Soft" },
        { value: "none", label: "None" },
        { value: "deep", label: "Deep" },
      ],
    },
    { key: "bg", label: "Fundo do widget", type: "color", section: "Aparência" },
    { key: "text", label: "Texto", type: "color", section: "Aparência" },
    { key: "accent", label: "Accent", type: "color", section: "Aparência" },
    {
      key: "radius",
      label: "Radius",
      type: "range",
      section: "Aparência",
      min: 12,
      max: 40,
      step: 1,
      suffix: "px",
    },
    {
      key: "padding",
      label: "Padding",
      type: "range",
      section: "Aparência",
      min: 18,
      max: 40,
      step: 1,
      suffix: "px",
    },
    {
      key: "titleScale",
      label: "Escala do título",
      type: "range",
      section: "Aparência",
      min: 0.85,
      max: 1.35,
      step: 0.01,
      suffix: "x",
    },
    {
      key: "scale",
      label: "Escala",
      type: "range",
      section: "Aparência",
      min: 0.9,
      max: 1.15,
      step: 0.01,
      suffix: "x",
    },
  ];

  const WIDGETS = {
    pomodoro: {
      name: "Pomodoro",
      kicker: "Interactive Widget",
      interactive: true,
      description: "Timer interativo para iniciar, pausar, resetar e ajustar tempos no proprio embed.",
      defaults: {
        canvas: "notion-light",
        style: "soft",
        surface: "gradient",
        texture: "none",
        font: "grotesk",
        align: "left",
        blur: true,
        border: "line",
        shadow: "soft",
        bg: "#121716",
        text: "#f4efe8",
        accent: "#c8ff62",
        radius: 28,
        padding: 26,
        titleScale: 1,
        scale: 1,
        title: "Pomofocus",
        focusLength: 25,
        shortBreakLength: 5,
        longBreakLength: 15,
        initialMode: "focus",
        layout: "stack",
        timerStyle: "digits",
        controlsStyle: "filled",
        showInputs: true,
        showStatus: true,
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        {
          key: "focusLength",
          label: "Pomodoro (min)",
          type: "number",
          section: "Conteúdo",
          min: 1,
          max: 90,
          step: 1,
        },
        {
          key: "shortBreakLength",
          label: "Short Break (min)",
          type: "number",
          section: "Conteúdo",
          min: 1,
          max: 30,
          step: 1,
        },
        {
          key: "longBreakLength",
          label: "Long Break (min)",
          type: "number",
          section: "Conteúdo",
          min: 1,
          max: 60,
          step: 1,
        },
        {
          key: "initialMode",
          label: "Modo inicial",
          type: "select",
          section: "Conteúdo",
          options: [
            { value: "focus", label: "Pomodoro" },
            { value: "short", label: "Short Break" },
            { value: "long", label: "Long Break" },
          ],
        },
        {
          key: "layout",
          label: "Layout do card",
          type: "select",
          section: "Pomodoro",
          options: [
            { value: "stack", label: "Stack" },
            { value: "split", label: "Split" },
          ],
        },
        {
          key: "timerStyle",
          label: "Estilo do timer",
          type: "select",
          section: "Pomodoro",
          options: [
            { value: "digits", label: "Digits" },
            { value: "ring", label: "Ring" },
          ],
        },
        {
          key: "controlsStyle",
          label: "Estilo dos botões",
          type: "select",
          section: "Pomodoro",
          options: [
            { value: "filled", label: "Filled" },
            { value: "outline", label: "Outline" },
            { value: "ghost", label: "Ghost" },
          ],
        },
        {
          key: "showInputs",
          label: "Mostrar ajustes de tempo",
          type: "checkbox",
          section: "Pomodoro",
        },
        {
          key: "showStatus",
          label: "Mostrar status",
          type: "checkbox",
          section: "Pomodoro",
        },
      ],
    },
    countdown: {
      name: "Countdown",
      kicker: "Deadline Widget",
      interactive: false,
      description: "Contagem regressiva passiva para prazos, lancamentos e marcos.",
      defaults: {
        canvas: "notion-light",
        style: "glass",
        surface: "gradient",
        texture: "grid",
        font: "grotesk",
        align: "left",
        blur: true,
        border: "line",
        shadow: "soft",
        bg: "#10161c",
        text: "#eef5fb",
        accent: "#7bddff",
        radius: 28,
        padding: 26,
        titleScale: 1,
        scale: 1,
        title: "Launch Window",
        target: "2026-12-31T18:00",
        note: "rollout interno",
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        {
          key: "target",
          label: "Data alvo",
          type: "datetime-local",
          section: "Conteúdo",
        },
        {
          key: "note",
          label: "Contexto",
          type: "text",
          section: "Conteúdo",
        },
      ],
    },
    quote: {
      name: "Daily Note",
      kicker: "Editorial Widget",
      interactive: false,
      description: "Bloco editorial estatico para mantra, instrução curta ou frase do dia.",
      defaults: {
        canvas: "notion-light",
        style: "brutal",
        surface: "solid",
        texture: "none",
        font: "grotesk",
        align: "left",
        blur: true,
        border: "accent",
        shadow: "soft",
        bg: "#15100d",
        text: "#fff3ea",
        accent: "#ffb581",
        radius: 28,
        padding: 26,
        titleScale: 1,
        scale: 1,
        title: "Daily Quote",
        quote: "Make it quieter until the work speaks.",
        author: "studio note",
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        {
          key: "quote",
          label: "Texto",
          type: "textarea",
          section: "Conteúdo",
        },
        {
          key: "author",
          label: "Assinatura",
          type: "text",
          section: "Conteúdo",
        },
      ],
    },
  };

  const page = document.body.dataset.page;
  if (page === "editor") {
    initEditor();
  } else if (page === "embed") {
    initEmbed();
  }

  function initEditor() {
    const params = new URLSearchParams(window.location.search);
    const widgetKey = getWidgetKey(params.get("widget"));
    let state = buildState(widgetKey, params);

    const form = document.getElementById("widget-form");
    const previewFrame = document.getElementById("preview-frame");
    const embedUrlInput = document.getElementById("embed-url");
    const copyButton = document.getElementById("copy-url-button");
    const openEmbedLink = document.getElementById("open-embed-link");
    const widgetName = document.getElementById("widget-name");
    const widgetKicker = document.getElementById("widget-kicker");
    const embedBehaviorNote = document.getElementById("embed-behavior-note");

    widgetName.textContent = WIDGETS[widgetKey].name;
    widgetKicker.textContent = WIDGETS[widgetKey].kicker;
    embedBehaviorNote.textContent = getEmbedBehaviorCopy(widgetKey);

    form.innerHTML = renderForm(widgetKey, state);

    const sync = () => {
      state = readFormState(widgetKey, form);
      updateRangeHints(form, widgetKey, state);

      const nextParams = new URLSearchParams();
      nextParams.set("widget", widgetKey);
      getAllFields(widgetKey).forEach((field) => {
        const value = state[field.key];
        if (value !== undefined && value !== null && value !== "") {
          nextParams.set(field.key, String(value));
        }
      });

      const embedUrl = new URL("embed.html", window.location.href);
      embedUrl.search = nextParams.toString();

      previewFrame.src = `embed.html?${nextParams.toString()}`;
      embedUrlInput.value = embedUrl.toString();
      openEmbedLink.href = embedUrl.toString();

      const editorUrl = new URL("editor.html", window.location.href);
      editorUrl.search = nextParams.toString();
      window.history.replaceState({}, "", editorUrl);
    };

    form.addEventListener("input", sync);
    form.addEventListener("change", sync);

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(embedUrlInput.value);
        const previous = copyButton.textContent;
        copyButton.textContent = "URL copiada";
        window.setTimeout(() => {
          copyButton.textContent = previous;
        }, 1500);
      } catch (error) {
        copyButton.textContent = "Copie manualmente";
      }
    });

    updateRangeHints(form, widgetKey, state);
    sync();
  }

  function initEmbed() {
    const params = new URLSearchParams(window.location.search);
    const widgetKey = getWidgetKey(params.get("widget"));
    const state = buildState(widgetKey, params);
    const root = document.getElementById("embed-root");
    const canvasColor = NOTION_CANVAS[state.canvas] || NOTION_CANVAS["notion-light"];

    root.innerHTML = renderWidget(widgetKey, state);
    root.style.setProperty("--embed-width", `${getWidgetWidth(widgetKey, state)}px`);
    document.body.style.setProperty("--embed-bg", canvasColor);
    document.documentElement.style.backgroundColor = canvasColor;
    document.documentElement.style.minHeight = "0";
    document.documentElement.style.height = "auto";
    document.body.style.minHeight = "0";
    document.body.style.height = "auto";

    const shell = root.querySelector(".widget-shell");
    shell.style.setProperty("--widget-bg", state.bg);
    shell.style.setProperty("--widget-text", state.text);
    shell.style.setProperty("--widget-accent", state.accent);
    shell.style.setProperty("--widget-radius", `${state.radius}px`);
    shell.style.setProperty("--widget-pad", `${state.padding}px`);
    shell.style.setProperty("--widget-title-scale", String(state.titleScale));
    shell.style.setProperty("--widget-scale", String(state.scale));

    if (widgetKey === "pomodoro") {
      hydratePomodoro(root, state);
    }
    if (widgetKey === "countdown") {
      hydrateCountdown(root, state);
    }
  }

  function getWidgetKey(candidate) {
    return Object.prototype.hasOwnProperty.call(WIDGETS, candidate) ? candidate : "pomodoro";
  }

  function buildState(widgetKey, params) {
    const widget = WIDGETS[widgetKey];
    const state = { ...widget.defaults };

    getAllFields(widgetKey).forEach((field) => {
      const raw = params.get(field.key);
      if (raw === null) {
        return;
      }
      if (field.type === "checkbox") {
        state[field.key] = raw === "true" || raw === "1";
        return;
      }
      if (field.type === "number" || field.type === "range") {
        const numeric = Number(raw);
        if (!Number.isNaN(numeric)) {
          state[field.key] = numeric;
        }
        return;
      }
      state[field.key] = raw;
    });

    return state;
  }

  function getAllFields(widgetKey) {
    return [...COMMON_FIELDS, ...WIDGETS[widgetKey].fields];
  }

  function renderForm(widgetKey, state) {
    const fields = getAllFields(widgetKey);
    const sections = new Map();

    fields.forEach((field) => {
      const items = sections.get(field.section) || [];
      items.push(field);
      sections.set(field.section, items);
    });

    return Array.from(sections.entries())
      .map(([sectionName, sectionFields]) => {
        const twoColumns = sectionFields.filter(isCompactField).length >= 2;
        return `
          <section class="panel-section">
            <div class="panel-heading">
              <h2>${sectionName}</h2>
              <p>${sectionCopy(sectionName, widgetKey)}</p>
            </div>
            <div class="field-grid ${twoColumns ? "two-columns" : ""}">
              ${sectionFields.map((field) => renderField(field, state[field.key])).join("")}
            </div>
          </section>
        `;
      })
      .join("");
  }

  function sectionCopy(sectionName, widgetKey) {
    if (sectionName === "No Notion") {
      return "Cor do iframe para sumir no fundo claro ou escuro do Notion.";
    }
    if (sectionName === "Direção") {
      return "Escolha a linguagem visual do card antes dos ajustes finos.";
    }
    if (sectionName === "Aparência") {
      return "Controles finos para levar o card de limpo até dramático.";
    }
    if (sectionName === "Conteúdo") {
      if (WIDGETS[widgetKey].interactive) {
        return "Esse widget continua funcional no Notion. Defina aqui os tempos iniciais e o visual do card.";
      }
      return "No Notion o widget é só leitura. Ajuste aqui tudo o que aparece no embed.";
    }
    if (sectionName === "Pomodoro") {
      return "Controles próprios do timer interativo.";
    }
    return WIDGETS[widgetKey].description;
  }

  function isCompactField(field) {
    return ["checkbox", "color", "number", "range", "select", "datetime-local"].includes(field.type);
  }

  function renderField(field, value) {
    const safeValue = escapeHtml(String(value ?? ""));
    const fieldClass =
      field.type === "textarea"
        ? "field field--wide"
        : field.type === "checkbox"
          ? "field field--toggle"
          : "field";
    if (field.type === "checkbox") {
      return `
        <label class="${fieldClass}">
          <span class="field-label">${field.label}</span>
          <input type="checkbox" name="${field.key}" ${value ? "checked" : ""} />
        </label>
      `;
    }
    if (field.type === "select") {
      return `
        <label class="${fieldClass}">
          <span class="field-label">${field.label}</span>
          <select name="${field.key}">
            ${field.options
              .map(
                (option) => `
                  <option value="${option.value}" ${option.value === value ? "selected" : ""}>
                    ${option.label}
                  </option>
                `
              )
              .join("")}
          </select>
        </label>
      `;
    }

    if (field.type === "textarea") {
      return `
        <label class="${fieldClass}">
          <span class="field-label">${field.label}</span>
          <textarea name="${field.key}">${safeValue}</textarea>
        </label>
      `;
    }

    if (field.type === "range") {
      return `
        <label class="${fieldClass}">
          <div class="range-meta">
            <span class="field-label">${field.label}</span>
            <span class="range-value" data-range-value="${field.key}"></span>
          </div>
          <input
            type="range"
            name="${field.key}"
            min="${field.min}"
            max="${field.max}"
            step="${field.step}"
            value="${safeValue}"
          />
        </label>
      `;
    }

    return `
      <label class="${fieldClass}">
        <span class="field-label">${field.label}</span>
        <input
          type="${field.type}"
          name="${field.key}"
          value="${safeValue}"
          ${field.min !== undefined ? `min="${field.min}"` : ""}
          ${field.max !== undefined ? `max="${field.max}"` : ""}
          ${field.step !== undefined ? `step="${field.step}"` : ""}
        />
      </label>
    `;
  }

  function readFormState(widgetKey, form) {
    const defaults = WIDGETS[widgetKey].defaults;
    const state = {};
    getAllFields(widgetKey).forEach((field) => {
      const input = form.elements[field.key];
      if (!input) {
        return;
      }
      let value = input.value;
      if (field.type === "checkbox") {
        state[field.key] = input.checked;
        return;
      }
      if (value === "") {
        state[field.key] = defaults[field.key];
        return;
      }
      if (field.type === "number" || field.type === "range") {
        const numeric = Number(value);
        value = Number.isNaN(numeric) ? defaults[field.key] : numeric;
      }
      state[field.key] = value;
    });
    return state;
  }

  function updateRangeHints(form, widgetKey, state) {
    getAllFields(widgetKey)
      .filter((field) => field.type === "range")
      .forEach((field) => {
        const target = form.querySelector(`[data-range-value="${field.key}"]`);
        if (!target) {
          return;
        }
        const suffix = field.suffix || "";
        target.textContent = `${state[field.key]}${suffix}`;
      });
  }

  function renderWidget(widgetKey, state) {
    const blurClass = state.blur ? "widget-blur-on" : "widget-blur-off";
    const shellClass = [
      "widget-shell",
      blurClass,
      `widget-style--${state.style}`,
      `widget-surface--${state.surface}`,
      `widget-texture--${state.texture}`,
      `widget-border--${state.border}`,
      `widget-shadow--${state.shadow}`,
      `widget-align--${state.align}`,
      `font-${state.font}`,
    ].join(" ");
    if (widgetKey === "pomodoro") {
      const initialMode = getPomodoroMode(state.initialMode);
      const focusLength = sanitizePomodoroMinutes("focus", state.focusLength, 25);
      const shortBreakLength = sanitizePomodoroMinutes("short", state.shortBreakLength, 5);
      const longBreakLength = sanitizePomodoroMinutes("long", state.longBreakLength, 15);
      const frameClass = [
        "widget-frame",
        "widget-frame--pomodoro",
        `pomodoro-layout--${state.layout}`,
        `pomodoro-timer-style--${state.timerStyle}`,
        `pomodoro-controls--${state.controlsStyle}`,
        state.showInputs ? "pomodoro-inputs-on" : "pomodoro-inputs-off",
        state.showStatus ? "pomodoro-status-on" : "pomodoro-status-off",
      ].join(" ");
      return `
        <section class="${shellClass}">
          <div
            class="${frameClass}"
            data-pomodoro-app
            data-initial-mode="${initialMode}"
            data-focus-length="${focusLength}"
            data-short-length="${shortBreakLength}"
            data-long-length="${longBreakLength}"
          >
            <header class="widget-head">
              <div class="widget-meta">
                <span class="widget-kicker">interactive pomodoro</span>
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              <span class="widget-chip">interactive</span>
            </header>
            <div class="pomodoro-main">
              <div class="pomodoro-primary">
                <div class="pomodoro-tabs" role="tablist" aria-label="Pomodoro modes">
                  ${renderPomodoroTab("focus", "Pomodoro", initialMode === "focus")}
                  ${renderPomodoroTab("short", "Short Break", initialMode === "short")}
                  ${renderPomodoroTab("long", "Long Break", initialMode === "long")}
                </div>
                <div class="pomodoro-display-shell">
                  <div class="pomodoro-ring" data-pomodoro-ring>
                    <div class="pomodoro-timer" data-pomodoro-display>25:00</div>
                  </div>
                </div>
                <p class="pomodoro-status" data-pomodoro-status>Pronto para começar.</p>
              </div>
              <div class="pomodoro-secondary">
                <div class="pomodoro-actions">
                  <button class="pomodoro-button pomodoro-button-primary" type="button" data-pomodoro-toggle>
                    Start
                  </button>
                  <button class="pomodoro-button" type="button" data-pomodoro-reset>
                    Reset
                  </button>
                </div>
                <div class="widget-divider pomodoro-divider"></div>
                <div class="pomodoro-config">
                  <label class="pomodoro-setting">
                    <span>Pomodoro</span>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      step="1"
                      value="${focusLength}"
                      data-pomodoro-length="focus"
                    />
                  </label>
                  <label class="pomodoro-setting">
                    <span>Short Break</span>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="1"
                      value="${shortBreakLength}"
                      data-pomodoro-length="short"
                    />
                  </label>
                  <label class="pomodoro-setting">
                    <span>Long Break</span>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      step="1"
                      value="${longBreakLength}"
                      data-pomodoro-length="long"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    if (widgetKey === "countdown") {
      return `
        <section class="${shellClass}">
          <div class="widget-frame">
            <header class="widget-head">
              <div class="widget-meta">
                <span class="widget-kicker">deadline countdown</span>
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              <span class="widget-chip">${escapeHtml(state.note)}</span>
            </header>
            <div class="countdown-grid">
              ${["Dias", "Horas", "Min", "Seg"]
                .map(
                  (label) => `
                    <div class="countdown-cell">
                      <strong class="countdown-value" data-countdown-value="${label.toLowerCase()}">00</strong>
                      <span class="countdown-label">${label}</span>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section class="${shellClass}">
        <div class="widget-frame">
          <header class="widget-head">
            <div class="widget-meta">
              <span class="widget-kicker">editorial note</span>
              <h1 class="widget-title">${escapeHtml(state.title)}</h1>
            </div>
            <span class="widget-chip">read only</span>
          </header>
          <div class="quote-details">
            <blockquote class="quote-block">
              <p class="quote-body">${escapeHtml(state.quote)}</p>
            </blockquote>
            <span class="quote-author">${escapeHtml(state.author)}</span>
          </div>
        </div>
      </section>
    `;
  }

  function hydratePomodoro(root, state) {
    const app = root.querySelector("[data-pomodoro-app]");
    if (!app) {
      return;
    }

    const refs = {
      display: app.querySelector("[data-pomodoro-display]"),
      ring: app.querySelector("[data-pomodoro-ring]"),
      status: app.querySelector("[data-pomodoro-status]"),
      toggle: app.querySelector("[data-pomodoro-toggle]"),
      reset: app.querySelector("[data-pomodoro-reset]"),
      tabs: Array.from(app.querySelectorAll("[data-pomodoro-tab]")),
      inputs: {
        focus: app.querySelector('[data-pomodoro-length="focus"]'),
        short: app.querySelector('[data-pomodoro-length="short"]'),
        long: app.querySelector('[data-pomodoro-length="long"]'),
      },
    };

    const runtime = {
      activeMode: getPomodoroMode(state.initialMode),
      durations: {
        focus: sanitizePomodoroMinutes("focus", state.focusLength, 25),
        short: sanitizePomodoroMinutes("short", state.shortBreakLength, 5),
        long: sanitizePomodoroMinutes("long", state.longBreakLength, 15),
      },
      remainingSeconds: 0,
      isRunning: false,
      intervalId: null,
    };

    runtime.remainingSeconds = runtime.durations[runtime.activeMode] * 60;

    const render = () => {
      refs.display.textContent = formatPomodoroTime(runtime.remainingSeconds);
      refs.status.textContent = getPomodoroStatusText(runtime);
      refs.toggle.textContent = getPomodoroToggleLabel(runtime);
      if (refs.ring) {
        refs.ring.style.setProperty("--progress", String(getPomodoroProgress(runtime)));
      }
      refs.tabs.forEach((tab) => {
        const mode = tab.dataset.pomodoroTab;
        const isActive = mode === runtime.activeMode;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-pressed", String(isActive));
      });
    };

    const clearTicker = () => {
      if (runtime.intervalId !== null) {
        window.clearInterval(runtime.intervalId);
        runtime.intervalId = null;
      }
    };

    const resetActiveMode = () => {
      runtime.remainingSeconds = runtime.durations[runtime.activeMode] * 60;
      runtime.isRunning = false;
      clearTicker();
      render();
    };

    const ensureTicker = () => {
      if (runtime.intervalId !== null) {
        return;
      }
      runtime.intervalId = window.setInterval(() => {
        if (!runtime.isRunning) {
          return;
        }
        if (runtime.remainingSeconds <= 0) {
          runtime.isRunning = false;
          clearTicker();
          render();
          return;
        }
        runtime.remainingSeconds -= 1;
        if (runtime.remainingSeconds <= 0) {
          runtime.remainingSeconds = 0;
          runtime.isRunning = false;
          clearTicker();
        }
        render();
      }, 1000);
    };

    refs.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        runtime.activeMode = getPomodoroMode(tab.dataset.pomodoroTab);
        resetActiveMode();
      });
    });

    refs.toggle.addEventListener("click", () => {
      if (runtime.remainingSeconds <= 0) {
        runtime.remainingSeconds = runtime.durations[runtime.activeMode] * 60;
      }
      runtime.isRunning = !runtime.isRunning;
      if (runtime.isRunning) {
        ensureTicker();
      } else {
        clearTicker();
      }
      render();
    });

    refs.reset.addEventListener("click", () => {
      resetActiveMode();
    });

    Object.entries(refs.inputs).forEach(([mode, input]) => {
      const syncDuration = (shouldCommitBlank) => {
        const rawValue = input.value.trim();
        if (!rawValue) {
          if (shouldCommitBlank) {
            input.value = String(runtime.durations[mode]);
          }
          return;
        }

        const nextMinutes = sanitizePomodoroMinutes(mode, rawValue, runtime.durations[mode]);
        runtime.durations[mode] = nextMinutes;
        input.value = String(nextMinutes);
        if (mode === runtime.activeMode) {
          resetActiveMode();
          return;
        }
        render();
      };

      input.addEventListener("input", () => syncDuration(false));
      input.addEventListener("change", () => syncDuration(true));
      input.addEventListener("blur", () => syncDuration(true));
    });

    render();
  }

  function hydrateCountdown(root, state) {
    const target = new Date(state.target).getTime();
    const nodes = {
      dias: root.querySelector('[data-countdown-value="dias"]'),
      horas: root.querySelector('[data-countdown-value="horas"]'),
      min: root.querySelector('[data-countdown-value="min"]'),
      seg: root.querySelector('[data-countdown-value="seg"]'),
    };

    const render = () => {
      const delta = Math.max(target - Date.now(), 0);
      const totalSeconds = Math.floor(delta / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      nodes.dias.textContent = String(days).padStart(2, "0");
      nodes.horas.textContent = String(hours).padStart(2, "0");
      nodes.min.textContent = String(minutes).padStart(2, "0");
      nodes.seg.textContent = String(seconds).padStart(2, "0");
    };

    render();
    window.setInterval(render, 1000);
  }

  function getPomodoroMode(mode) {
    return Object.prototype.hasOwnProperty.call(POMODORO_RUNTIME_MODES, mode) ? mode : "focus";
  }

  function sanitizePomodoroMinutes(mode, value, fallback) {
    const maxByMode = {
      focus: 90,
      short: 30,
      long: 60,
    };
    return sanitizeMinutes(value, fallback, maxByMode[mode] || 120);
  }

  function sanitizeMinutes(value, fallback, max = 120) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.min(max, Math.max(1, Math.round(numeric)));
  }

  function formatPomodoroTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function getPomodoroProgress(runtime) {
    const total = runtime.durations[runtime.activeMode] * 60;
    if (total <= 0) {
      return 100;
    }
    const elapsed = total - runtime.remainingSeconds;
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  }

  function getPomodoroStatusText(runtime) {
    const modeMeta = POMODORO_RUNTIME_MODES[runtime.activeMode];
    if (runtime.remainingSeconds <= 0) {
      return `${modeMeta.label} concluído.`;
    }
    if (runtime.isRunning) {
      return `${modeMeta.hint} em andamento.`;
    }
    if (runtime.remainingSeconds < runtime.durations[runtime.activeMode] * 60) {
      return `${modeMeta.hint} pausado.`;
    }
    return `${modeMeta.hint} pronto para começar.`;
  }

  function getPomodoroToggleLabel(runtime) {
    if (runtime.isRunning) {
      return "Pause";
    }
    if (runtime.remainingSeconds < runtime.durations[runtime.activeMode] * 60) {
      return "Resume";
    }
    return "Start";
  }

  function getEmbedBehaviorCopy(widgetKey) {
    if (WIDGETS[widgetKey].interactive) {
      return "No Notion esse widget continua funcional. Start, pause, reset e ajuste de tempo acontecem no próprio card.";
    }
    return "No Notion esse widget é só leitura. Mudanças de tempo, estado, texto e visual são feitas aqui no editor.";
  }

  function getWidgetWidth(widgetKey, state) {
    if (widgetKey === "pomodoro") {
      if (state.layout === "split") {
        return 720;
      }
      if (state.timerStyle === "ring") {
        return 620;
      }
      return 540;
    }
    if (widgetKey === "countdown") {
      return 620;
    }
    return 560;
  }

  function renderPomodoroTab(mode, label, isActive) {
    return `
      <button
        class="pomodoro-tab ${isActive ? "is-active" : ""}"
        type="button"
        data-pomodoro-tab="${mode}"
        aria-pressed="${isActive ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
