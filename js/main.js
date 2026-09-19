// ======================================================
// 湖影に消えた花嫁
// 第1章 自動進行撤廃・移動主導型エンジン
// ======================================================

const {
  scenes,
  characters,
  evidenceMaster,
  movementMap,
  initialFlags,
  initialEvidence
} = window.KOEI_GAME_DATA;

const SAVE_KEY = "koeiBrideSave_moveDriven_v1";
const SETTINGS_KEY = "koeiBrideSettings_v1";
const PROGRESS_KEY = "koeiBrideProgress_v1";
const SAVE_NOTICE_KEY = "koeiBrideSaveNoticeSeen_v1";

const DEFAULT_SETTINGS = { soundOn: true, speedLevel: 3 };
const SPEED_TABLE = { 1: 90, 2: 65, 3: 45, 4: 25, 5: 10 };

const VOICE_TABLE = {
  shichijo:     { frequency: 175, type: "square" },
  soichiro:     { frequency: 160, type: "square" },
  sojiro:       { frequency: 190, type: "square" },
  saya:         { frequency: 330, type: "square" },
  hotelStaff:   { frequency: 310, type: "square" },
  hotelManager: { frequency: 180, type: "square" },
  shopClerk:    { frequency: 340, type: "square" },
  stationStaff: { frequency: 205, type: "square" }
};

const FACE_TABLE = {
  shichijo: "images/faces/face_shichijo.webp",
  soichiro: "images/faces/face_soichiro.webp",
  sojiro: "images/faces/face_sojiro.webp",
  saya: "images/faces/face_saya.webp",
  hotelStaff: "images/faces/face_hotel_staff.webp",
  hotelManager: "images/faces/face_hotel_manager.webp",
  shopClerk: "images/faces/face_shop_clerk.webp"
};

let settings = loadSettings();
let game = createFreshGameState();

const el = {
  game: document.querySelector("#game"),
  background: document.querySelector("#background"),
  characterLayer: document.querySelector("#character-layer"),
  speaker: document.querySelector("#speaker-name"),
  portraitWrap: document.querySelector("#speaker-portrait-wrap"),
  portrait: document.querySelector("#speaker-portrait"),
  locationBadge: document.querySelector("#location-badge"),
  message: document.querySelector("#message-text"),
  choiceArea: document.querySelector("#choice-area"),
  evidenceImage: document.querySelector("#evidence-image"),
  nextIndicator: document.querySelector("#next-indicator"),
  menuButton: document.querySelector("#menu-button"),
  commandPanel: document.querySelector("#command-panel"),
  commandSubchoices: document.querySelector("#command-subchoices"),
  cmdTalk: document.querySelector("#cmd-talk"),
  cmdAsk: document.querySelector("#cmd-ask"),
  cmdLook: document.querySelector("#cmd-look"),
  cmdSearch: document.querySelector("#cmd-search"),
  cmdEvidence: document.querySelector("#cmd-evidence"),
  cmdMove: document.querySelector("#cmd-move")
};

let audioContext = null;
let audioUnlocked = false;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createFreshGameState() {
  return {
    sceneId: "T00",
    currentSpotId: null,
    flags: clone(initialFlags),
    evidence: clone(initialEvidence),
    actionHistory: {},
    lineQueue: [],
    lineIndex: -1,
    currentFullText: "",
    isTyping: false,
    typingTimer: null,
    autoAdvanceTimer: null,
    waitingForAdvance: false,
    lineFinishCallback: null,
    activeQuiz: null
  };
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("設定を保存できませんでした。", error);
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { version: 1, chapters: {} };
    const parsed = JSON.parse(raw);
    return {
      version: 1,
      chapters: { ...(parsed.chapters ?? {}) }
    };
  } catch (error) {
    console.warn("章クリア情報を読み込めませんでした。", error);
    return { version: 1, chapters: {} };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("章クリア情報を保存できませんでした。", error);
  }
}

function markChapterCleared(chapterNumber) {
  const progress = loadProgress();
  const key = String(chapterNumber);
  if (progress.chapters[key]?.cleared) return;
  progress.chapters[key] = {
    cleared: true,
    clearedAt: new Date().toISOString()
  };
  saveProgress(progress);
}

function syncChapterProgressFromFlags() {
  if (game?.flags?.chapter1Clear) markChapterCleared(1);
}

