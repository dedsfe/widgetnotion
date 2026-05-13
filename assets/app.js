(function () {
  const NOTION_CANVAS = {
    "notion-light": "#ffffff",
    "notion-dark": "#191919",
  };

  const POMODORO_RUNTIME_MODES = {
    focus: {
      inputKey: "focusLength",
      labelKey: "focusLabel",
      hintKey: "focusHint",
    },
    short: {
      inputKey: "shortBreakLength",
      labelKey: "shortLabel",
      hintKey: "shortHint",
    },
    long: {
      inputKey: "longBreakLength",
      labelKey: "longLabel",
      hintKey: "longHint",
    },
  };

  const FONT_WEIGHT_OPTIONS = [
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semibold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Heavy" },
  ];

  const PREVIEW_MESSAGE_TYPE = "widget-preview:update";
  const PREVIEW_SYNC_DELAY = 60;
  const WEATHER_GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";
  const WEATHER_FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
  const WEATHER_CACHE_TTL = 10 * 60 * 1000;
  const WEATHER_CACHE = new Map();
  const STORAGE_NAMESPACE = "widgets-notion";
  const HABIT_SYNC_CHANNEL = `${STORAGE_NAMESPACE}:habit-sync`;
  const HABIT_SYNC_DEFAULT_ID = "rotina-principal";
  const CALENDAR_WEEKDAYS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
  const WEATHER_CODES = {
    0: { label: "Céu limpo", day: "☀️", night: "🌙" },
    1: { label: "Quase limpo", day: "🌤️", night: "🌙" },
    2: { label: "Parcialmente nublado", day: "⛅", night: "☁️" },
    3: { label: "Encoberto", day: "☁️", night: "☁️" },
    45: { label: "Neblina", day: "🌫️", night: "🌫️" },
    48: { label: "Neblina congelante", day: "🌫️", night: "🌫️" },
    51: { label: "Garoa leve", day: "🌦️", night: "🌦️" },
    53: { label: "Garoa moderada", day: "🌦️", night: "🌦️" },
    55: { label: "Garoa intensa", day: "🌧️", night: "🌧️" },
    56: { label: "Garoa gelada leve", day: "🌨️", night: "🌨️" },
    57: { label: "Garoa gelada intensa", day: "🌨️", night: "🌨️" },
    61: { label: "Chuva leve", day: "🌦️", night: "🌧️" },
    63: { label: "Chuva moderada", day: "🌧️", night: "🌧️" },
    65: { label: "Chuva forte", day: "🌧️", night: "🌧️" },
    66: { label: "Chuva gelada leve", day: "🌨️", night: "🌨️" },
    67: { label: "Chuva gelada forte", day: "🌨️", night: "🌨️" },
    71: { label: "Neve leve", day: "🌨️", night: "🌨️" },
    73: { label: "Neve moderada", day: "🌨️", night: "🌨️" },
    75: { label: "Neve forte", day: "❄️", night: "❄️" },
    77: { label: "Grãos de neve", day: "❄️", night: "❄️" },
    80: { label: "Pancadas leves", day: "🌦️", night: "🌧️" },
    81: { label: "Pancadas moderadas", day: "🌧️", night: "🌧️" },
    82: { label: "Pancadas fortes", day: "⛈️", night: "⛈️" },
    85: { label: "Nevasca leve", day: "🌨️", night: "🌨️" },
    86: { label: "Nevasca forte", day: "❄️", night: "❄️" },
    95: { label: "Trovoadas", day: "⛈️", night: "⛈️" },
    96: { label: "Trovoadas com granizo", day: "⛈️", night: "⛈️" },
    99: { label: "Trovoadas severas", day: "⛈️", night: "⛈️" },
  };

  const FONT_STYLESHEETS = {
    grotesk:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap",
    mono:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap",
    serif:
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
    sora:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap",
    manrope:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap",
    outfit:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap",
    syne:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700&display=swap",
    intertight:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter+Tight:wght@400;500;600;700&display=swap",
    archivo:
      "https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
    bebas:
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
    playfair:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Playfair+Display:wght@500;600;700&display=swap",
    cormorant:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
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
      key: "titleWeight",
      label: "Peso do título",
      type: "select",
      section: "Tipografia",
      options: FONT_WEIGHT_OPTIONS,
    },
    {
      key: "titleItalic",
      label: "Título em itálico",
      type: "checkbox",
      section: "Tipografia",
    },
    {
      key: "bodyWeight",
      label: "Peso do texto",
      type: "select",
      section: "Tipografia",
      options: FONT_WEIGHT_OPTIONS,
    },
    {
      key: "bodyItalic",
      label: "Texto em itálico",
      type: "checkbox",
      section: "Tipografia",
    },
    {
      key: "metaWeight",
      label: "Peso dos labels",
      type: "select",
      section: "Tipografia",
      options: FONT_WEIGHT_OPTIONS,
    },
    {
      key: "metaItalic",
      label: "Labels em itálico",
      type: "checkbox",
      section: "Tipografia",
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

  const HABIT_SYNC_FIELDS = [
    {
      key: "syncHabits",
      label: "Conectar Flow + Tracker",
      type: "checkbox",
      section: "Conexão",
    },
    {
      key: "habitSyncId",
      label: "ID da conexão",
      type: "text",
      section: "Conexão",
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
        titleWeight: "700",
        titleItalic: false,
        bodyWeight: "500",
        bodyItalic: false,
        metaWeight: "500",
        metaItalic: false,
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
        kickerText: "",
        badgeText: "",
        focusLabel: "Pomodoro",
        shortLabel: "Short Break",
        longLabel: "Long Break",
        focusHint: "sessao de foco",
        shortHint: "pausa curta",
        longHint: "pausa longa",
        readySuffix: "pronto para começar.",
        runningSuffix: "em andamento.",
        pausedSuffix: "pausado.",
        completedSuffix: "concluído.",
        startLabel: "Start",
        pauseLabel: "Pause",
        resumeLabel: "Resume",
        resetLabel: "Reset",
        timerWeight: "700",
        timerItalic: false,
        buttonWeight: "700",
        buttonItalic: false,
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
        { key: "kickerText", label: "Texto superior", type: "text", section: "Texto" },
        { key: "badgeText", label: "Badge", type: "text", section: "Texto" },
        { key: "focusLabel", label: "Label Pomodoro", type: "text", section: "Texto" },
        { key: "shortLabel", label: "Label Short Break", type: "text", section: "Texto" },
        { key: "longLabel", label: "Label Long Break", type: "text", section: "Texto" },
        { key: "focusHint", label: "Texto base Pomodoro", type: "text", section: "Texto" },
        { key: "shortHint", label: "Texto base Short Break", type: "text", section: "Texto" },
        { key: "longHint", label: "Texto base Long Break", type: "text", section: "Texto" },
        { key: "readySuffix", label: "Sufixo pronto", type: "text", section: "Texto" },
        { key: "runningSuffix", label: "Sufixo rodando", type: "text", section: "Texto" },
        { key: "pausedSuffix", label: "Sufixo pausado", type: "text", section: "Texto" },
        { key: "completedSuffix", label: "Sufixo concluído", type: "text", section: "Texto" },
        { key: "startLabel", label: "Texto Start", type: "text", section: "Texto" },
        { key: "pauseLabel", label: "Texto Pause", type: "text", section: "Texto" },
        { key: "resumeLabel", label: "Texto Resume", type: "text", section: "Texto" },
        { key: "resetLabel", label: "Texto Reset", type: "text", section: "Texto" },
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
          key: "timerWeight",
          label: "Peso do timer",
          type: "select",
          section: "Pomodoro",
          options: FONT_WEIGHT_OPTIONS,
        },
        {
          key: "timerItalic",
          label: "Timer em itálico",
          type: "checkbox",
          section: "Pomodoro",
        },
        {
          key: "buttonWeight",
          label: "Peso dos botões",
          type: "select",
          section: "Pomodoro",
          options: FONT_WEIGHT_OPTIONS,
        },
        {
          key: "buttonItalic",
          label: "Botões em itálico",
          type: "checkbox",
          section: "Pomodoro",
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
        titleWeight: "700",
        titleItalic: false,
        bodyWeight: "500",
        bodyItalic: false,
        metaWeight: "500",
        metaItalic: false,
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
        kickerText: "",
        daysLabel: "Dias",
        hoursLabel: "Horas",
        minutesLabel: "Min",
        secondsLabel: "Seg",
        target: "2026-12-31T18:00",
        note: "rollout interno",
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        { key: "kickerText", label: "Texto superior", type: "text", section: "Texto" },
        { key: "daysLabel", label: "Label dias", type: "text", section: "Texto" },
        { key: "hoursLabel", label: "Label horas", type: "text", section: "Texto" },
        { key: "minutesLabel", label: "Label minutos", type: "text", section: "Texto" },
        { key: "secondsLabel", label: "Label segundos", type: "text", section: "Texto" },
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
    weather: {
      name: "Clima",
      kicker: "Weather Widget",
      interactive: true,
      description: "Clima ao vivo por cidade, com refresh direto no próprio embed.",
      defaults: {
        canvas: "notion-light",
        style: "minimal",
        surface: "quiet",
        texture: "none",
        font: "sora",
        align: "left",
        titleWeight: "700",
        titleItalic: false,
        bodyWeight: "500",
        bodyItalic: false,
        metaWeight: "500",
        metaItalic: false,
        blur: true,
        border: "line",
        shadow: "soft",
        bg: "#101720",
        text: "#f4f7fb",
        accent: "#7bd7ff",
        radius: 28,
        padding: 26,
        titleScale: 1,
        scale: 1,
        title: "Clima",
        kickerText: "",
        badgeText: "",
        city: "São Paulo",
        countryCode: "",
        temperatureUnit: "celsius",
        icon: "☁️",
        temperature: "24",
        condition: "Parcialmente nublado",
        highLabel: "Máx",
        lowLabel: "Mín",
        stampLabel: "Momento",
        highTemp: "28",
        lowTemp: "19",
        stamp: "Hoje",
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        { key: "city", label: "Cidade", type: "text", section: "Conteúdo" },
        { key: "countryCode", label: "País (ISO)", type: "text", section: "Conteúdo" },
        {
          key: "temperatureUnit",
          label: "Unidade",
          type: "select",
          section: "Conteúdo",
          options: [
            { value: "celsius", label: "Celsius" },
            { value: "fahrenheit", label: "Fahrenheit" },
          ],
        },
        { key: "kickerText", label: "Texto superior", type: "text", section: "Texto" },
        { key: "badgeText", label: "Badge", type: "text", section: "Texto" },
        { key: "highLabel", label: "Label máxima", type: "text", section: "Texto" },
        { key: "lowLabel", label: "Label mínima", type: "text", section: "Texto" },
        { key: "stampLabel", label: "Label momento", type: "text", section: "Texto" },
      ],
    },
    progress: {
      name: "Progress",
      kicker: "Goal Widget",
      interactive: true,
      description: "Meta funcional com ajuste de progresso direto no card.",
      defaults: {
        canvas: "notion-light",
        style: "soft",
        surface: "gradient",
        texture: "none",
        font: "outfit",
        align: "left",
        titleWeight: "700",
        titleItalic: false,
        bodyWeight: "500",
        bodyItalic: false,
        metaWeight: "500",
        metaItalic: false,
        blur: true,
        border: "line",
        shadow: "soft",
        bg: "#161418",
        text: "#f7f1ec",
        accent: "#ff8b5f",
        radius: 28,
        padding: 26,
        titleScale: 1,
        scale: 1,
        title: "Monthly Goal",
        kickerText: "",
        badgeText: "",
        current: 72,
        total: 100,
        unit: "%",
        stepAmount: 1,
        note: "Fechamento do trimestre",
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        {
          key: "current",
          label: "Atual",
          type: "number",
          section: "Conteúdo",
          min: 0,
          max: 9999,
          step: 1,
        },
        {
          key: "total",
          label: "Total",
          type: "number",
          section: "Conteúdo",
          min: 1,
          max: 9999,
          step: 1,
        },
        { key: "unit", label: "Unidade", type: "text", section: "Conteúdo" },
        {
          key: "stepAmount",
          label: "Passo por clique",
          type: "number",
          section: "Conteúdo",
          min: 1,
          max: 1000,
          step: 1,
        },
        { key: "note", label: "Nota", type: "text", section: "Conteúdo" },
        { key: "kickerText", label: "Texto superior", type: "text", section: "Texto" },
        { key: "badgeText", label: "Badge", type: "text", section: "Texto" },
      ],
    },
    habits: {
      name: "Habit Flow",
      kicker: "Interactive Widget",
      interactive: true,
      description: "Checklist editável para criar, organizar e marcar hábitos no próprio embed.",
      defaults: {
        canvas: "notion-light",
        style: "editorial",
        surface: "quiet",
        texture: "grid",
        font: "manrope",
        align: "left",
        titleWeight: "700",
        titleItalic: false,
        bodyWeight: "500",
        bodyItalic: false,
        metaWeight: "500",
        metaItalic: false,
        blur: true,
        border: "line",
        shadow: "soft",
        bg: "#121713",
        text: "#f3f1e8",
        accent: "#86f08f",
        radius: 28,
        padding: 26,
        titleScale: 1,
        scale: 1,
        title: "Habit Flow",
        kickerText: "",
        badgeText: "",
        introText: "Rotina do dia",
        habitsText: "Água\nTreino\nLeitura\nDeep work",
        checkedText: "1,3",
        syncHabits: false,
        habitSyncId: HABIT_SYNC_DEFAULT_ID,
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        { key: "introText", label: "Texto auxiliar", type: "text", section: "Conteúdo" },
        {
          key: "habitsText",
          label: "Hábitos (um por linha)",
          type: "textarea",
          section: "Conteúdo",
        },
        {
          key: "checkedText",
          label: "Marcados inicialmente",
          type: "text",
          section: "Conteúdo",
        },
        { key: "kickerText", label: "Texto superior", type: "text", section: "Texto" },
        { key: "badgeText", label: "Badge", type: "text", section: "Texto" },
        ...HABIT_SYNC_FIELDS,
      ],
    },
    "habit-tracker": {
      name: "Habit Tracker",
      kicker: "Dashboard Widget",
      interactive: true,
      description: "Dashboard visual dos hábitos, conectado opcionalmente ao Habit Flow.",
      defaults: {
        canvas: "notion-light",
        style: "minimal",
        surface: "quiet",
        texture: "none",
        font: "sora",
        align: "left",
        titleWeight: "700",
        titleItalic: false,
        bodyWeight: "500",
        bodyItalic: false,
        metaWeight: "500",
        metaItalic: false,
        blur: true,
        border: "line",
        shadow: "soft",
        bg: "#f8f5ee",
        text: "#111111",
        accent: "#6ccf79",
        radius: 28,
        padding: 26,
        titleScale: 1,
        scale: 1,
        title: "Habit Tracker",
        kickerText: "",
        badgeText: "",
        introText: "Progresso de hoje",
        completeLabel: "concluído",
        pendingLabel: "pendente",
        emptyLabel: "Sem hábitos conectados ainda.",
        habitsText: "Água\nTreino\nLeitura\nDeep work",
        checkedText: "1,3",
        syncHabits: false,
        habitSyncId: HABIT_SYNC_DEFAULT_ID,
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        { key: "introText", label: "Texto auxiliar", type: "text", section: "Conteúdo" },
        {
          key: "habitsText",
          label: "Hábitos base (standalone)",
          type: "textarea",
          section: "Conteúdo",
        },
        {
          key: "checkedText",
          label: "Marcados inicialmente",
          type: "text",
          section: "Conteúdo",
        },
        { key: "kickerText", label: "Texto superior", type: "text", section: "Texto" },
        { key: "badgeText", label: "Badge", type: "text", section: "Texto" },
        { key: "completeLabel", label: "Label concluído", type: "text", section: "Texto" },
        { key: "pendingLabel", label: "Label pendente", type: "text", section: "Texto" },
        { key: "emptyLabel", label: "Texto vazio", type: "text", section: "Texto" },
        ...HABIT_SYNC_FIELDS,
      ],
    },
    calendar: {
      name: "Mini Calendar",
      kicker: "Planning Widget",
      interactive: true,
      description: "Calendário navegável com destaque de dias direto no embed.",
      defaults: {
        canvas: "notion-light",
        style: "glass",
        surface: "quiet",
        texture: "grid",
        font: "intertight",
        align: "left",
        titleWeight: "700",
        titleItalic: false,
        bodyWeight: "500",
        bodyItalic: false,
        metaWeight: "500",
        metaItalic: false,
        blur: true,
        border: "line",
        shadow: "soft",
        bg: "#12161d",
        text: "#edf3f8",
        accent: "#8bd4ff",
        radius: 28,
        padding: 26,
        titleScale: 1,
        scale: 1,
        title: "Month View",
        kickerText: "",
        badgeText: "",
        monthValue: formatMonthValue(new Date()),
        note: "Sprint checkpoints",
        highlightsText: "3,7,12,18,24",
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        { key: "monthValue", label: "Mês", type: "month", section: "Conteúdo" },
        { key: "note", label: "Nota", type: "text", section: "Conteúdo" },
        {
          key: "highlightsText",
          label: "Dias destacados",
          type: "text",
          section: "Conteúdo",
        },
        { key: "kickerText", label: "Texto superior", type: "text", section: "Texto" },
        { key: "badgeText", label: "Badge", type: "text", section: "Texto" },
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
        titleWeight: "700",
        titleItalic: false,
        bodyWeight: "500",
        bodyItalic: false,
        metaWeight: "500",
        metaItalic: false,
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
        kickerText: "",
        badgeText: "",
        quote: "Make it quieter until the work speaks.",
        author: "studio note",
      },
      fields: [
        { key: "title", label: "Título", type: "text", section: "Conteúdo" },
        { key: "kickerText", label: "Texto superior", type: "text", section: "Texto" },
        { key: "badgeText", label: "Badge", type: "text", section: "Texto" },
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
    let previewReady = false;
    let previewTimer = null;

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

    const pushPreviewState = () => {
      if (!previewReady || !previewFrame.contentWindow) {
        return;
      }
      previewFrame.contentWindow.postMessage(
        {
          type: PREVIEW_MESSAGE_TYPE,
          widgetKey,
          state,
        },
        window.location.origin
      );
    };

    const schedulePreviewUpdate = () => {
      window.clearTimeout(previewTimer);
      previewTimer = window.setTimeout(pushPreviewState, PREVIEW_SYNC_DELAY);
    };

    previewFrame.addEventListener("load", () => {
      previewReady = true;
      pushPreviewState();
    });

    const sync = () => {
      state = readFormState(widgetKey, form);
      updateRangeHints(form, widgetKey, state);

      const nextParams = serializeWidgetState(widgetKey, state);

      const embedUrl = new URL("embed.html", window.location.href);
      embedUrl.search = nextParams.toString();

      embedUrlInput.value = embedUrl.toString();
      openEmbedLink.href = embedUrl.toString();
      schedulePreviewUpdate();

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
    const previewParams = serializeWidgetState(widgetKey, state);
    previewParams.set("preview", "1");
    previewFrame.src = `embed.html?${previewParams.toString()}`;
    sync();
  }

  function initEmbed() {
    const params = new URLSearchParams(window.location.search);
    const isPreview = params.get("preview") === "1";
    let widgetKey = getWidgetKey(params.get("widget"));
    let state = buildState(widgetKey, params);
    const root = document.getElementById("embed-root");
    let cleanup = null;

    const mount = (nextWidgetKey, nextState) => {
      if (typeof cleanup === "function") {
        cleanup();
        cleanup = null;
      }

      widgetKey = nextWidgetKey;
      state = normalizeState(widgetKey, nextState);
      ensureFontStylesheet(document, state.font);

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
      applyWidgetShellStyles(shell, state);

      if (widgetKey === "pomodoro") {
        cleanup = hydratePomodoro(root, state, { preview: isPreview });
      } else if (widgetKey === "countdown") {
        cleanup = hydrateCountdown(root, state, { preview: isPreview });
      } else if (widgetKey === "weather") {
        cleanup = hydrateWeather(root, state, { preview: isPreview });
      } else if (widgetKey === "progress") {
        cleanup = hydrateProgress(root, state, { preview: isPreview });
      } else if (widgetKey === "habits") {
        cleanup = hydrateHabits(root, state, { preview: isPreview });
      } else if (widgetKey === "habit-tracker") {
        cleanup = hydrateHabitTracker(root, state, { preview: isPreview });
      } else if (widgetKey === "calendar") {
        cleanup = hydrateCalendar(root, state, { preview: isPreview });
      }
    };

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      const payload = event.data;
      if (!payload || payload.type !== PREVIEW_MESSAGE_TYPE) {
        return;
      }
      mount(getWidgetKey(payload.widgetKey), payload.state || {});
    });

    mount(widgetKey, state);
  }

  function getWidgetKey(candidate) {
    return Object.prototype.hasOwnProperty.call(WIDGETS, candidate) ? candidate : "pomodoro";
  }

  function normalizeState(widgetKey, rawState) {
    return { ...WIDGETS[widgetKey].defaults, ...(rawState || {}) };
  }

  function buildState(widgetKey, params) {
    const state = normalizeState(widgetKey);

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

  function serializeWidgetState(widgetKey, state) {
    const nextParams = new URLSearchParams();
    nextParams.set("widget", widgetKey);
    getAllFields(widgetKey).forEach((field) => {
      const value = state[field.key];
      if (
        value !== undefined &&
        value !== null &&
        (value !== "" || allowsEmptyParam(field))
      ) {
        nextParams.set(field.key, String(value));
      }
    });
    return nextParams;
  }

  function ensureFontStylesheet(targetDocument, fontKey) {
    const href = FONT_STYLESHEETS[fontKey] || FONT_STYLESHEETS.grotesk;
    let link = targetDocument.getElementById("widget-font-stylesheet");
    if (!link) {
      link = targetDocument.createElement("link");
      link.id = "widget-font-stylesheet";
      link.rel = "stylesheet";
      targetDocument.head.appendChild(link);
    }
    if (link.href !== href) {
      link.href = href;
    }
  }

  function applyWidgetShellStyles(shell, state) {
    shell.style.setProperty("--widget-bg", state.bg);
    shell.style.setProperty("--widget-text", state.text);
    shell.style.setProperty("--widget-accent", state.accent);
    shell.style.setProperty("--widget-radius", `${state.radius}px`);
    shell.style.setProperty("--widget-pad", `${state.padding}px`);
    shell.style.setProperty("--widget-title-scale", String(state.titleScale));
    shell.style.setProperty("--widget-scale", String(state.scale));
    shell.style.setProperty("--widget-title-weight", state.titleWeight);
    shell.style.setProperty("--widget-title-style", state.titleItalic ? "italic" : "normal");
    shell.style.setProperty("--widget-body-weight", state.bodyWeight);
    shell.style.setProperty("--widget-body-style", state.bodyItalic ? "italic" : "normal");
    shell.style.setProperty("--widget-meta-weight", state.metaWeight);
    shell.style.setProperty("--widget-meta-style", state.metaItalic ? "italic" : "normal");
    shell.style.setProperty("--widget-timer-weight", state.timerWeight || state.titleWeight);
    shell.style.setProperty("--widget-timer-style", state.timerItalic ? "italic" : "normal");
    shell.style.setProperty("--widget-button-weight", state.buttonWeight || state.bodyWeight);
    shell.style.setProperty("--widget-button-style", state.buttonItalic ? "italic" : "normal");
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
    if (sectionName === "Tipografia") {
      return "Peso e itálico para deixar os textos menos engessados.";
    }
    if (sectionName === "Conexão") {
      return "Ative nos dois widgets e use o mesmo ID para compartilhar hábitos e marcações.";
    }
    if (sectionName === "Conteúdo") {
      if (widgetKey === "pomodoro") {
        return "Esse widget continua funcional no Notion. Defina aqui os tempos iniciais e o visual do card.";
      }
      if (widgetKey === "weather") {
        return "Esse widget busca clima real pela cidade informada. O card atualiza sozinho ao abrir e pode ser recarregado no embed.";
      }
      if (widgetKey === "progress") {
        return "Esse widget continua funcional no Notion. Defina a meta inicial e depois ajuste o progresso direto no card.";
      }
      if (widgetKey === "habits") {
        return "Esse widget continua funcional no Notion. Defina a lista base e depois adicione, edite, remova e marque hábitos direto no embed.";
      }
      if (widgetKey === "habit-tracker") {
        return "Dashboard visual dos hábitos. Com a conexão ativa, ele lê o mesmo progresso do Habit Flow.";
      }
      if (widgetKey === "calendar") {
        return "Esse widget continua funcional no Notion. Escolha o mês inicial e os destaques base; o embed permite navegar e marcar dias.";
      }
      return "No Notion o widget é só leitura. Ajuste aqui tudo o que aparece no embed.";
    }
    if (sectionName === "Texto") {
      return "Tudo o que aparece escrito no card pode ser editado aqui.";
    }
    if (sectionName === "Pomodoro") {
      return "Controles próprios do timer interativo.";
    }
    return WIDGETS[widgetKey].description;
  }

  function isCompactField(field) {
    return ["checkbox", "color", "number", "range", "select", "datetime-local", "month", "text"].includes(field.type);
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
        if (allowsEmptyParam(field)) {
          state[field.key] = "";
          return;
        }
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

  function allowsEmptyParam(field) {
    return field.type === "text" || field.type === "textarea";
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
      const pomodoroCopy = getPomodoroCopy(state);
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
                ${renderOptionalText("span", "widget-kicker", state.kickerText)}
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              ${renderOptionalText("span", "widget-chip", state.badgeText)}
            </header>
            <div class="pomodoro-main">
              <div class="pomodoro-primary">
                <div class="pomodoro-tabs" role="tablist" aria-label="Pomodoro modes">
                  ${renderPomodoroTab("focus", pomodoroCopy.modes.focus.label, initialMode === "focus")}
                  ${renderPomodoroTab("short", pomodoroCopy.modes.short.label, initialMode === "short")}
                  ${renderPomodoroTab("long", pomodoroCopy.modes.long.label, initialMode === "long")}
                </div>
                <div class="pomodoro-display-shell">
                  <div class="pomodoro-ring" data-pomodoro-ring>
                    <div class="pomodoro-timer" data-pomodoro-display>25:00</div>
                  </div>
                </div>
                <p class="pomodoro-status" data-pomodoro-status>${escapeHtml(getPomodoroStatusText({
                  activeMode: initialMode,
                  durations: {
                    focus: focusLength,
                    short: shortBreakLength,
                    long: longBreakLength,
                  },
                  remainingSeconds: {
                    focus: focusLength,
                    short: shortBreakLength,
                    long: longBreakLength,
                  }[initialMode] * 60,
                  isRunning: false,
                }, pomodoroCopy))}</p>
              </div>
              <div class="pomodoro-secondary">
                <div class="pomodoro-actions">
                  <button class="pomodoro-button pomodoro-button-primary" type="button" data-pomodoro-toggle>
                    ${escapeHtml(pomodoroCopy.controls.start)}
                  </button>
                  <button class="pomodoro-button" type="button" data-pomodoro-reset>
                    ${escapeHtml(pomodoroCopy.controls.reset)}
                  </button>
                </div>
                <div class="widget-divider pomodoro-divider"></div>
                <div class="pomodoro-config">
                  <label class="pomodoro-setting">
                    <span>${escapeHtml(pomodoroCopy.modes.focus.label)}</span>
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
                    <span>${escapeHtml(pomodoroCopy.modes.short.label)}</span>
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
                    <span>${escapeHtml(pomodoroCopy.modes.long.label)}</span>
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
                ${renderOptionalText("span", "widget-kicker", state.kickerText)}
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              ${renderOptionalText("span", "widget-chip", state.note)}
            </header>
            <div class="countdown-grid">
              ${[
                { key: "dias", label: state.daysLabel || "Dias" },
                { key: "horas", label: state.hoursLabel || "Horas" },
                { key: "min", label: state.minutesLabel || "Min" },
                { key: "seg", label: state.secondsLabel || "Seg" },
              ]
                .map(
                  (item) => `
                    <div class="countdown-cell">
                      <strong class="countdown-value" data-countdown-value="${item.key}">00</strong>
                      <span class="countdown-label">${escapeHtml(item.label)}</span>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>
      `;
    }

    if (widgetKey === "weather") {
      return `
        <section class="${shellClass}">
          <div class="widget-frame widget-frame--weather" data-weather-app>
            <header class="widget-head">
              <div class="widget-meta">
                ${renderOptionalText("span", "widget-kicker", state.kickerText)}
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              ${renderOptionalText("span", "widget-chip", state.badgeText)}
            </header>
            <div class="weather-hero">
              <div class="weather-copy">
                <span class="weather-city" data-weather-city>${escapeHtml(state.city)}</span>
                <strong class="weather-temp" data-weather-temp>${escapeHtml(state.temperature)}°</strong>
                <p class="weather-condition" data-weather-condition>${escapeHtml(state.condition)}</p>
              </div>
              <div class="weather-aside">
                <div class="weather-icon" data-weather-icon>${escapeHtml(state.icon)}</div>
                <button
                  class="widget-icon-button weather-refresh"
                  type="button"
                  data-weather-refresh
                  aria-label="Atualizar clima"
                >
                  ↻
                </button>
              </div>
            </div>
            <div class="weather-stats">
              <div class="weather-stat">
                <span class="weather-stat-label">${escapeHtml(state.highLabel || "Máx")}</span>
                <strong data-weather-high>${escapeHtml(state.highTemp)}°</strong>
              </div>
              <div class="weather-stat">
                <span class="weather-stat-label">${escapeHtml(state.lowLabel || "Mín")}</span>
                <strong data-weather-low>${escapeHtml(state.lowTemp)}°</strong>
              </div>
              <div class="weather-stat">
                <span class="weather-stat-label">${escapeHtml(state.stampLabel || "Momento")}</span>
                <strong data-weather-stamp>${escapeHtml(state.stamp)}</strong>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    if (widgetKey === "progress") {
      const percent = getProgressPercent(state.current, state.total);
      return `
        <section class="${shellClass}">
          <div
            class="widget-frame widget-frame--progress"
            data-progress-app
            data-progress-current="${escapeHtml(String(state.current))}"
            data-progress-total="${escapeHtml(String(state.total))}"
            data-progress-step="${escapeHtml(String(state.stepAmount || 1))}"
          >
            <header class="widget-head">
              <div class="widget-meta">
                ${renderOptionalText("span", "widget-kicker", state.kickerText)}
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              ${renderOptionalText("span", "widget-chip", state.badgeText)}
            </header>
            <div class="progress-reading">
              <strong class="progress-numerator" data-progress-numerator>${escapeHtml(String(state.current))}${escapeHtml(state.unit)}</strong>
              <span class="progress-percent" data-progress-percent>${percent}%</span>
            </div>
            <div class="progress-bar">
              <span class="progress-bar-fill" data-progress-fill style="width: ${percent}%"></span>
            </div>
            <div class="progress-meta">
              <span class="progress-fraction" data-progress-fraction>${escapeHtml(String(state.current))}/${escapeHtml(String(state.total))}</span>
              <div class="progress-actions" aria-label="Ajustes de progresso">
                <button class="widget-icon-button" type="button" data-progress-action="decrement" aria-label="Diminuir">−</button>
                <button class="widget-icon-button is-primary" type="button" data-progress-action="increment" aria-label="Aumentar">+</button>
                <button class="widget-icon-button" type="button" data-progress-action="reset" aria-label="Resetar">↺</button>
              </div>
            </div>
            ${renderOptionalText("p", "progress-note", state.note)}
          </div>
        </section>
      `;
    }

    if (widgetKey === "habits") {
      const initialItems = buildInitialHabitItems(state);
      const initialCheckedIds = new Set(
        initialItems.filter((item) => item.done).map((item) => item.id)
      );
      return `
        <section class="${shellClass}">
          <div class="widget-frame widget-frame--habits" data-habit-app>
            <header class="widget-head">
              <div class="widget-meta">
                ${renderOptionalText("span", "widget-kicker", state.kickerText)}
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              ${renderOptionalText("span", "widget-chip", state.badgeText)}
            </header>
            ${renderOptionalText("p", "habit-intro", state.introText)}
            <div class="habit-progress">
              <div class="habit-progress-copy">
                <strong data-habit-count>${initialCheckedIds.size}/${initialItems.length}</strong>
                <span class="habit-date" data-habit-date>${escapeHtml(formatHabitDisplayDate(new Date()))}</span>
              </div>
              <div class="habit-actions">
                <button class="widget-icon-button" type="button" data-habit-edit-toggle aria-label="Editar hábitos">✎</button>
                <button class="widget-icon-button" type="button" data-habit-reset aria-label="Limpar marcações do dia">↺</button>
              </div>
            </div>
            <div class="habit-list" data-habit-list>
              ${renderHabitRows(initialItems, initialCheckedIds, false)}
            </div>
            <p class="habit-empty" data-habit-empty hidden>Nenhum hábito ainda.</p>
            <div class="habit-edit-panel" data-habit-edit-panel hidden>
              <form class="habit-add-form" data-habit-add-form>
                <input type="text" name="habitLabel" placeholder="Novo hábito" autocomplete="off" />
                <button class="widget-icon-button is-primary" type="submit" aria-label="Adicionar hábito">+</button>
              </form>
              <button class="habit-restore-button" type="button" data-habit-restore>Restaurar lista inicial</button>
            </div>
          </div>
        </section>
      `;
    }

    if (widgetKey === "habit-tracker") {
      const todayKey = getLocalDateKey(new Date());
      const initialItems = buildInitialHabitItems(state);
      const initialDataset = buildInitialHabitDataset(initialItems, todayKey);
      const metrics = getHabitMetrics(initialDataset, todayKey);
      return `
        <section class="${shellClass}">
          <div class="widget-frame widget-frame--habit-tracker" data-habit-tracker-app>
            <header class="widget-head">
              <div class="widget-meta">
                ${renderOptionalText("span", "widget-kicker", state.kickerText)}
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              ${renderOptionalText("span", "widget-chip", state.badgeText)}
            </header>
            ${renderOptionalText("p", "habit-intro", state.introText)}
            <div class="habit-tracker-hero">
              <div class="habit-tracker-ring" data-habit-tracker-ring style="--habit-tracker-progress: ${metrics.percent}%">
                <strong data-habit-tracker-percent>${metrics.percent}%</strong>
                <span>${escapeHtml(state.completeLabel)}</span>
              </div>
              <div class="habit-tracker-stats">
                <div>
                  <span>${escapeHtml(state.completeLabel)}</span>
                  <strong data-habit-tracker-done>${metrics.done}</strong>
                </div>
                <div>
                  <span>${escapeHtml(state.pendingLabel)}</span>
                  <strong data-habit-tracker-pending>${metrics.pending}</strong>
                </div>
              </div>
            </div>
            <div class="habit-tracker-week" data-habit-tracker-week>
              ${renderHabitTrackerWeek(initialDataset, todayKey)}
            </div>
            <div class="habit-tracker-list" data-habit-tracker-list>
              ${renderHabitTrackerRows(initialDataset, todayKey, state)}
            </div>
            <p class="habit-empty" data-habit-tracker-empty ${initialDataset.items.length ? "hidden" : ""}>
              ${escapeHtml(state.emptyLabel)}
            </p>
          </div>
        </section>
      `;
    }

    if (widgetKey === "calendar") {
      const calendar = buildCalendarModel(state.monthValue, state.highlightsText);
      return `
        <section class="${shellClass}">
          <div
            class="widget-frame widget-frame--calendar"
            data-calendar-app
            data-calendar-month="${escapeHtml(calendar.monthValue)}"
            data-calendar-highlights="${escapeHtml(state.highlightsText || "")}"
          >
            <header class="widget-head">
              <div class="widget-meta">
                ${renderOptionalText("span", "widget-kicker", state.kickerText)}
                <h1 class="widget-title">${escapeHtml(state.title)}</h1>
              </div>
              ${renderOptionalText("span", "widget-chip", state.badgeText)}
            </header>
            <div class="calendar-summary">
              <div class="calendar-nav">
                <button class="widget-icon-button" type="button" data-calendar-nav="prev" aria-label="Mês anterior">←</button>
                <strong class="calendar-month-label" data-calendar-month-label>${escapeHtml(calendar.label)}</strong>
                <button class="widget-icon-button" type="button" data-calendar-nav="next" aria-label="Próximo mês">→</button>
              </div>
              <div class="calendar-summary-side">
                ${renderOptionalText("span", "calendar-note", state.note)}
                <button class="widget-icon-button" type="button" data-calendar-nav="today" aria-label="Voltar para hoje">•</button>
              </div>
            </div>
            <div class="calendar-weekdays">
              ${calendar.weekdays.map((day) => `<span>${escapeHtml(day)}</span>`).join("")}
            </div>
            <div class="calendar-grid" data-calendar-grid>
              ${calendar.days
                .map((day) => {
                  if (!day.inMonth) {
                    return `<span class="calendar-day calendar-day--empty"></span>`;
                  }
                  const className = [
                    "calendar-day",
                    day.isToday ? "is-today" : "",
                    day.isHighlighted ? "is-highlighted" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return `
                    <button
                      class="${className}"
                      type="button"
                      data-calendar-day="${day.day}"
                      aria-pressed="${day.isHighlighted ? "true" : "false"}"
                    >
                      ${day.day}
                    </button>
                  `;
                })
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
              ${renderOptionalText("span", "widget-kicker", state.kickerText)}
              <h1 class="widget-title">${escapeHtml(state.title)}</h1>
            </div>
            ${renderOptionalText("span", "widget-chip", state.badgeText)}
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
    const pomodoroCopy = getPomodoroCopy(state);

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
      refs.status.textContent = getPomodoroStatusText(runtime, pomodoroCopy);
      refs.toggle.textContent = getPomodoroToggleLabel(runtime, pomodoroCopy);
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
    return () => {
      clearTicker();
    };
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
    const intervalId = window.setInterval(render, 1000);
    return () => {
      window.clearInterval(intervalId);
    };
  }

  function hydrateWeather(root, state) {
    const app = root.querySelector("[data-weather-app]");
    if (!app) {
      return null;
    }

    const refs = {
      city: app.querySelector("[data-weather-city]"),
      temp: app.querySelector("[data-weather-temp]"),
      condition: app.querySelector("[data-weather-condition]"),
      icon: app.querySelector("[data-weather-icon]"),
      high: app.querySelector("[data-weather-high]"),
      low: app.querySelector("[data-weather-low]"),
      stamp: app.querySelector("[data-weather-stamp]"),
      refresh: app.querySelector("[data-weather-refresh]"),
    };
    const fallback = {
      city: state.city,
      temperature: Number(state.temperature) || state.temperature,
      condition: state.condition,
      icon: state.icon,
      high: Number(state.highTemp) || state.highTemp,
      low: Number(state.lowTemp) || state.lowTemp,
      stamp: state.stamp,
    };
    let disposed = false;

    const render = (snapshot) => {
      refs.city.textContent = snapshot.city || state.city;
      refs.temp.textContent = `${snapshot.temperature}°`;
      refs.condition.textContent = snapshot.condition || state.condition;
      refs.icon.textContent = snapshot.icon || state.icon;
      refs.high.textContent = `${snapshot.high}°`;
      refs.low.textContent = `${snapshot.low}°`;
      refs.stamp.textContent = snapshot.stamp || state.stamp;
    };

    const sync = async (force = false) => {
      if (!state.city.trim()) {
        render(fallback);
        return;
      }

      refs.refresh.disabled = true;
      try {
        const snapshot = await loadWeatherSnapshot(state, { force });
        if (!disposed) {
          render(snapshot);
        }
      } catch (error) {
        if (!disposed) {
          render({
            ...fallback,
            stamp: state.stamp || "sem sinal",
          });
        }
      } finally {
        refs.refresh.disabled = false;
      }
    };

    refs.refresh.addEventListener("click", () => {
      sync(true);
    });

    render(fallback);
    sync(false);
    return () => {
      disposed = true;
    };
  }

  function hydrateProgress(root, state, options = {}) {
    const app = root.querySelector("[data-progress-app]");
    if (!app) {
      return null;
    }

    const refs = {
      numerator: app.querySelector("[data-progress-numerator]"),
      percent: app.querySelector("[data-progress-percent]"),
      fraction: app.querySelector("[data-progress-fraction]"),
      fill: app.querySelector("[data-progress-fill]"),
      actions: Array.from(app.querySelectorAll("[data-progress-action]")),
    };
    const storageKey = getWidgetStorageKey("progress");
    const stored = options.preview ? null : readWidgetStorage(storageKey);
    const initialCurrent = clampProgressValue(state.current, state.total);
    const runtime = {
      current: clampProgressValue(stored?.current ?? initialCurrent, state.total),
      total: Math.max(1, Number(state.total) || 1),
      step: Math.max(1, Number(state.stepAmount) || 1),
    };

    const persist = () => {
      if (options.preview) {
        return;
      }
      writeWidgetStorage(storageKey, { current: runtime.current });
    };

    const render = () => {
      const percent = getProgressPercent(runtime.current, runtime.total);
      refs.numerator.textContent = `${runtime.current}${state.unit}`;
      refs.percent.textContent = `${percent}%`;
      refs.fraction.textContent = `${runtime.current}/${runtime.total}`;
      refs.fill.style.width = `${percent}%`;
    };

    const commit = (nextCurrent) => {
      runtime.current = clampProgressValue(nextCurrent, runtime.total);
      persist();
      render();
    };

    refs.actions.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.progressAction;
        if (action === "increment") {
          commit(runtime.current + runtime.step);
          return;
        }
        if (action === "decrement") {
          commit(runtime.current - runtime.step);
          return;
        }
        commit(initialCurrent);
      });
    });

    render();
    return null;
  }

  function hydrateHabits(root, state, options = {}) {
    const app = root.querySelector("[data-habit-app]");
    if (!app) {
      return null;
    }

    const refs = {
      list: app.querySelector("[data-habit-list]"),
      count: app.querySelector("[data-habit-count]"),
      date: app.querySelector("[data-habit-date]"),
      empty: app.querySelector("[data-habit-empty]"),
      editPanel: app.querySelector("[data-habit-edit-panel]"),
      addForm: app.querySelector("[data-habit-add-form]"),
      editToggle: app.querySelector("[data-habit-edit-toggle]"),
      reset: app.querySelector("[data-habit-reset]"),
      restore: app.querySelector("[data-habit-restore]"),
    };
    const todayKey = getLocalDateKey(new Date());
    const initialItems = buildInitialHabitItems(state);
    const storageKey = getHabitStorageKey("habits", state);
    const stored = options.preview ? null : readWidgetStorage(storageKey);
    const hasStoredItems = Array.isArray(stored?.items);
    const storedItems = hasStoredItems ? normalizeStoredHabitItems(stored.items) : [];
    const runtime = {
      isEditing: false,
      items: hasStoredItems ? storedItems : initialItems.map(({ id, label }) => ({ id, label })),
      checkedByDate: normalizeHabitCheckedByDate(stored, initialItems, todayKey),
    };

    const getTodayChecked = () => {
      if (!runtime.checkedByDate[todayKey]) {
        runtime.checkedByDate[todayKey] = [];
      }
      const validIds = new Set(runtime.items.map((item) => item.id));
      runtime.checkedByDate[todayKey] = runtime.checkedByDate[todayKey].filter((id) =>
        validIds.has(id)
      );
      return new Set(runtime.checkedByDate[todayKey]);
    };

    const setTodayChecked = (checkedIds) => {
      runtime.checkedByDate[todayKey] = Array.from(checkedIds);
    };

    const persist = () => {
      if (options.preview) {
        return;
      }
      const payload = {
        items: runtime.items,
        checkedByDate: pruneHabitHistory(runtime.checkedByDate),
        updatedAt: Date.now(),
      };
      writeWidgetStorage(storageKey, payload);
      syncBridge.publish(payload);
    };

    const render = () => {
      const checkedIds = getTodayChecked();
      refs.list.innerHTML = renderHabitRows(runtime.items, checkedIds, runtime.isEditing);
      refs.count.textContent = `${checkedIds.size}/${runtime.items.length}`;
      refs.date.textContent = formatHabitDisplayDate(new Date());
      refs.empty.hidden = runtime.items.length > 0;
      refs.editPanel.hidden = !runtime.isEditing;
      refs.editToggle.classList.toggle("is-active", runtime.isEditing);
      refs.editToggle.setAttribute("aria-pressed", String(runtime.isEditing));
    };

    const applyStoredDataset = (incoming) => {
      if (Array.isArray(incoming?.items)) {
        runtime.items = normalizeStoredHabitItems(incoming.items);
      }
      runtime.checkedByDate = normalizeHabitCheckedByDate(incoming, initialItems, todayKey);
      render();
    };

    const syncBridge = createHabitSyncBridge(storageKey, applyStoredDataset, options);

    refs.list.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-habit-toggle]");
      const actionButton = event.target.closest("[data-habit-action]");

      if (toggle) {
        const id = toggle.dataset.habitToggle;
        const checkedIds = getTodayChecked();
        if (checkedIds.has(id)) {
          checkedIds.delete(id);
        } else {
          checkedIds.add(id);
        }
        setTodayChecked(checkedIds);
        persist();
        render();
        return;
      }

      if (!actionButton) {
        return;
      }

      const id = actionButton.dataset.habitId;
      const action = actionButton.dataset.habitAction;
      const index = runtime.items.findIndex((item) => item.id === id);
      if (index === -1) {
        return;
      }

      if (action === "delete") {
        runtime.items.splice(index, 1);
        Object.keys(runtime.checkedByDate).forEach((dateKey) => {
          runtime.checkedByDate[dateKey] = runtime.checkedByDate[dateKey].filter(
            (checkedId) => checkedId !== id
          );
        });
      } else if (action === "move-up" && index > 0) {
        [runtime.items[index - 1], runtime.items[index]] = [
          runtime.items[index],
          runtime.items[index - 1],
        ];
      } else if (action === "move-down" && index < runtime.items.length - 1) {
        [runtime.items[index + 1], runtime.items[index]] = [
          runtime.items[index],
          runtime.items[index + 1],
        ];
      }
      persist();
      render();
    });

    refs.list.addEventListener("input", (event) => {
      const input = event.target.closest("[data-habit-label-input]");
      if (!input) {
        return;
      }
      const item = runtime.items.find((candidate) => candidate.id === input.dataset.habitId);
      if (!item) {
        return;
      }
      item.label = input.value;
      persist();
    });

    refs.list.addEventListener(
      "blur",
      (event) => {
        const input = event.target.closest("[data-habit-label-input]");
        if (!input) {
          return;
        }
        const item = runtime.items.find((candidate) => candidate.id === input.dataset.habitId);
        if (!item) {
          return;
        }
        item.label = sanitizeHabitLabel(input.value) || "Novo hábito";
        persist();
        render();
      },
      true
    );

    refs.editToggle.addEventListener("click", () => {
      runtime.isEditing = !runtime.isEditing;
      render();
    });

    refs.reset.addEventListener("click", () => {
      setTodayChecked(new Set());
      persist();
      render();
    });

    refs.restore.addEventListener("click", () => {
      runtime.items = initialItems.map(({ id, label }) => ({ id, label }));
      runtime.checkedByDate = {
        [todayKey]: initialItems.filter((item) => item.done).map((item) => item.id),
      };
      persist();
      render();
    });

    refs.addForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = refs.addForm.elements.habitLabel;
      const label = sanitizeHabitLabel(input.value);
      if (!label) {
        input.focus();
        return;
      }
      runtime.items.push({
        id: createHabitId(label),
        label,
      });
      input.value = "";
      persist();
      render();
      window.requestAnimationFrame(() => {
        refs.addForm.elements.habitLabel.focus();
      });
    });

    render();
    if (shouldSyncHabits(state) && !stored && !options.preview) {
      persist();
    }
    return () => {
      syncBridge.cleanup();
    };
  }

  function hydrateHabitTracker(root, state, options = {}) {
    const app = root.querySelector("[data-habit-tracker-app]");
    if (!app) {
      return null;
    }

    const refs = {
      ring: app.querySelector("[data-habit-tracker-ring]"),
      percent: app.querySelector("[data-habit-tracker-percent]"),
      done: app.querySelector("[data-habit-tracker-done]"),
      pending: app.querySelector("[data-habit-tracker-pending]"),
      week: app.querySelector("[data-habit-tracker-week]"),
      list: app.querySelector("[data-habit-tracker-list]"),
      empty: app.querySelector("[data-habit-tracker-empty]"),
    };
    const todayKey = getLocalDateKey(new Date());
    const initialItems = buildInitialHabitItems(state);
    const storageKey = getHabitStorageKey("habit-tracker", state);
    const stored = options.preview ? null : readWidgetStorage(storageKey);
    const runtime = {
      dataset: buildHabitDatasetFromStored(stored, initialItems, todayKey),
    };

    const render = () => {
      const metrics = getHabitMetrics(runtime.dataset, todayKey);
      refs.ring.style.setProperty("--habit-tracker-progress", `${metrics.percent}%`);
      refs.percent.textContent = `${metrics.percent}%`;
      refs.done.textContent = String(metrics.done);
      refs.pending.textContent = String(metrics.pending);
      refs.week.innerHTML = renderHabitTrackerWeek(runtime.dataset, todayKey);
      refs.list.innerHTML = renderHabitTrackerRows(runtime.dataset, todayKey, state);
      refs.empty.hidden = runtime.dataset.items.length > 0;
    };

    const applyStoredDataset = (incoming) => {
      runtime.dataset = buildHabitDatasetFromStored(incoming, initialItems, todayKey);
      render();
    };

    const syncBridge = createHabitSyncBridge(storageKey, applyStoredDataset, options);

    render();
    return () => {
      syncBridge.cleanup();
    };
  }

  function renderHabitRows(items, checkedIds, isEditing) {
    return items
      .map((item, index) => {
        const isDone = checkedIds.has(item.id);
        return `
          <div
            class="habit-item ${isDone ? "is-done" : ""} ${isEditing ? "is-editing" : ""}"
            data-habit-row="${escapeHtml(item.id)}"
          >
            <button
              class="habit-toggle"
              type="button"
              data-habit-toggle="${escapeHtml(item.id)}"
              aria-pressed="${isDone ? "true" : "false"}"
            >
              <span class="habit-mark"></span>
              <span class="habit-label">${escapeHtml(item.label)}</span>
            </button>
            <input
              class="habit-edit-input"
              type="text"
              value="${escapeHtml(item.label)}"
              data-habit-label-input
              data-habit-id="${escapeHtml(item.id)}"
              aria-label="Nome do hábito"
              ${isEditing ? "" : "hidden"}
            />
            <div class="habit-item-actions" ${isEditing ? "" : "hidden"}>
              <button
                class="widget-icon-button"
                type="button"
                data-habit-action="move-up"
                data-habit-id="${escapeHtml(item.id)}"
                aria-label="Mover para cima"
                ${index === 0 ? "disabled" : ""}
              >↑</button>
              <button
                class="widget-icon-button"
                type="button"
                data-habit-action="move-down"
                data-habit-id="${escapeHtml(item.id)}"
                aria-label="Mover para baixo"
                ${index === items.length - 1 ? "disabled" : ""}
              >↓</button>
              <button
                class="widget-icon-button"
                type="button"
                data-habit-action="delete"
                data-habit-id="${escapeHtml(item.id)}"
                aria-label="Remover hábito"
              >×</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function buildInitialHabitItems(state) {
    const labels = parseHabitLines(state.habitsText);
    const checked = parseCheckedIndexes(state.checkedText, labels.length);
    return labels.map((label, index) => ({
      id: createInitialHabitId(label, index),
      label,
      done: checked.has(index),
    }));
  }

  function buildInitialHabitDataset(initialItems, todayKey) {
    return {
      items: initialItems.map(({ id, label }) => ({ id, label })),
      checkedByDate: {
        [todayKey]: initialItems.filter((item) => item.done).map((item) => item.id),
      },
    };
  }

  function buildHabitDatasetFromStored(stored, initialItems, todayKey) {
    const hasStoredItems = Array.isArray(stored?.items);
    return {
      items: hasStoredItems
        ? normalizeStoredHabitItems(stored.items)
        : initialItems.map(({ id, label }) => ({ id, label })),
      checkedByDate: normalizeHabitCheckedByDate(stored, initialItems, todayKey),
    };
  }

  function getHabitMetrics(dataset, dateKey) {
    const items = dataset.items || [];
    const validIds = new Set(items.map((item) => item.id));
    const done = new Set(
      (dataset.checkedByDate?.[dateKey] || []).filter((id) => validIds.has(id))
    ).size;
    const total = items.length;
    return {
      done,
      total,
      pending: Math.max(total - done, 0),
      percent: total ? Math.round((done / total) * 100) : 0,
    };
  }

  function renderHabitTrackerRows(dataset, todayKey, state) {
    const checkedIds = new Set(dataset.checkedByDate?.[todayKey] || []);
    return (dataset.items || [])
      .map((item) => {
        const isDone = checkedIds.has(item.id);
        return `
          <div class="habit-tracker-row ${isDone ? "is-done" : ""}">
            <span class="habit-mark"></span>
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(isDone ? state.completeLabel : state.pendingLabel)}</strong>
          </div>
        `;
      })
      .join("");
  }

  function renderHabitTrackerWeek(dataset, todayKey) {
    const today = parseLocalDateKey(todayKey);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateKey = getLocalDateKey(date);
      const metrics = getHabitMetrics(dataset, dateKey);
      const label = new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
        .format(date)
        .replaceAll(".", "")
        .slice(0, 3);
      return `
        <div class="habit-tracker-day ${metrics.total > 0 && metrics.done === metrics.total ? "is-complete" : ""}">
          <span>${escapeHtml(label)}</span>
          <strong>${metrics.done}/${metrics.total}</strong>
        </div>
      `;
    }).join("");
  }

  function normalizeStoredHabitItems(items) {
    if (!Array.isArray(items)) {
      return [];
    }
    return items
      .map((item) => {
        const label = sanitizeHabitLabel(item?.label);
        if (!label) {
          return null;
        }
        return {
          id: typeof item.id === "string" && item.id ? item.id : createHabitId(label),
          label,
        };
      })
      .filter(Boolean);
  }

  function normalizeHabitCheckedByDate(stored, initialItems, todayKey) {
    if (stored?.checkedByDate && typeof stored.checkedByDate === "object") {
      return Object.fromEntries(
        Object.entries(stored.checkedByDate).map(([dateKey, checkedIds]) => [
          dateKey,
          Array.isArray(checkedIds) ? checkedIds.filter((id) => typeof id === "string") : [],
        ])
      );
    }

    if (Array.isArray(stored?.checked)) {
      return {
        [todayKey]: stored.checked.map((index) => initialItems[index]?.id).filter(Boolean),
      };
    }

    return {
      [todayKey]: initialItems.filter((item) => item.done).map((item) => item.id),
    };
  }

  function pruneHabitHistory(checkedByDate) {
    return Object.fromEntries(Object.entries(checkedByDate).slice(-45));
  }

  function createInitialHabitId(label, index) {
    return `initial-${index}-${slugifyHabitLabel(label)}`;
  }

  function createHabitId(label) {
    return `habit-${slugifyHabitLabel(label)}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  }

  function slugifyHabitLabel(label) {
    return (
      sanitizeHabitLabel(label)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 24) || "item"
    );
  }

  function sanitizeHabitLabel(value) {
    return String(value || "").trim().replace(/\s+/g, " ").slice(0, 80);
  }

  function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseLocalDateKey(dateKey) {
    const [year, month, day] = String(dateKey).split("-").map(Number);
    if (!year || !month || !day) {
      return new Date();
    }
    return new Date(year, month - 1, day);
  }

  function formatHabitDisplayDate(date) {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
      .format(date)
      .replaceAll(".", "");
  }

  function hydrateCalendar(root, state, options = {}) {
    const app = root.querySelector("[data-calendar-app]");
    if (!app) {
      return null;
    }

    const refs = {
      label: app.querySelector("[data-calendar-month-label]"),
      grid: app.querySelector("[data-calendar-grid]"),
      navButtons: Array.from(app.querySelectorAll("[data-calendar-nav]")),
    };
    const initialMonth = normalizeMonthValue(state.monthValue);
    const initialHighlights = parseHighlightDays(state.highlightsText);
    const storageKey = getWidgetStorageKey("calendar");
    const stored = options.preview ? null : readWidgetStorage(storageKey);
    const highlightsByMonth = new Map();

    highlightsByMonth.set(initialMonth, new Set(initialHighlights));
    if (stored?.highlightsByMonth && typeof stored.highlightsByMonth === "object") {
      Object.entries(stored.highlightsByMonth).forEach(([monthValue, values]) => {
        highlightsByMonth.set(
          normalizeMonthValue(monthValue),
          new Set(
            Array.isArray(values)
              ? values.filter((day) => Number.isInteger(day) && day >= 1 && day <= 31)
              : []
          )
        );
      });
    }

    const runtime = {
      monthValue: normalizeMonthValue(stored?.monthValue || initialMonth),
    };

    const getMonthHighlights = (monthValue) => {
      const normalized = normalizeMonthValue(monthValue);
      if (!highlightsByMonth.has(normalized)) {
        highlightsByMonth.set(normalized, new Set());
      }
      return highlightsByMonth.get(normalized);
    };

    const persist = () => {
      if (options.preview) {
        return;
      }
      const payload = {
        monthValue: runtime.monthValue,
        highlightsByMonth: Object.fromEntries(
          Array.from(highlightsByMonth.entries()).map(([monthValue, days]) => [
            monthValue,
            Array.from(days).sort((left, right) => left - right),
          ])
        ),
      };
      writeWidgetStorage(storageKey, payload);
    };

    const render = () => {
      const highlightSet = getMonthHighlights(runtime.monthValue);
      const calendar = buildCalendarModel(
        runtime.monthValue,
        Array.from(highlightSet)
          .sort((left, right) => left - right)
          .join(",")
      );
      refs.label.textContent = calendar.label;
      refs.grid.innerHTML = calendar.days
        .map((day) => {
          if (!day.inMonth) {
            return `<span class="calendar-day calendar-day--empty"></span>`;
          }
          const className = [
            "calendar-day",
            day.isToday ? "is-today" : "",
            day.isHighlighted ? "is-highlighted" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return `
            <button
              class="${className}"
              type="button"
              data-calendar-day="${day.day}"
              aria-pressed="${day.isHighlighted ? "true" : "false"}"
            >
              ${day.day}
            </button>
          `;
        })
        .join("");
    };

    refs.grid.addEventListener("click", (event) => {
      const target = event.target.closest("[data-calendar-day]");
      if (!target) {
        return;
      }
      const day = Number(target.dataset.calendarDay);
      if (!Number.isInteger(day)) {
        return;
      }
      const highlightSet = getMonthHighlights(runtime.monthValue);
      if (highlightSet.has(day)) {
        highlightSet.delete(day);
      } else {
        highlightSet.add(day);
      }
      persist();
      render();
    });

    refs.navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.calendarNav;
        if (action === "prev") {
          runtime.monthValue = shiftMonthValue(runtime.monthValue, -1);
        } else if (action === "next") {
          runtime.monthValue = shiftMonthValue(runtime.monthValue, 1);
        } else {
          runtime.monthValue = formatMonthValue(new Date());
        }
        persist();
        render();
      });
    });

    render();
    return null;
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

  function getPomodoroStatusText(runtime, pomodoroCopy) {
    const modeCopy = pomodoroCopy.modes[runtime.activeMode];
    if (runtime.remainingSeconds <= 0) {
      return composePomodoroStatus(modeCopy.hint, pomodoroCopy.suffixes.completed);
    }
    if (runtime.isRunning) {
      return composePomodoroStatus(modeCopy.hint, pomodoroCopy.suffixes.running);
    }
    if (runtime.remainingSeconds < runtime.durations[runtime.activeMode] * 60) {
      return composePomodoroStatus(modeCopy.hint, pomodoroCopy.suffixes.paused);
    }
    return composePomodoroStatus(modeCopy.hint, pomodoroCopy.suffixes.ready);
  }

  function getPomodoroToggleLabel(runtime, pomodoroCopy) {
    if (runtime.isRunning) {
      return pomodoroCopy.controls.pause;
    }
    if (runtime.remainingSeconds < runtime.durations[runtime.activeMode] * 60) {
      return pomodoroCopy.controls.resume;
    }
    return pomodoroCopy.controls.start;
  }

  function getPomodoroCopy(state) {
    return {
      modes: {
        focus: {
          label: state.focusLabel || "Pomodoro",
          hint: state.focusHint || "sessao de foco",
        },
        short: {
          label: state.shortLabel || "Short Break",
          hint: state.shortHint || "pausa curta",
        },
        long: {
          label: state.longLabel || "Long Break",
          hint: state.longHint || "pausa longa",
        },
      },
      controls: {
        start: state.startLabel || "Start",
        pause: state.pauseLabel || "Pause",
        resume: state.resumeLabel || "Resume",
        reset: state.resetLabel || "Reset",
      },
      suffixes: {
        ready: state.readySuffix || "pronto para começar.",
        running: state.runningSuffix || "em andamento.",
        paused: state.pausedSuffix || "pausado.",
        completed: state.completedSuffix || "concluído.",
      },
    };
  }

  function composePomodoroStatus(prefix, suffix) {
    return [prefix, suffix].filter(Boolean).join(" ").trim();
  }

  async function loadWeatherSnapshot(state, { force = false } = {}) {
    const city = String(state.city || "").trim();
    if (!city) {
      throw new Error("Missing city");
    }

    const countryCode = String(state.countryCode || "")
      .trim()
      .slice(0, 2)
      .toUpperCase();
    const unit = state.temperatureUnit === "fahrenheit" ? "fahrenheit" : "celsius";
    const cacheKey = [city.toLowerCase(), countryCode, unit].join("|");
    const cached = WEATHER_CACHE.get(cacheKey);

    if (!force && cached?.data && Date.now() - cached.timestamp < WEATHER_CACHE_TTL) {
      return cached.data;
    }
    if (!force && cached?.promise) {
      return cached.promise;
    }

    const promise = (async () => {
      const geocodingUrl = new URL(WEATHER_GEOCODING_ENDPOINT);
      geocodingUrl.searchParams.set("name", city);
      geocodingUrl.searchParams.set("count", "1");
      geocodingUrl.searchParams.set("language", "pt");
      geocodingUrl.searchParams.set("format", "json");
      if (countryCode) {
        geocodingUrl.searchParams.set("countryCode", countryCode);
      }

      const geocoding = await fetchJson(geocodingUrl.toString());
      const location = geocoding?.results?.[0];
      if (!location) {
        throw new Error("Location not found");
      }

      const forecastUrl = new URL(WEATHER_FORECAST_ENDPOINT);
      forecastUrl.searchParams.set("latitude", String(location.latitude));
      forecastUrl.searchParams.set("longitude", String(location.longitude));
      forecastUrl.searchParams.set("timezone", "auto");
      forecastUrl.searchParams.set("current", "temperature_2m,weather_code,is_day");
      forecastUrl.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
      forecastUrl.searchParams.set("forecast_days", "1");
      forecastUrl.searchParams.set("temperature_unit", unit);

      const forecast = await fetchJson(forecastUrl.toString());
      const weatherCode = Number(forecast?.current?.weather_code);
      const isDay = Number(forecast?.current?.is_day) === 1;
      const weatherCopy = getWeatherCodeCopy(weatherCode, isDay);
      const snapshot = {
        city: location.name || city,
        temperature: roundWeatherNumber(forecast?.current?.temperature_2m, state.temperature),
        condition: weatherCopy.label,
        icon: weatherCopy.icon,
        high: roundWeatherNumber(forecast?.daily?.temperature_2m_max?.[0], state.highTemp),
        low: roundWeatherNumber(forecast?.daily?.temperature_2m_min?.[0], state.lowTemp),
        stamp: formatWeatherStamp(forecast?.current?.time, location.timezone) || state.stamp,
      };
      WEATHER_CACHE.set(cacheKey, {
        data: snapshot,
        timestamp: Date.now(),
      });
      return snapshot;
    })();

    WEATHER_CACHE.set(cacheKey, {
      data: cached?.data || null,
      timestamp: cached?.timestamp || 0,
      promise,
    });

    try {
      return await promise;
    } finally {
      const entry = WEATHER_CACHE.get(cacheKey);
      if (entry?.promise === promise) {
        if (entry.data) {
          WEATHER_CACHE.set(cacheKey, {
            data: entry.data,
            timestamp: entry.timestamp || Date.now(),
          });
        } else {
          WEATHER_CACHE.delete(cacheKey);
        }
      }
    }
  }

  function fetchJson(url) {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    });
  }

  function getWeatherCodeCopy(code, isDay) {
    const match = WEATHER_CODES[code] || WEATHER_CODES[3];
    return {
      label: match.label,
      icon: isDay ? match.day : match.night,
    };
  }

  function roundWeatherNumber(value, fallback) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return Math.round(numeric);
    }
    return Number(fallback) || fallback;
  }

  function formatWeatherStamp(value) {
    if (!value) {
      return "";
    }
    const match = String(value).match(/(\d{2}:\d{2})/);
    return match ? match[1] : String(value);
  }

  function getProgressPercent(current, total) {
    const safeCurrent = Math.max(0, Number(current) || 0);
    const safeTotal = Math.max(1, Number(total) || 1);
    return Math.min(100, Math.max(0, Math.round((safeCurrent / safeTotal) * 100)));
  }

  function clampProgressValue(current, total) {
    const safeTotal = Math.max(1, Number(total) || 1);
    const safeCurrent = Number(current);
    if (!Number.isFinite(safeCurrent)) {
      return 0;
    }
    return Math.min(safeTotal, Math.max(0, Math.round(safeCurrent)));
  }

  function parseHabitLines(value) {
    return String(value || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  function parseCheckedIndexes(value, size) {
    return new Set(
      String(value || "")
        .split(",")
        .map((item) => Number(item.trim()) - 1)
        .filter((index) => Number.isInteger(index) && index >= 0 && index < size)
    );
  }

  function parseHighlightDays(value, maxDay = 31) {
    return String(value || "")
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((day) => Number.isInteger(day) && day >= 1 && day <= maxDay);
  }

  function buildCalendarModel(monthValue, highlightsText) {
    const normalizedMonth = normalizeMonthValue(monthValue);
    const [yearString, monthString] = normalizedMonth.split("-");
    const year = Number(yearString);
    const monthIndex = Number(monthString) - 1;
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();
    const highlightSet = new Set(parseHighlightDays(highlightsText, daysInMonth));
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() === monthIndex;
    const days = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      days.push({ inMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push({
        inMonth: true,
        day,
        isToday: isCurrentMonth && today.getDate() === day,
        isHighlighted: highlightSet.has(day),
      });
    }

    while (days.length % 7 !== 0) {
      days.push({ inMonth: false });
    }

    return {
      label: new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(firstDay),
      monthValue: normalizedMonth,
      weekdays: CALENDAR_WEEKDAYS,
      days,
    };
  }

  function normalizeMonthValue(value) {
    if (typeof value === "string" && /^\d{4}-\d{2}$/.test(value)) {
      return value;
    }
    return formatMonthValue(new Date());
  }

  function formatMonthValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  function shiftMonthValue(monthValue, offset) {
    const normalized = normalizeMonthValue(monthValue);
    const [yearString, monthString] = normalized.split("-");
    const nextDate = new Date(Number(yearString), Number(monthString) - 1 + offset, 1);
    return formatMonthValue(nextDate);
  }

  function getWidgetStorageKey(widgetKey) {
    const url = new URL(window.location.href);
    url.searchParams.delete("preview");
    return `${STORAGE_NAMESPACE}:${widgetKey}:${url.pathname}?${url.searchParams.toString()}`;
  }

  function getHabitStorageKey(widgetKey, state) {
    if (shouldSyncHabits(state)) {
      return `${STORAGE_NAMESPACE}:habit-sync:${getHabitSyncId(state)}`;
    }
    return getWidgetStorageKey(widgetKey);
  }

  function shouldSyncHabits(state) {
    return state.syncHabits === true || state.syncHabits === "true" || state.syncHabits === "1";
  }

  function getHabitSyncId(state) {
    return slugifyHabitLabel(state.habitSyncId || HABIT_SYNC_DEFAULT_ID);
  }

  function createHabitSyncBridge(storageKey, onUpdate, options = {}) {
    const bridge = {
      publish() {},
      cleanup() {},
    };
    if (options.preview || typeof window === "undefined") {
      return bridge;
    }

    const sourceId = createHabitId("source");
    let channel = null;
    const handleUpdate = (incoming) => {
      if (!incoming) {
        return;
      }
      onUpdate(incoming);
    };

    const handleMessage = (event) => {
      const payload = event.data;
      if (
        !payload ||
        payload.type !== "habit-sync:update" ||
        payload.storageKey !== storageKey ||
        payload.sourceId === sourceId
      ) {
        return;
      }
      handleUpdate(payload.value || readWidgetStorage(storageKey));
    };

    try {
      if ("BroadcastChannel" in window) {
        channel = new BroadcastChannel(HABIT_SYNC_CHANNEL);
        channel.addEventListener("message", handleMessage);
      }
    } catch (error) {
      channel = null;
    }

    const handleStorage = (event) => {
      if (event.key !== storageKey) {
        return;
      }
      handleUpdate(readWidgetStorage(storageKey));
    };
    window.addEventListener("storage", handleStorage);

    return {
      publish(value) {
        if (!channel) {
          return;
        }
        channel.postMessage({
          type: "habit-sync:update",
          storageKey,
          sourceId,
          value,
        });
      },
      cleanup() {
        window.removeEventListener("storage", handleStorage);
        if (channel) {
          channel.removeEventListener("message", handleMessage);
          channel.close();
        }
      },
    };
  }

  function readWidgetStorage(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeWidgetStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Ignore persistence failures and keep the widget interactive in-memory.
    }
  }

  function getEmbedBehaviorCopy(widgetKey) {
    if (widgetKey === "pomodoro") {
      return "No Notion esse widget continua funcional. Start, pause, reset e ajuste de tempo acontecem no próprio card.";
    }
    if (widgetKey === "weather") {
      return "No Notion esse widget busca clima real da cidade informada e pode ser atualizado no próprio card.";
    }
    if (widgetKey === "progress") {
      return "No Notion esse widget continua funcional. Você ajusta a meta com +, -, e reset direto no card.";
    }
    if (widgetKey === "habits") {
      return "No Notion esse widget continua funcional. Você marca, adiciona, edita, reordena e remove hábitos direto no próprio card.";
    }
    if (widgetKey === "habit-tracker") {
      return "No Notion esse widget mostra o progresso dos hábitos. Ative a conexão e use o mesmo ID do Habit Flow para sincronizar.";
    }
    if (widgetKey === "calendar") {
      return "No Notion esse widget continua funcional. Você navega pelos meses e destaca dias direto no próprio card.";
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
    if (widgetKey === "weather") {
      return 580;
    }
    if (widgetKey === "progress") {
      return 600;
    }
    if (widgetKey === "habits") {
      return 560;
    }
    if (widgetKey === "habit-tracker") {
      return 620;
    }
    if (widgetKey === "calendar") {
      return 640;
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
        ${escapeHtml(label)}
      </button>
    `;
  }

  function renderOptionalText(tag, className, value) {
    if (!value) {
      return "";
    }
    return `<${tag} class="${className}">${escapeHtml(value)}</${tag}>`;
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
