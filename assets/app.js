(function () {
  const NOTION_CANVAS = {
    "notion-light": "#ffffff",
    "notion-dark": "#191919",
  };

  const POMODORO_MODE_META = {
    focus: {
      label: "Focus",
      hint: "bloco atual",
    },
    break: {
      label: "Break",
      hint: "intervalo atual",
    },
    paused: {
      label: "Paused",
      hint: "aguardando retomada",
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
      label: "Style",
      type: "select",
      section: "Aparência",
      options: [
        { value: "soft", label: "Soft" },
        { value: "glass", label: "Glass" },
        { value: "brutal", label: "Brutal" },
      ],
    },
    {
      key: "font",
      label: "Fonte",
      type: "select",
      section: "Aparência",
      options: [
        { value: "grotesk", label: "Grotesk" },
        { value: "mono", label: "Mono" },
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
      name: "Pomodoro Status",
      kicker: "Status Widget",
      description: "Status visual de uma sessao de foco. O embed so exibe o estado atual.",
      defaults: {
        canvas: "notion-light",
        style: "soft",
        font: "grotesk",
        bg: "#121716",
        text: "#f4efe8",
        accent: "#c8ff62",
        radius: 28,
        scale: 1,
        title: "Deep Work",
        duration: 25,
        breakLength: 5,
        mode: "focus",
        remaining: "24:59",
        progress: 72,
        note: "Proxima pausa em 5 min",
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        {
          key: "duration",
          label: "Bloco de foco (min)",
          type: "number",
          section: "Conteúdo",
          min: 10,
          max: 90,
          step: 1,
        },
        {
          key: "breakLength",
          label: "Pausa (min)",
          type: "number",
          section: "Conteúdo",
          min: 1,
          max: 30,
          step: 1,
        },
        {
          key: "mode",
          label: "Modo exibido",
          type: "select",
          section: "Conteúdo",
          options: [
            { value: "focus", label: "Focus" },
            { value: "break", label: "Break" },
            { value: "paused", label: "Paused" },
          ],
        },
        {
          key: "remaining",
          label: "Tempo exibido",
          type: "text",
          section: "Conteúdo",
        },
        {
          key: "progress",
          label: "Progresso",
          type: "range",
          section: "Conteúdo",
          min: 0,
          max: 100,
          step: 1,
          suffix: "%",
        },
        {
          key: "note",
          label: "Linha auxiliar",
          type: "text",
          section: "Conteúdo",
        },
      ],
    },
    countdown: {
      name: "Countdown",
      kicker: "Deadline Widget",
      description: "Contagem regressiva passiva para prazos, lancamentos e marcos.",
      defaults: {
        canvas: "notion-light",
        style: "glass",
        font: "grotesk",
        bg: "#10161c",
        text: "#eef5fb",
        accent: "#7bddff",
        radius: 28,
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
      description: "Bloco editorial estatico para mantra, instrução curta ou frase do dia.",
      defaults: {
        canvas: "notion-light",
        style: "brutal",
        font: "grotesk",
        bg: "#15100d",
        text: "#fff3ea",
        accent: "#ffb581",
        radius: 28,
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

    widgetName.textContent = WIDGETS[widgetKey].name;
    widgetKicker.textContent = WIDGETS[widgetKey].kicker;

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
    shell.style.setProperty("--widget-scale", String(state.scale));

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
    if (sectionName === "Aparência") {
      return "Ajustes de visual compartilhados no link.";
    }
    if (sectionName === "Conteúdo") {
      return "No Notion o widget é só leitura. Ajuste aqui tudo o que aparece no embed.";
    }
    return WIDGETS[widgetKey].description;
  }

  function isCompactField(field) {
    return ["color", "number", "range", "select", "datetime-local"].includes(field.type);
  }

  function renderField(field, value) {
    const safeValue = escapeHtml(String(value ?? ""));
    const fieldClass = field.type === "textarea" ? "field field--wide" : "field";
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
    const shellClass = `widget-shell widget-style--${state.style} font-${state.font}`;
    if (widgetKey === "pomodoro") {
      const modeMeta = getPomodoroModeMeta(state.mode);
      const remaining = normalizeTimerValue(state.remaining);
      const progress = normalizeProgress(state.progress);
      return `
        <section class="${shellClass}">
          <div class="widget-frame">
            <header class="widget-head">
              <div class="widget-meta">
                <span class="widget-kicker">focus status</span>
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              <span class="widget-chip">${state.duration}/${state.breakLength}</span>
            </header>
            <div class="pomodoro-layout">
              <div class="ring" style="--progress: ${progress}">
                <div class="ring-time">${escapeHtml(remaining)}</div>
              </div>
              <div class="pomodoro-details">
                <div class="metric-line">
                  <span class="metric-strong">${modeMeta.label}</span>
                  <span class="metric-soft">${modeMeta.hint}</span>
                </div>
                <div class="widget-divider"></div>
                <p class="widget-footnote">${escapeHtml(state.note)}</p>
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

  function getPomodoroModeMeta(mode) {
    return POMODORO_MODE_META[mode] || POMODORO_MODE_META.focus;
  }

  function normalizeTimerValue(value) {
    const candidate = String(value ?? "").trim();
    return /^\d{1,3}:\d{2}$/.test(candidate) ? candidate : "25:00";
  }

  function normalizeProgress(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return 0;
    }
    return Math.min(100, Math.max(0, numeric));
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