function hasSeenSaveNotice() {
  try {
    return localStorage.getItem(SAVE_NOTICE_KEY) === "true";
  } catch {
    return false;
  }
}

function markSaveNoticeSeen() {
  try {
    localStorage.setItem(SAVE_NOTICE_KEY, "true");
  } catch (error) {
    console.warn("セーブ案内の確認状態を保存できませんでした。", error);
  }
}

function ensureAudioContext() {
  if (!settings.soundOn) return;
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  audioUnlocked = true;
}

function playTextSound(speakerId, charIndex, char) {
  if (!settings.soundOn || !audioUnlocked || !audioContext || !speakerId) return;
  if (charIndex % 2 !== 0) return;
  if (/[\s。、！？!?…「」『』（）()・：:；;―ー\-]/.test(char)) return;

  const voice = VOICE_TABLE[speakerId];
  if (!voice) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = voice.type;
  osc.frequency.setValueAtTime(voice.frequency, audioContext.currentTime);
  gain.gain.setValueAtTime(0.018, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0008, audioContext.currentTime + 0.026);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.027);
}

function clearTypingTimer() {
  if (game.typingTimer) clearTimeout(game.typingTimer);
  if (game.autoAdvanceTimer) clearTimeout(game.autoAdvanceTimer);
  game.typingTimer = null;
  game.autoAdvanceTimer = null;
}

function isCurrentLineLast() {
  return game.lineIndex >= 0 && game.lineIndex >= game.lineQueue.length - 1;
}

function scheduleAutoReturnAfterLastLine() {
  if (!isCurrentLineLast()) return false;
  if (game.autoAdvanceTimer) clearTimeout(game.autoAdvanceTimer);
  game.waitingForAdvance = false;
  setNextIndicator(false);
  game.autoAdvanceTimer = setTimeout(() => {
    game.autoAdvanceTimer = null;
    showNextLine();
  }, 1100);
  return true;
}

function setNextIndicator(show) {
  if (el.nextIndicator) el.nextIndicator.hidden = !show;
}

function typeText(text, speakerId = null) {
  clearTypingTimer();
  game.currentFullText = text ?? "";
  game.isTyping = true;
  game.waitingForAdvance = false;
  if (el.message) el.message.textContent = "";
  setNextIndicator(false);

  let index = 0;
  const interval = SPEED_TABLE[settings.speedLevel] ?? SPEED_TABLE[3];

  const step = () => {
    if (!game.isTyping) return;
    if (index >= game.currentFullText.length) {
      game.isTyping = false;
      if (scheduleAutoReturnAfterLastLine()) return;
      game.waitingForAdvance = true;
      setNextIndicator(true);
      return;
    }

    const char = game.currentFullText[index];
    if (el.message) el.message.textContent += char;
    playTextSound(speakerId, index, char);
    index += 1;
    game.typingTimer = setTimeout(step, interval);
  };

  step();
}

function skipTyping() {
  if (!game.isTyping) return false;
  clearTypingTimer();
  if (el.message) el.message.textContent = game.currentFullText;
  game.isTyping = false;
  if (scheduleAutoReturnAfterLastLine()) return true;
  game.waitingForAdvance = true;
  setNextIndicator(true);
  return true;
}

function showSpeaker(speakerId) {
  const char = characters[speakerId];

  if (el.speaker) {
    el.speaker.textContent = char?.name ?? "";
    el.speaker.hidden = false;
  }

  const face = FACE_TABLE[speakerId];
  if (el.portraitWrap && el.portrait && face) {
    el.portrait.src = face;
    el.portrait.alt = char?.name ?? "";
    el.portraitWrap.hidden = false;
  } else {
    hidePortrait();
  }
}

function hidePortrait() {
  if (el.portraitWrap) el.portraitWrap.hidden = true;
  if (el.portrait) {
    el.portrait.removeAttribute("src");
    el.portrait.alt = "";
  }
}

function hideSpeaker() {
  if (el.speaker) {
    el.speaker.textContent = "";
    el.speaker.hidden = true;
  }
  hidePortrait();
}

function clearMessage() {
  hideSpeaker();
  if (el.message) el.message.textContent = "";
  setNextIndicator(false);
}

function startLines(lines, callback = null) {
  clearCommandAvailability();
  game.lineQueue = lines ?? [];
  game.lineIndex = -1;
  game.lineFinishCallback = callback;
  showNextLine();
}

function showNextLine() {
  game.lineIndex += 1;

  if (game.lineIndex >= game.lineQueue.length) {
    game.waitingForAdvance = false;
    setNextIndicator(false);
    const callback = game.lineFinishCallback;
    game.lineFinishCallback = null;
    game.lineQueue = [];
    game.lineIndex = -1;
    if (callback) callback();
    else showLocationIdle();
    return;
  }

  const line = game.lineQueue[game.lineIndex];
  let text = "";
  let speakerId = null;

  if (line.speaker) {
    speakerId = line.speaker;
    text = line.text ?? "";
    showSpeaker(speakerId);
  } else if (line.thought) {
    text = line.thought;
    showSpeaker("shichijo");
  } else {
    text = line.narrator ?? "";
    hideSpeaker();
  }

  typeText(text, line.speaker ? speakerId : null);
}

function handleGameAdvance(event) {
  if (event?.target?.closest("button")) return;
  if (skipTyping()) return;
  if (!game.waitingForAdvance) return;

  game.waitingForAdvance = false;
  setNextIndicator(false);
  showNextLine();
}

function handleKeydown(event) {
  if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
    event.preventDefault();
    handleGameAdvance();
  }
}

function clearCommandSubchoices() {
  if (el.commandSubchoices) el.commandSubchoices.innerHTML = "";
  document.querySelectorAll(".command-button.is-active").forEach((node) => node.classList.remove("is-active"));
}

function setActiveCommand(type) {
  document.querySelectorAll(".command-button.is-active").forEach((node) => node.classList.remove("is-active"));
  const map = {
    talk: el.cmdTalk,
    ask: el.cmdAsk,
    look: el.cmdLook,
    search: el.cmdSearch,
    evidence: el.cmdEvidence,
    move: el.cmdMove
  };
  map[type]?.classList.add("is-active");
}


function hasAvailableActions(command) {
  const scene = getCurrentScene();
  if (!scene || scene.type !== "location") return false;

  if (command === "move") {
    return Object.entries(movementMap?.spots ?? {})
      .some(([id]) => id !== game.currentSpotId && isSpotUnlocked(id));
  }

  if (command === "evidence") {
    const actionAvailable = (scene.commands?.evidence ?? [])
      .some(action => isActionAvailable(action, "evidence"));
    const evidenceOwned = Object.values(game.evidence ?? {}).some(Boolean);
    return actionAvailable || evidenceOwned;
  }

  return (scene.commands?.[command] ?? [])
    .some(action => isActionAvailable(action, command));
}

function updateCommandAvailability() {
  const pairs = [
    ["talk", el.cmdTalk],
    ["ask", el.cmdAsk],
    ["look", el.cmdLook],
    ["search", el.cmdSearch],
    ["evidence", el.cmdEvidence],
    ["move", el.cmdMove]
  ];

  pairs.forEach(([command, button]) => {
    if (!button) return;
    button.classList.toggle("is-available", hasAvailableActions(command));
  });
}

function clearCommandAvailability() {
  [el.cmdTalk, el.cmdAsk, el.cmdLook, el.cmdSearch, el.cmdEvidence, el.cmdMove]
    .forEach(button => button?.classList.remove("is-available"));
}

function maybeShowTutorial(callback = null) {
  if (game.flags.tutorialShown) {
    if (callback) callback();
    return;
  }

  game.flags.tutorialShown = true;

  const overlay = makeOverlay("遊び方");
  const box = document.createElement("div");
  box.className = "tutorial-box";

  const p1 = document.createElement("p");
  p1.textContent = "右側の6つのコマンドから行動を選びます。";
  const p2 = document.createElement("p");
  p2.textContent = "情報が増えると、使えそうなコマンドが少し明るくなり、行ける場所も増えます。";
  const p3 = document.createElement("p");
  p3.textContent = "迷ったときは、気になるコマンドを押してみてください。使えない場合も、その場で案内が出ます。";

  box.append(p1, p2, p3);
  overlay.body.appendChild(box);

  const closeButton = overlay.panel.querySelector(".overlay-close");
  if (closeButton && callback) {
    closeButton.addEventListener("click", () => callback(), { once: true });
  } else if (callback) {
    callback();
  }
}

function showCommandFeedback(text) {
  if (!el.commandSubchoices) return;
  el.commandSubchoices.innerHTML = "";
  const p = document.createElement("p");
  p.className = "command-feedback";
  p.textContent = text;
  el.commandSubchoices.appendChild(p);
}

function checkCondition(item) {
  if (!item) return false;

  if (item.requiresAll && !item.requiresAll.every(flag => !!game.flags[flag])) return false;
  if (item.requiresAny && !item.requiresAny.some(flag => !!game.flags[flag])) return false;
  if (item.notFlags && item.notFlags.some(flag => !!game.flags[flag])) return false;

  return true;
}

function applyEffects(effect) {
  if (!effect) return;
  if (effect.setFlags) Object.assign(game.flags, effect.setFlags);
  if (effect.evidence) Object.assign(game.evidence, effect.evidence);
  syncChapterProgressFromFlags();
}

function getEffectImage(effect) {
  if (!effect) return null;
  if (effect.image) return effect.image;
  const evidence = effect.evidence ?? null;
  if (!evidence) return null;
  for (const [id, enabled] of Object.entries(evidence)) {
    if (enabled && evidenceMaster[id]?.image) return evidenceMaster[id].image;
  }
  return null;
}

function getCurrentScene() {
  return scenes[game.sceneId];
}

function getActionKey(command, action) {
  return `${game.sceneId}:${command}:${action.id}`;
}

function isActionAvailable(action, command) {
  if (!checkCondition(action)) return false;
  if (action.once && game.actionHistory[getActionKey(command, action)]) return false;
  return true;
}

function renderActionChoices(command) {
  if (game.isTyping || game.waitingForAdvance || game.activeQuiz) return;

  const scene = getCurrentScene();
  if (!scene || scene.type !== "location") return;

  clearCommandSubchoices();
  setActiveCommand(command);

  const actions = (scene.commands?.[command] ?? []).filter(action => isActionAvailable(action, command));

  if (command === "evidence") {
    actions.forEach(action => appendActionButton(command, action));

    const owned = Object.entries(game.evidence).filter(([, value]) => value);
    const listButton = document.createElement("button");
    listButton.type = "button";
    listButton.className = "command-subchoice-button";
    listButton.textContent = "証拠一覧";
    listButton.addEventListener("click", event => {
      event.stopPropagation();
      openEvidenceList();
    });
    el.commandSubchoices?.appendChild(listButton);

    if (!actions.length && !owned.length) {
      return showCommandFeedback("まだ証拠はありません。");
    }
    return;
  }

  if (!actions.length) {
    const messages = {
      talk: "今は話しかける相手はいない。",
      ask: "今、聞けることはなさそうだ。",
      look: "特に見るものはなさそうだ。",
      search: "ここで調べるものはなさそうだ。"
    };
    return showCommandFeedback(messages[command] ?? "今は使えないコマンドだ。");
  }

  actions.forEach(action => appendActionButton(command, action));
}

function appendActionButton(command, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "command-subchoice-button";
  button.textContent = action.label;
  button.addEventListener("click", event => {
    event.stopPropagation();
    ensureAudioContext();
    executeAction(command, action);
  });
  el.commandSubchoices?.appendChild(button);
}

function executeAction(command, action) {
  if (!checkCondition(action)) return;

  clearCommandSubchoices();
  if (action.once) game.actionHistory[getActionKey(command, action)] = true;

  applyEffects(action);

  const previewImage = getEffectImage(action);
  if (previewImage) showEvidenceImage(previewImage);

  const afterLines = () => {
    if (action.quiz) startQuiz(action.quiz);
    else showLocationIdle();
  };

  if (action.lines?.length) startLines(action.lines, afterLines);
  else afterLines();
}

function startQuiz(quiz) {
  clearCommandAvailability();
  game.activeQuiz = quiz;
  clearCommandSubchoices();
  clearMessage();
  if (el.message) el.message.textContent = quiz.question ?? "";
  setActiveCommand("evidence");

  quiz.choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "command-subchoice-button quiz-command-choice";
    button.textContent = choice.text;
    button.addEventListener("click", event => {
      event.stopPropagation();
      ensureAudioContext();

      if (!choice.correct) {
        showQuizFeedback(quiz.wrongText ?? "もう一度考えましょう。", () => startQuiz(quiz));
        return;
      }

      applyEffects(choice);
      applyEffects(quiz);

      const finishCorrect = () => {
        if (quiz.nextQuiz) startQuiz(quiz.nextQuiz);
        else {
          game.activeQuiz = null;
          if (quiz.afterLines?.length) startLines(quiz.afterLines, showLocationIdle);
          else showLocationIdle();
        }
      };

      showQuizFeedback(quiz.correctText ?? "正解です。", finishCorrect);
    });
    el.commandSubchoices?.appendChild(button);
  });
}

function showQuizFeedback(text, callback) {
  clearCommandSubchoices();
  hideSpeaker();
  if (el.message) el.message.textContent = text;
  game.waitingForAdvance = true;
  setNextIndicator(true);
  game.lineQueue = [];
  game.lineIndex = -1;
  game.lineFinishCallback = () => {
    game.waitingForAdvance = false;
    callback();
  };
}

function handleCommand(type) {
  if (game.isTyping || game.waitingForAdvance || game.activeQuiz) return;

  if (type === "move") {
    openMoveChoices();
    return;
  }

  renderActionChoices(type);
}

function isSpotUnlocked(spotId) {
  if (!movementMap?.spots?.[spotId]) return false;

  if (["H1", "H2", "H3", "H4"].includes(spotId)) return true;
  if (spotId === "H5") return !!game.flags.hotelConfirmUnlocked;
  if (spotId === "H6") return !!game.flags.giftAreaUnlocked;

  if (["K1", "K2", "K3"].includes(spotId)) return !!game.flags.kiryuyaUnlocked;

  if (spotId === "S1" || spotId === "S2") return !!game.flags.kyotoStationUnlocked;
  if (spotId === "S3") return !!game.flags.shopWitness;
  if (spotId === "S4") return !!game.flags.toiletUnlocked;
  if (spotId === "S5") return !!game.flags.gateUnlocked;

  return false;
}

function openMoveChoices() {
  if (game.isTyping || game.waitingForAdvance || game.activeQuiz) return;

  if (!movementMap?.spots?.[game.currentSpotId]) {
    return showCommandFeedback("この場面では移動できません。");
  }

  clearCommandSubchoices();
  setActiveCommand("move");

  // 現在地との隣接関係には制限しない。
  // 一度解放された場所なら、どこからでも直接移動できる。
  const destinations = Object.entries(movementMap.spots)
    .filter(([id]) => id !== game.currentSpotId && isSpotUnlocked(id))
    .map(([id, spot]) => ({ id, ...spot }));

  if (!destinations.length) {
    return showCommandFeedback("今は移動できる場所がありません。");
  }

  const groups = [
    { title: "ホテル", ids: ["H1", "H2", "H3", "H4", "H5", "H6"] },
    { title: "桐生屋", ids: ["K1", "K2"] },
    { title: "京都駅", ids: ["S1", "S2", "S3", "S4", "S5"] }
  ];

  groups.forEach(group => {
    const groupSpots = destinations.filter(spot => group.ids.includes(spot.id));
    if (!groupSpots.length) return;

    const heading = document.createElement("div");
    heading.className = "move-group-title";
    heading.textContent = group.title;
    el.commandSubchoices?.appendChild(heading);

    groupSpots.forEach(spot => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "command-subchoice-button";
      button.textContent = spot.label;
      button.addEventListener("click", event => {
        event.stopPropagation();
        travelToSpot(spot.id);
      });
      el.commandSubchoices?.appendChild(button);
    });
  });
}

function travelToSpot(spotId) {
  if (spotId === "K3") spotId = "K2";
  if (!isSpotUnlocked(spotId)) return;
  const spot = movementMap.spots[spotId];
  if (!spot) return;
  renderScene(spot.sceneId);
}

function selectEnterVariant(scene) {
  const variants = scene.enterVariants ?? [];
  for (const variant of variants) {
    if (!checkCondition(variant)) continue;
    if (variant.onceFlag && game.flags[variant.onceFlag]) continue;
    return variant;
  }
  return null;
}

function renderScene(sceneId) {
  if (sceneId === "K3") sceneId = "K2";
  const scene = scenes[sceneId];
  if (!scene) return console.error(`Scene not found: ${sceneId}`);

  clearTypingTimer();

  // 表紙・章OPで使ったHTMLメニューを本編へ持ち越さない
  if (scene.type !== "title" && scene.type !== "chapter") {
    if (el.choiceArea) el.choiceArea.innerHTML = "";
  }

  game.sceneId = sceneId;
  game.currentSpotId = scene.spotId ?? null;
  game.activeQuiz = null;
  game.waitingForAdvance = false;
  game.lineQueue = [];
  game.lineIndex = -1;
  clearCommandSubchoices();
  clearEvidenceImage();
  clearMessage();

  el.game?.classList.remove("title-screen", "chapter-screen");

  renderBackground(scene.background);
  renderLocation(scene.location);

  if (scene.type === "title") {
    renderTitleScene(scene);
    return;
  }

  if (scene.type === "chapter") {
    renderChapterScene(scene);
    return;
  }

  const variant = selectEnterVariant(scene);
  if (variant) {
    if (variant.onceFlag) game.flags[variant.onceFlag] = true;
    applyEffects(variant);
    const variantImage = getEffectImage(variant);
    if (variantImage) showEvidenceImage(variantImage);
    if (variant.lines?.length) {
      if (sceneId === "H1" && !game.flags.tutorialShown) {
        startLines(variant.lines, () => maybeShowTutorial(showLocationIdle));
      } else {
        startLines(variant.lines, showLocationIdle);
      }
      return;
    }
  }

  if (sceneId === "H1" && !game.flags.tutorialShown) {
    maybeShowTutorial(showLocationIdle);
  } else {
    showLocationIdle();
  }
}

function showLocationIdle() {
  game.waitingForAdvance = false;
  game.activeQuiz = null;
  setNextIndicator(false);
  hideSpeaker();
  clearEvidenceImage();

  const scene = getCurrentScene();
  if (!scene || scene.type !== "location") return;

  if (el.message) {
    if (game.flags.chapter1Clear && game.sceneId === "H6") {
      el.message.textContent = "第1章　京都駅前、花嫁は消えた　― 終 ―";
    } else {
      el.message.textContent = scene.idleText ?? "";
    }
  }

  clearCommandSubchoices();
  updateCommandAvailability();
}

function renderBackground(path) {
  if (!el.background) return;
  el.background.style.backgroundImage = path ? `url("${path}")` : "";
}

function renderLocation(location) {
  if (!el.locationBadge) return;
  if (!location) {
    el.locationBadge.hidden = true;
    el.locationBadge.textContent = "";
    return;
  }
  el.locationBadge.hidden = false;
  el.locationBadge.textContent = location;
}

function showEvidenceImage(path) {
  if (!el.evidenceImage) return;
  el.evidenceImage.src = path;
  el.evidenceImage.hidden = false;
}

function clearEvidenceImage() {
  if (!el.evidenceImage) return;
  el.evidenceImage.hidden = true;
  el.evidenceImage.removeAttribute("src");
}

function renderTitleScene(scene) {
  clearCommandAvailability();
  clearCommandSubchoices();
  el.game?.classList.add("title-screen");

  if (el.commandPanel) el.commandPanel.style.display = "none";

  const ui = document.createElement("div");
  ui.className = "title-ui";
  el.choiceArea.innerHTML = "";

  const makeButton = (text, action) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "title-ui-button";
    b.textContent = text;
    b.addEventListener("click", event => {
      event.stopPropagation();
      ensureAudioContext();
      action();
    });
    return b;
  };

  ui.append(
    makeButton("はじめから", () => {
      game = createFreshGameState();
      try { localStorage.removeItem(SAVE_KEY); } catch {}
      renderScene("OP01");
    }),
    makeButton("つづきから", loadGame),
    makeButton("設定", openSettings),
    makeButton("終了", () => showSimpleMessage("ゲームを終了する場合は、このタブまたはウィンドウを閉じてください。"))
  );

  el.choiceArea.appendChild(ui);
}

function renderChapterScene(scene) {
  clearCommandAvailability();
  el.game?.classList.add("chapter-screen");
  if (el.commandPanel) el.commandPanel.style.display = "none";

  const ui = document.createElement("div");
  ui.className = "title-ui chapter-title-ui";
  el.choiceArea.innerHTML = "";

  const makeButton = (text, action) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "title-ui-button";
    b.textContent = text;
    b.addEventListener("click", event => {
      event.stopPropagation();
      ensureAudioContext();
      action();
    });
    return b;
  };

  ui.append(
    makeButton("第1章をはじめる", () => {
      if (el.choiceArea) el.choiceArea.innerHTML = "";
      if (el.commandPanel) el.commandPanel.style.display = "";
      renderScene(scene.startScene);
    }),
    makeButton("つづきから", loadGame),
    makeButton("設定", openSettings),
    makeButton("終了", () => showSimpleMessage("ゲームを終了する場合は、このタブまたはウィンドウを閉じてください。"))
  );

  el.choiceArea.appendChild(ui);
}

function openEvidenceList() {
  const owned = Object.entries(game.evidence)
    .filter(([, value]) => value)
    .map(([id]) => ({ id, ...evidenceMaster[id] }))
    .filter(item => item.image);

  const overlay = makeOverlay("証拠");

  if (!owned.length) {
    const p = document.createElement("p");
    p.textContent = "まだ証拠はありません。";
    overlay.body.appendChild(p);
    return;
  }

  const list = document.createElement("div");
  list.className = "evidence-list";

  owned.forEach(item => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "evidence-card";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;

    const body = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.name;
    const desc = document.createElement("p");
    desc.textContent = item.description ?? "";
    body.append(title, desc);

    card.append(img, body);
    card.addEventListener("click", () => showEvidenceViewer(item));
    list.appendChild(card);
  });

  overlay.body.appendChild(list);
}

function showEvidenceViewer(item) {
  const overlay = makeOverlay(item.name);
  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.name;
  img.className = "evidence-viewer-image";
  const p = document.createElement("p");
  p.textContent = item.description ?? "";
  overlay.body.append(img, p);
}

function makeOverlay(titleText) {
  const overlay = document.createElement("div");
  overlay.className = "game-overlay";

  const panel = document.createElement("div");
  panel.className = "overlay-panel";

  const header = document.createElement("div");
  header.className = "overlay-header";

  const title = document.createElement("h2");
  title.textContent = titleText;

  const close = document.createElement("button");
  close.type = "button";
  close.className = "overlay-close";
  close.textContent = "閉じる";

  const body = document.createElement("div");
  body.className = "overlay-body";

  close.addEventListener("click", () => overlay.remove());

  header.append(title, close);
  panel.append(header, body);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  return { overlay, panel, body };
}

function showSimpleMessage(text) {
  const overlay = makeOverlay("お知らせ");
  const p = document.createElement("p");
  p.textContent = text;
  overlay.body.appendChild(p);
}

function openHelp() {
  const overlay = makeOverlay("ヘルプ");

  const heading = document.createElement("h3");
  heading.textContent = "セーブについて";

  const list = document.createElement("ul");
  list.className = "save-help-list";
  [
    "セーブデータは、このブラウザの保存領域（localStorage）に保存されます。",
    "同じPC・同じブラウザでのみ利用できます。別のPCや別のブラウザには引き継がれません。",
    "シークレットモードでは、終了時にセーブデータが消える場合があります。",
    "ブラウザの閲覧データ・サイトデータを削除すると、セーブデータや章クリア情報も消える場合があります。",
    "章をクリアした記録は、途中セーブとは別に保存されます。今後の章選択に利用できるようにしています。"
  ].forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });

  overlay.body.append(heading, list);
}

function openSettings() {
  const overlay = makeOverlay("設定");

  const soundRow = document.createElement("div");
  soundRow.className = "setting-row";
  const soundLabel = document.createElement("span");
  soundLabel.textContent = "文字音";
  const soundButton = document.createElement("button");
  soundButton.type = "button";
  soundButton.textContent = settings.soundOn ? "ON" : "OFF";
  soundButton.addEventListener("click", () => {
    settings.soundOn = !settings.soundOn;
    soundButton.textContent = settings.soundOn ? "ON" : "OFF";
    if (settings.soundOn) ensureAudioContext();
    saveSettings();
  });
  soundRow.append(soundLabel, soundButton);

  const speedTitle = document.createElement("div");
  speedTitle.className = "setting-label";
  speedTitle.textContent = "文字送り速度";

  const speedGroup = document.createElement("div");
  speedGroup.className = "speed-group";
  const labels = {
    1: "1 とても遅い",
    2: "2 遅い",
    3: "3 ふつう",
    4: "4 速い",
    5: "5 とても速い"
  };

  for (let level = 1; level <= 5; level++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "speed-button";
    b.textContent = labels[level];
    if (settings.speedLevel === level) b.classList.add("is-selected");
    b.addEventListener("click", () => {
      settings.speedLevel = level;
      saveSettings();
      speedGroup.querySelectorAll(".speed-button").forEach(node => node.classList.remove("is-selected"));
      b.classList.add("is-selected");
    });
    speedGroup.appendChild(b);
  }

  overlay.body.append(soundRow, speedTitle, speedGroup);
}

function saveGame() {
  try {
    syncChapterProgressFromFlags();
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 1,
      sceneId: game.sceneId,
      currentSpotId: game.currentSpotId,
      flags: game.flags,
      evidence: game.evidence,
      actionHistory: game.actionHistory
    }));
    return true;
  } catch (error) {
    console.warn(error);
    showSimpleMessage("セーブできませんでした。");
    return false;
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return showSimpleMessage("セーブデータがありません。");

    const data = JSON.parse(raw);
    game = createFreshGameState();
    game.flags = { ...game.flags, ...(data.flags ?? {}) };
    game.evidence = { ...game.evidence, ...(data.evidence ?? {}) };
    game.actionHistory = data.actionHistory ?? {};
    syncChapterProgressFromFlags();

    if (el.commandPanel) el.commandPanel.style.display = "";
    renderScene(data.sceneId ?? data.currentSpotId ?? "H1");
  } catch (error) {
    console.error(error);
    showSimpleMessage("セーブデータを読み込めませんでした。");
  }
}

function openSystemMenu() {
  const overlay = makeOverlay("MENU");

  const items = [
    ["証拠を見る", openEvidenceList],
    ["セーブ", () => {
      if (!saveGame()) return;
      if (!hasSeenSaveNotice()) {
        markSaveNoticeSeen();
        const notice = makeOverlay("セーブしました");
        const p1 = document.createElement("p");
        p1.textContent = "セーブデータは、このブラウザに保存されます。";
        const p2 = document.createElement("p");
        p2.textContent = "同じPC・同じブラウザでのみ利用できます。";
        const p3 = document.createElement("p");
        p3.textContent = "シークレットモードや、ブラウザの閲覧データ・サイトデータを削除した場合は、セーブデータや章クリア情報が消えることがあります。";
        const p4 = document.createElement("p");
        p4.className = "save-notice-small";
        p4.textContent = "この案内は初回セーブ時のみ表示します。内容は MENU → ヘルプ からいつでも確認できます。";
        notice.body.append(p1, p2, p3, p4);
      } else {
        showSimpleMessage("セーブしました。");
      }
    }],
    ["ヘルプ", openHelp],
    ["設定", openSettings],
    ["タイトルへ戻る", () => renderScene("T00")]
  ];

  items.forEach(([label, action]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "menu-action-button";
    b.textContent = label;
    b.addEventListener("click", () => {
      overlay.overlay.remove();
      action();
    });
    overlay.body.appendChild(b);
  });
}

function bindEvents() {
  document.addEventListener("pointerdown", ensureAudioContext, { once: true });
  el.game?.addEventListener("click", handleGameAdvance);
  document.addEventListener("keydown", handleKeydown);

  el.cmdTalk?.addEventListener("click", event => { event.stopPropagation(); handleCommand("talk"); });
  el.cmdAsk?.addEventListener("click", event => { event.stopPropagation(); handleCommand("ask"); });
  el.cmdLook?.addEventListener("click", event => { event.stopPropagation(); handleCommand("look"); });
  el.cmdSearch?.addEventListener("click", event => { event.stopPropagation(); handleCommand("search"); });
  el.cmdEvidence?.addEventListener("click", event => { event.stopPropagation(); handleCommand("evidence"); });
  el.cmdMove?.addEventListener("click", event => { event.stopPropagation(); handleCommand("move"); });
  el.menuButton?.addEventListener("click", event => { event.stopPropagation(); openSystemMenu(); });
}

function init() {
  bindEvents();
  renderScene("T00");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
