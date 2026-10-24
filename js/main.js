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
const SAVE_SCHEMA_VERSION = 5;

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
  cleaner:      { frequency: 275, type: "triangle" }
};

const FACE_TABLE = {
  shichijo: "images/faces/face_shichijo.webp",
  soichiro: "images/faces/face_soichiro.webp",
  sojiro: "images/faces/face_sojiro.webp",
  saya: "images/faces/face_saya.webp",
  hotelStaff: "images/faces/face_hotel_staff.webp",
  hotelManager: "images/faces/face_hotel_manager.webp",
  shopClerk: "images/faces/face_shop_clerk.webp",
  cleaner: "images/faces/face_cleaner.webp",
  kamiya: "images/faces/face_kamiya.webp",
  portReception: "images/faces/face_otsu_port_reception.webp",
  potteryOwner: "images/faces/face_pottery_owner.webp"
};

let settings = loadSettings();
let game = createFreshGameState();

const el = {
  game: document.querySelector("#game"),
  background: document.querySelector("#background"),
  backgroundImage: document.querySelector("#background-image"),
  characterLayer: document.querySelector("#character-layer"),
  speaker: document.querySelector("#speaker-name"),
  portraitWrap: document.querySelector("#speaker-portrait-wrap"),
  portrait: document.querySelector("#speaker-portrait"),
  locationBadge: document.querySelector("#location-badge"),
  message: document.querySelector("#message-text"),
  choiceArea: document.querySelector("#choice-area"),
  deductionLayer: document.querySelector("#deduction-layer"),
  evidenceImage: document.querySelector("#evidence-image"),
  nextIndicator: document.querySelector("#next-indicator"),
  menuButton: document.querySelector("#menu-button"),
  commandPanel: document.querySelector("#command-panel"),
  commandPanelTitle: document.querySelector(".command-panel-title"),
  commandMainButtons: document.querySelector("#command-main-buttons"),
  commandSubchoices: document.querySelector("#command-subchoices"),
  cmdTalk: document.querySelector("#cmd-talk"),
  cmdAsk: document.querySelector("#cmd-ask"),
  cmdLook: document.querySelector("#cmd-look"),
  cmdSearch: document.querySelector("#cmd-search"),
  cmdShow: document.querySelector("#cmd-show"),
  cmdEvidence: document.querySelector("#cmd-evidence"),
  cmdMove: document.querySelector("#cmd-move")
};

let audioContext = null;
let audioUnlocked = false;


function isSmartphoneLike() {
  try {
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
    const shortSide = Math.min(window.innerWidth, window.innerHeight);
    return !!coarse && shortSide <= 700;
  } catch {
    return false;
  }
}

function refreshMobileAudioContext() {
  if (!isSmartphoneLike() || !settings.soundOn || !audioContext) return;
  try {
    if (audioContext.state !== "running") {
      const result = audioContext.resume();
      if (result?.catch) result.catch(() => {});
    }
  } catch (error) {
    console.warn("スマホの音声機能を再開できませんでした。", error);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureTelegramEvidence() {
  const evidencePresent = game.evidence.telegram === true;
  const flagPresent = game.flags.telegramFound === true;
  if (evidencePresent && flagPresent) return false;
  game.evidence.telegram = true;
  game.flags.telegramFound = true;
  return true;
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
    waitingForAdvance: false,
    lineFinishCallback: null,
    autoFinishLastLine: false,
    deductionMode: false,
    activeQuiz: null
  };
}

function migrateLegacySave(data) {
  const migrated = { ...data };
  migrated.flags = { ...(data.flags ?? {}) };
  migrated.evidence = { ...(data.evidence ?? {}) };
  migrated.actionHistory = { ...(data.actionHistory ?? {}) };

  // 第2章の途中セーブを新しい再訪条件へ引き継ぐ。
  // 旧版では紗月の部屋が第2章開始時に解放されていたため、その解放済み状態を閉じ戻さない。
  const c2Unlocked = Array.isArray(migrated.flags.c2UnlockedLocations)
    ? migrated.flags.c2UnlockedLocations : [];
  if (migrated.flags.chapter2Started && (
    c2Unlocked.includes("C2_ROOM") || migrated.currentSpotId === "C2_ROOM" || migrated.sceneId === "C2_ROOM"
  )) migrated.flags.c2_roomUnlocked = true;
  // 旧版の宗一郎専用ロケーションは披露宴受付前へ統合された。
  // 現在地と解放済み地点を読み替え、会話・証拠などの進行フラグは保持する。
  const oldSoichiroSpots = new Set(["C2_SOICHIRO", "HOTEL_SOICHIRO", "ホテル・宗一郎"]);
  if (oldSoichiroSpots.has(migrated.currentSpotId) || oldSoichiroSpots.has(migrated.sceneId)) {
    migrated.currentSpotId = "C2_HOTEL";
    migrated.sceneId = "C2_HOTEL";
  }
  if (Array.isArray(migrated.flags.c2UnlockedLocations)) {
    migrated.flags.c2UnlockedLocations = migrated.flags.c2UnlockedLocations.filter(id => !oldSoichiroSpots.has(id));
  }
  if (!Object.prototype.hasOwnProperty.call(migrated.flags, "c2_roomVisitedOnce") &&
      migrated.flags.chapter2Started && (migrated.flags.c2_roomUnlocked || c2Unlocked.includes("C2_ROOM"))) {
    // 旧版では訪問履歴を個別保存していなかったため、部屋の解放済み状態を再訪条件へ引き継ぐ。
    migrated.flags.c2_roomVisitedOnce = true;
  }
  if (migrated.flags.c2_kugaLocated) migrated.flags.omiHachimanHintKnown = true;
  if (migrated.flags.c2_travelMemo || migrated.evidence.travelMemo) migrated.flags.travelMemoKnown = true;
  if (migrated.flags.c2_fragment || migrated.evidence.fragmentMemo) migrated.flags.fragmentMemoKnown = true;
  if (migrated.flags.c2_shard || migrated.evidence.potteryShard) migrated.flags.potteryShardKnown = true;
  if (migrated.flags.c2_kamiyaNotesFound || migrated.evidence.kamiyaNotes) {
    migrated.flags.kamiyaNotesKnown = true;
    migrated.flags.kamiyaNotesPermissionKnown = true;
  }
  if (migrated.flags.c2_bookmark || migrated.flags.c2_templeVisited) {
    migrated.flags.c2_ishiyamaderaLeadKnown = true;
  }
  if (migrated.flags.c2_phoneKnown) migrated.flags.kamiyaPhoneKnown = true;
  // 旧版では受付周辺で紙を確認した状態を c2_fakePaperChecked にまとめていた。
  // 途中セーブの推理進行を保つため、新しい紙の性質フラグへ読み替える。
  if (migrated.flags.c2_fakePaperChecked) migrated.flags.fakeTelegramKnown = true;
  // 旧版は第2章開始時に琵琶湖線情報を補っていたため、開始前に保存された第1章クリア状態を引き継ぐ。
  if (migrated.flags.chapter1Clear && !Object.prototype.hasOwnProperty.call(migrated.flags, "biwakoLineDirectionKnown")) {
    migrated.flags.biwakoLineDirectionKnown = true;
  }
  // 旧版では紙の確認フラグがそのまま大津港解放にも使われていたため、
  // すでに写真確認を終えたセーブの移動先は閉じ戻さない。
  if (migrated.flags.c2_fakePaperPhotoChecked ||
      (Array.isArray(migrated.flags.c2UnlockedLocations) && migrated.flags.c2UnlockedLocations.includes("C2_PORT")) ||
      migrated.currentSpotId === "C2_PORT" || migrated.sceneId === "C2_PORT") {
    migrated.flags.lakeBuoyKnown = true;
    migrated.flags.otsuPortUnlocked = true;
  }
  // 旧版では神谷の会話でも c2_portWarningKnown が立っていた。
  // 港の証言を示す専用フラグが残っている場合だけ、意味を引き継ぐ。
  const portWarningFactKnown = !!(migrated.flags.kugaWarningHintKnown || migrated.flags.c2_kugaWarningHintKnown);
  if (portWarningFactKnown) migrated.flags.c2_portWarningKnown = true;
  else if (migrated.flags.c2_portWarningKnown) migrated.flags.c2_portWarningKnown = false;

  // 旧版の神谷ルートですでにコピーを得ているセーブは、取得済み状態を保つ。
  if (migrated.flags.c2_warning || migrated.evidence.kugaWarning) {
    migrated.flags.warningCopyExistKnown = true;
    migrated.flags.warningDocumentKnown = true;
    migrated.flags.soichiroSignatureKnown = true;
  }

  // 旧版のK3（応接スペース）は、統合後のK2（桐生屋店内）へ読み替える。
  if (migrated.sceneId === "K3" || migrated.currentSpotId === "K3") {
    migrated.sceneId = "K2";
    migrated.currentSpotId = "K2";
  }

  // 店内解放フラグ追加前のセーブで、すでに店内へ進んでいた場合は閉じ戻さない。
  const alreadyReachedKiryuyaInside =
    migrated.sceneId === "K2" ||
    migrated.currentSpotId === "K2" ||
    migrated.flags.sayaMet ||
    migrated.flags.preWeddingPhotoKnown ||
    migrated.flags.nailFound;
  if (alreadyReachedKiryuyaInside) migrated.flags.kiryuyaInsideUnlocked = true;

  Object.entries(migrated.actionHistory).forEach(([key, value]) => {
    if (!key.startsWith("K3:")) return;
    const compatibleKey = key.replace(/^K3:/, "K2:");
    if (!(compatibleKey in migrated.actionHistory)) migrated.actionHistory[compatibleKey] = value;
  });

  return migrated;
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
  if (game?.flags?.chapter2Clear) markChapterCleared(2);
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
  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === "suspended") {
      const resumeResult = audioContext.resume();
      if (resumeResult?.catch) resumeResult.catch(() => {});
    }
    audioUnlocked = true;
  } catch (error) {
    // 音声が使えない環境でも、画面遷移とゲーム操作は止めない。
    audioUnlocked = false;
    console.warn("音声機能を開始できませんでした。", error);
  }
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
  game.typingTimer = null;
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
      if (game.autoFinishLastLine && game.lineIndex === game.lineQueue.length - 1) {
        game.waitingForAdvance = false;
        setNextIndicator(false);
        game.autoFinishLastLine = false;
        queueMicrotask(showNextLine);
        return;
      }
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
  if (game.autoFinishLastLine && game.lineIndex === game.lineQueue.length - 1) {
    game.waitingForAdvance = false;
    setNextIndicator(false);
    game.autoFinishLastLine = false;
    queueMicrotask(showNextLine);
    return true;
  }
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

function startLines(lines, callback = null, options = {}) {
  clearCommandAvailability();
  hideCommandPanel();
  game.lineQueue = lines ?? [];
  game.lineIndex = -1;
  game.lineFinishCallback = callback;
  game.autoFinishLastLine = !!options.autoFinishLastLine;
  showNextLine();
}

function showNextLine() {
  game.lineIndex += 1;

  if (game.lineIndex >= game.lineQueue.length) {
    game.waitingForAdvance = false;
    setNextIndicator(false);
    const callback = game.lineFinishCallback;
    game.lineFinishCallback = null;
    game.autoFinishLastLine = false;
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

const COMMAND_LABELS = {
  talk: "はなす",
  ask: "きく",
  look: "みる",
  search: "しらべる",
  show: "みせる",
  evidence: "しょうこ",
  move: "いどう"
};

function hideCommandPanel() {
  if (!el.commandPanel) return;
  el.commandPanel.classList.add("is-hidden");
  el.commandPanel.setAttribute("aria-hidden", "true");
}

function showMainCommands() {
  if (!el.commandPanel) return;
  el.commandPanel.style.display = "";
  el.commandPanel.classList.remove("is-hidden", "has-subchoices");
  el.commandPanel.setAttribute("aria-hidden", "false");
  if (el.commandPanelTitle) el.commandPanelTitle.textContent = "COMMAND";
  clearCommandSubchoices();
  updateCommandAvailability();
}

function showSubchoicePanel(command, options = {}) {
  if (!el.commandPanel || !el.commandSubchoices) return;
  const allowBack = options.allowBack !== false;
  const label = options.label ?? COMMAND_LABELS[command] ?? "選択肢";

  el.commandPanel.style.display = "";
  el.commandPanel.classList.remove("is-hidden");
  el.commandPanel.classList.add("has-subchoices");
  el.commandPanel.setAttribute("aria-hidden", "false");
  if (el.commandPanelTitle) el.commandPanelTitle.textContent = "ACTION";

  const header = document.createElement("div");
  header.className = "command-subchoice-header";

  const title = document.createElement("strong");
  title.className = "command-subchoice-title";
  title.textContent = label;
  header.appendChild(title);

  if (allowBack) {
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "command-back-button";
    backButton.textContent = "コマンドに戻る";
    backButton.addEventListener("click", event => {
      event.stopPropagation();
      showMainCommands();
    });
    header.appendChild(backButton);
  }

  el.commandSubchoices.appendChild(header);
}

function setActiveCommand(type) {
  document.querySelectorAll(".command-button.is-active").forEach((node) => node.classList.remove("is-active"));
  const map = {
    talk: el.cmdTalk,
    ask: el.cmdAsk,
    look: el.cmdLook,
    search: el.cmdSearch,
    show: el.cmdShow,
    evidence: el.cmdEvidence,
    move: el.cmdMove
  };
  map[type]?.classList.add("is-active");
}


function hasAvailableActions(command) {
  const scene = getCurrentScene();
  if (!scene || scene.type !== "location") return false;

  if (command === "show") return getAvailablePresentTargets().length > 0;

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
  const pairs = [["talk",el.cmdTalk],["ask",el.cmdAsk],["look",el.cmdLook],["search",el.cmdSearch],["show",el.cmdShow],["move",el.cmdMove],["evidence",el.cmdEvidence]];
  const c2 = !!game.flags.chapter2Started;
  el.game?.classList.toggle("chapter-two-active", c2);
  const ordered = c2 ? [el.cmdTalk,el.cmdAsk,el.cmdLook,el.cmdSearch,el.cmdShow,el.cmdMove,el.cmdEvidence] : [el.cmdTalk,el.cmdAsk,el.cmdLook,el.cmdSearch,el.cmdEvidence,el.cmdMove];
  ordered.forEach((button,index)=>{ if(button){ button.style.order=String(index); const n=button.querySelector(".command-no"); if(n)n.textContent=String(index+1); } });

  pairs.forEach(([command, button]) => {
    if (!button) return;
    button.classList.toggle("is-available", hasAvailableActions(command));
  });
}

function clearCommandAvailability() {
  [el.cmdTalk, el.cmdAsk, el.cmdLook, el.cmdSearch, el.cmdShow, el.cmdEvidence, el.cmdMove]
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
  p1.textContent = "画面内の6つのコマンドから行動を選びます。";
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
  if (!el.commandPanel?.classList.contains("has-subchoices")) {
    clearCommandSubchoices();
    showSubchoicePanel(null, { label: "お知らせ" });
  }
  [...el.commandSubchoices.children]
    .filter(node => !node.classList.contains("command-subchoice-header"))
    .forEach(node => node.remove());
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
  refreshC2LocationUnlocks();
  syncChapterProgressFromFlags();
}

function refreshC2LocationUnlocks() {
  if (!game?.flags) return;
  if (!Array.isArray(game.flags.c2UnlockedLocations)) game.flags.c2UnlockedLocations = [];
  if (!game.flags.chapter2Started) return;

  const spots = movementMap?.spots ?? {};
  const unlocked = game.flags.c2UnlockedLocations;
  const add = id => { if (id && !unlocked.includes(id)) unlocked.push(id); };
  if (game.currentSpotId?.startsWith("C2_")) add(game.currentSpotId);
  Object.entries(spots).forEach(([id, spot]) => {
    if (!id.startsWith("C2_")) return;
    if (spot.unlockFlag && game.flags[spot.unlockFlag]) add(id);
  });
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
  showSubchoicePanel(command);

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
      talk: game.currentSpotId === "C2_ROOM" ? "ここには話を聞ける相手はいない。" : "今は話しかける相手はいない。",
      ask: game.currentSpotId === "C2_ROOM" ? "ここには話を聞ける相手はいない。" : "今、聞けることはなさそうだ。",
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
  hideCommandPanel();
  if (action.once) game.actionHistory[getActionKey(command, action)] = true;

  applyEffects(action);

  if (action.image) showEvidenceImage(action.image);

  const afterLines = () => {
    if (action.quiz) startQuiz(action.quiz);
    else if (action.chapterEnd) showChapterEndPrompt();
    else if (!maybeAdvanceInvestigation()) returnToCommandsAfterAction();
  };

  if (action.lines?.length) startLines(action.lines, afterLines, { autoFinishLastLine: true });
  else afterLines();
}

function returnToCommandsAfterAction() {
  game.waitingForAdvance = false;
  game.activeQuiz = null;
  setNextIndicator(false);
  showMainCommands();
}

function showStoryProgressPrompt(label, buttonText, callback) {
  game.waitingForAdvance = false;
  game.activeQuiz = null;
  setNextIndicator(false);
  clearCommandSubchoices();
  showSubchoicePanel(null, { allowBack: false, label });

  const button = document.createElement("button");
  button.type = "button";
  button.className = "command-subchoice-button story-progress-button";
  button.textContent = buttonText;
  button.addEventListener("click", event => {
    event.stopPropagation();
    ensureAudioContext();
    hideCommandPanel();
    callback();
  });
  el.commandSubchoices?.appendChild(button);
}

function showChapterEndPrompt() {
  if (game.flags.chapter2Started) showStoryProgressPrompt("第2章", "第2章を終える", showChapterTwoEnding);
  else showStoryProgressPrompt("第1章", "第1章を終える", showChapterOneEnding);
}

function isStationInvestigationComplete() {
  return ["S1", "S2", "S3", "S4", "S5"].includes(game.sceneId) &&
    !!game.flags.nailMatched &&
    !!game.flags.shopWitness &&
    !!game.flags.foldedBoxFound &&
    !!game.flags.departureBoardChecked &&
    !game.flags.stationMysterySolved &&
    !game.activeQuiz;
}

function isHotelDeductionReady() {
  return game.sceneId === "H1" &&
    !!game.flags.stationMysterySolved &&
    !game.flags.chapterMysterySolved &&
    !game.activeQuiz;
}

function getStationDeductionQuiz() {
  const action = scenes.S5?.commands?.evidence
    ?.find(item => item.id === "organize_station");
  return action?.quiz ?? null;
}

function isC2FinalReportReady() {
  const action = scenes.C2_HOTEL?.commands?.talk
    ?.find(item => item.id === "soichiro_final_report");
  return !!game.flags.chapter2Started && !!action && checkCondition(action);
}

function maybeAdvanceInvestigation() {
  if (isC2FinalReportReady() && !game.flags.c2_reportReturnPromptShown) {
    game.flags.c2_reportReturnPromptShown = true;
    saveGame();
    const lines = game.currentSpotId === "C2_HOTEL"
      ? [
          { speaker: "shichijo", text: "だいぶ情報がそろった。" },
          { speaker: "shichijo", text: "宗一郎さんに、ここまで分かったことを話しておこう。" }
        ]
      : [
          { speaker: "shichijo", text: "だいぶ情報がそろった。" },
          { speaker: "shichijo", text: "一度、宗一郎さんに話をしておこう。" },
          { narrator: "宗一郎に話をするため、披露宴受付前へ戻ろう。" }
        ];
    startLines(lines, showLocationIdle);
    return true;
  }

  if (isStationInvestigationComplete()) {
    showStoryProgressPrompt(
      "次の行動",
      "宗一郎に報告するためホテルへ戻る",
      () => {
        game.flags.stationMysterySolved = true;
        game.flags.hotelReturnUnlocked = true;
        saveGame();
        renderScene("H1");
      }
    );
    return true;
  }

  if (!isHotelDeductionReady()) return false;
  const quiz = getStationDeductionQuiz();
  if (!quiz) return false;

  startLines(
    [{ speaker: "shichijo", text: "では、ここまでに分かったことを整理しましょう" }],
    () => startQuiz({ ...quiz, mode: "deduction" }),
    { autoFinishLastLine: true }
  );
  return true;
}

function startQuiz(quiz) {
  if (quiz.mode === "deduction" || game.deductionMode) {
    startDeductionQuiz(quiz);
    return;
  }

  clearCommandAvailability();
  game.activeQuiz = quiz;
  clearCommandSubchoices();
  showSubchoicePanel("evidence", { allowBack: false, label: "答えを選ぶ" });
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

function enterDeductionScreen() {
  game.deductionMode = true;
  el.game?.classList.add("deduction-screen");
  if (el.deductionLayer) {
    el.deductionLayer.hidden = false;
    el.deductionLayer.innerHTML = "";
  }
  hideCommandPanel();
  clearCommandAvailability();
  clearCommandSubchoices();
  clearEvidenceImage();
  hideSpeaker();
  setNextIndicator(false);
  renderBackground("images/backgrounds/bg_ui_deduction.webp");
}

function clearDeductionScreen() {
  if (!el.deductionLayer) return;
  el.deductionLayer.innerHTML = "";
  el.deductionLayer.hidden = true;
}

function startDeductionQuiz(quiz) {
  enterDeductionScreen();
  game.activeQuiz = quiz;
  if (!el.deductionLayer) return;

  const panel = document.createElement("section");
  panel.className = "deduction-panel";
  const heading = document.createElement("h2");
  heading.textContent = "謎解き";
  const question = document.createElement("p");
  question.className = "deduction-question";
  question.textContent = quiz.question ?? "";
  const choices = document.createElement("div");
  choices.className = "deduction-choices";

  quiz.choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "deduction-choice-button";
    button.textContent = choice.text;
    button.addEventListener("click", event => {
      event.stopPropagation();
      ensureAudioContext();
      if (!choice.correct) {
        showDeductionFeedback(quiz.wrongText ?? "もう一度考えましょう。", "選び直す", () => startDeductionQuiz(quiz));
        return;
      }

      applyEffects(choice);
      applyEffects(quiz);
      const continueAfterCorrect = () => {
        if (quiz.nextQuiz) {
          startDeductionQuiz({ ...quiz.nextQuiz, mode: "deduction" });
          return;
        }
        if (quiz.afterLines?.length) {
          game.activeQuiz = null;
          game.deductionMode = false;
          el.game?.classList.remove("deduction-screen");
          clearDeductionScreen();
          const currentScene = getCurrentScene();
          renderBackground(currentScene?.background);
          renderLocation(currentScene?.location);
          startLines(quiz.afterLines, () => {
            if (quiz.afterSetFlags) Object.assign(game.flags, quiz.afterSetFlags);
            saveGame();
            showChapterEndPrompt();
          });
          return;
        }
        if (!game.flags.chapter2Started) {
          game.flags.stationMysterySolved = true;
          game.flags.chapterMysterySolved = true;
          game.flags.giftAreaUnlocked = true;
          saveGame();
          showDeductionFeedback(quiz.correctText ?? "正解です。", "宗一郎との話を続ける", () => renderScene("H6"));
        } else {
          saveGame();
          showDeductionFeedback(quiz.correctText ?? "正解です。", "調査を続ける", () => renderScene(game.sceneId));
        }
      };

      if (quiz.correctLines?.length) {
        showDeductionLines(quiz.correctLines, quiz.nextQuiz ? "次の推理へ" : "宗一郎との話を続ける", continueAfterCorrect);
      } else {
        showDeductionFeedback(quiz.correctText ?? "正解です。", quiz.nextQuiz ? "次の謎へ" : "次へ", continueAfterCorrect);
      }
    });
    choices.appendChild(button);
  });

  panel.append(heading, question, choices);
  el.deductionLayer.appendChild(panel);
}

function showDeductionLines(lines, finalButtonText, callback) {
  if (!el.deductionLayer) return;
  let index = 0;
  const renderLine = () => {
    el.deductionLayer.innerHTML = "";
    const panel = document.createElement("section");
    panel.className = "deduction-panel deduction-feedback-panel";
    const speaker = document.createElement("p");
    speaker.className = "deduction-feedback-text";
    speaker.textContent = characters[lines[index]?.[0]]?.name ?? "七条";
    const text = document.createElement("p");
    text.className = "deduction-feedback-text";
    text.textContent = lines[index]?.[1] ?? "";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "deduction-next-button";
    button.textContent = index < lines.length - 1 ? "次へ" : finalButtonText;
    button.addEventListener("click", event => {
      event.stopPropagation();
      if (index < lines.length - 1) {
        index += 1;
        renderLine();
      } else {
        callback();
      }
    });
    panel.append(speaker, text, button);
    el.deductionLayer.appendChild(panel);
  };
  renderLine();
}

function showDeductionFeedback(text, buttonText, callback) {
  if (!el.deductionLayer) return;
  el.deductionLayer.innerHTML = "";
  const panel = document.createElement("section");
  panel.className = "deduction-panel deduction-feedback-panel";
  const message = document.createElement("p");
  message.className = "deduction-feedback-text";
  message.textContent = text;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "deduction-next-button";
  button.textContent = buttonText;
  button.addEventListener("click", event => {
    event.stopPropagation();
    callback();
  });
  panel.append(message, button);
  el.deductionLayer.appendChild(panel);
}

function showChapterOneEnding() {
  // 会話だけで第1章を終えた場合も、同じ写真電報を証拠として引き継ぐ。
  ensureTelegramEvidence();
  game.flags.chapter1Clear = true;
  syncChapterProgressFromFlags();
  enterDeductionScreen();
  game.activeQuiz = null;
  if (!el.deductionLayer) return;
  const panel = document.createElement("section");
  panel.className = "chapter-ending-panel";
  const chapterOne = document.createElement("p");
  chapterOne.textContent = "第1章　京都駅前、花嫁は消えた　（終）";
  const chapterTwo = document.createElement("p");
  chapterTwo.textContent = "第2章『十八年前の警告』に続く";
  panel.append(chapterOne, chapterTwo);
  const next = document.createElement("button");
  next.type = "button";
  next.className = "deduction-next-button";
  next.textContent = "第2章を始める";
  next.addEventListener("click", () => startChapterTwo());
  panel.appendChild(next);
  el.deductionLayer.appendChild(panel);
  saveGame();
}

function startChapterTwo() {
  // 第1章クリア・第2章直接開始のどちらでも、既存の写真電報だけを補完する。
  ensureTelegramEvidence();
  game.flags.chapter2Started = true;
  game.flags.chapter1Clear = true;
  game.flags.c2_hotelEntered = true;
  game.currentSpotId = "C2_HOTEL";
  game.sceneId = "C2_HOTEL";
  renderScene("C2_HOTEL");
  refreshC2LocationUnlocks();
  startLines([
    { narrator: "第2章　十八年前の警告" },
    { narrator: "祝電に紛れた紙。湖上に浮かぶ謎の標識。紗月が向かった先を、残された情報から追う。" }
  ], () => { showLocationIdle(); saveGame(); }, { autoFinishLastLine: false });
  saveGame();
}

function showChapterTwoEnding() {
  game.flags.chapter2Clear = true;
  game.flags.chapter1Clear = true;
  syncChapterProgressFromFlags();
  enterDeductionScreen();
  game.activeQuiz = null;
  const panel = document.createElement("section");
  panel.className = "chapter-ending-panel";
  const title = document.createElement("p");
  title.textContent = "第2章　十八年前の警告　完";
  const body = document.createElement("p");
  body.textContent = "紗月は久我清志のいる近江八幡へ向かった可能性が高い。事故の真相を確かめるため、次は久我本人に会う必要がある。";
  const next = document.createElement("p");
  next.textContent = "第3章へ続く";
  panel.append(title, body, next);
  el.deductionLayer.appendChild(panel);
  saveGame();
}

const PRESENT_TARGETS_BY_SPOT = window.KOEI_GAME_DATA.chapter2PresentTargets ?? {
  C2_HOTEL: [["hotelStaff", "ホテル係員", "c2_hotelStaffMet"], ["soichiro", "桐生宗一郎", "c2_soichiroMet"]],
  C2_PORT: [["portReception", "大津港事務所受付", "c2_portWitness"]],
  C2_STATION: [["shopClerk", "京都駅売店員", "c2_stationWitness"]],
  C2_SHIGARAKI: [["potteryOwner", "信楽の陶器店主", "c2_potteryOwnerMet"]],
  C2_KAMIYA: [["kamiya", "神谷朔", "c2_kamiyaHired"]],
  C2_LIBRARY: [["librarian", "司書", "c2_librarianMet"]],
  C2_TEMPLE: [["templeStaff", "寺の人", "c2_templeVisited"]]
};
const PRESENTABLE_EVIDENCE = {
  hotelStaff: ["telegram"],
  soichiro: ["telegram", "kugaWarning", "oldAccidentArticle"],
  portReception: ["telegram", "oldAccidentArticle"],
  shopClerk: ["telegram"],
  potteryOwner: ["potteryShard"],
  kamiya: ["telegram", "oldAccidentArticle", "fragmentMemo", "travelMemo", "kugaWarning"],
  librarian: ["oldAccidentArticle"],
  templeStaff: ["ishiyamaderaBookmark"]
};

function getAvailablePresentTargets() {
  const candidates = PRESENT_TARGETS_BY_SPOT[game.currentSpotId] ?? [];
  return candidates.filter(([id, , metFlag]) =>
    !!game.flags[metFlag] &&
    (PRESENTABLE_EVIDENCE[id] ?? []).some(key => !!game.evidence[key])
  );
}

function isPresentableEvidence(targetId, key) {
  return (PRESENTABLE_EVIDENCE[targetId] ?? []).includes(key) && !!game.evidence[key];
}

function openPresentTargets() {
  if (game.currentSpotId === "C2_ROOM") {
    return showCommandFeedback("ここには証拠を見せる相手はいない。");
  }
  const targets = getAvailablePresentTargets();
  if (!targets.length) return showCommandFeedback("ここで見せられる証拠や、話せる相手はありません。");
  clearCommandSubchoices();
  setActiveCommand("show");
  showSubchoicePanel("show", { label: "相手を選ぶ" });
  targets.forEach(([id, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "command-subchoice-button";
    button.textContent = label;
    button.addEventListener("click", event => {
      event.stopPropagation();
      openPresentEvidence(id, label);
    });
    el.commandSubchoices?.appendChild(button);
  });
}

function openPresentEvidence(targetId, targetLabel) {
  const currentTarget = getAvailablePresentTargets().find(([id]) => id === targetId);
  if (!currentTarget) return showCommandFeedback("この場所で、その相手に証拠を見せることはできない。");
  clearCommandSubchoices();
  showSubchoicePanel("show", { label: `${currentTarget[1]}に見せる証拠` });
  const evidence = (PRESENTABLE_EVIDENCE[targetId] ?? []).filter(key => !!game.evidence[key] && evidenceMaster[key]);
  if (!evidence.length) return showCommandFeedback("今、見せられる証拠はない。");
  evidence.forEach(key => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "command-subchoice-button";
    button.textContent = evidenceMaster[key].name;
    button.addEventListener("click", event => {
      event.stopPropagation();
      presentEvidenceTo(targetId, key);
    });
    el.commandSubchoices?.appendChild(button);
  });
}

function presentEvidenceTo(targetId, key) {
  if (!getAvailablePresentTargets().some(([id]) => id === targetId) || !isPresentableEvidence(targetId, key)) {
    return showCommandFeedback("この場所では、その証拠を見せられない。");
  }
  const responses = {
    hotelStaff: { telegram: [{ speaker: "hotelStaff", text: "受付記録や担当者の記憶からは、誰が紙を用意したかまでは分かりません。" }] },
    soichiro: {
      telegram: [{ speaker: "shichijo", text: "この写真付きの紙に、心当たりはありますか。" }, { speaker: "soichiro", text: "ありません。" }],
      kugaWarning: [
        { speaker: "shichijo", text: "久我さんが事故前に出したという文書です。" },
        { speaker: "soichiro", text: "……。" },
        { speaker: "shichijo", text: "見覚えがありますか。" },
        { speaker: "soichiro", text: "……あります。" },
        { speaker: "shichijo", text: "この署名は、あなたのものですか。" },
        { speaker: "soichiro", text: "……そうです。" },
        { speaker: "shichijo", text: "では、事故の前に船に問題があったことは知っていた。" },
        { speaker: "soichiro", text: "文書を見たことは認めます。" },
        { speaker: "shichijo", text: "それだけですか？" },
        { speaker: "soichiro", text: "今は、それ以上話せません。" }
      ],
      oldAccidentArticle: [{ speaker: "soichiro", text: "当時の事故を報じた記事ですね。関係者の名前は確認できますが、記事だけでは経緯までは分かりません。" }]
    },
    kamiya: {
      telegram: [{ speaker: "kamiya", text: "この写真付きの紙は見たことがありません。誰が用意したかは、他の情報と合わせて考える必要があります。" }],
      oldAccidentArticle: [{ speaker: "kamiya", text: "この記事にある事故について、調査を依頼されました。" }],
      fragmentMemo: [{ speaker: "kamiya", text: "断片だけでは『K』が誰を指すか決められません。事故の記事や関係者の記録と照らしましょう。" }],
      travelMemo: [{ speaker: "kamiya", text: "所要時間と交通手段だけでは行き先を断定できません。ほかの手掛かりと合わせましょう。" }],
      kugaWarning: [{ speaker: "kamiya", text: "これは当時の運航停止を求める文書の写しですね。事故記事と照らす価値があります。" }]
    },
    portReception: {
      telegram: [
        { speaker: "shichijo", text: "この写真について、何か分かりませんか。" },
        { speaker: "portReception", text: "これは灯浮標ですね。" },
        { speaker: "portReception", text: "ただ、こういうものは琵琶湖のあちこちにあります。" },
        { speaker: "portReception", text: "この写真だけで場所を特定するのは難しいですね。" },
        { speaker: "shichijo", text: "そうですか。" },
        { speaker: "portReception", text: "ただ、この辺りも昔はいろいろありましてね。" },
        { speaker: "shichijo", text: "いろいろ？" },
        { speaker: "portReception", text: "十八年くらい前だったと思います。この辺りで、船の事故があったんです。" },
        { speaker: "shichijo", text: "十八年前……。" },
        { speaker: "shichijo", text: "昔のことを調べるには、どうすればいいか……。" },
        { speaker: "portReception", text: "昔の新聞を当たってみたらどうです？" },
        { speaker: "shichijo", text: "新聞？" },
        { speaker: "portReception", text: "図書館の郷土資料コーナーなら、この辺りの昔の記事も残っていると思いますよ。" },
        { narrator: "図書館・郷土資料コーナーへ行けるようになった。" }
      ],
      oldAccidentArticle: [{ speaker: "portReception", text: "十八年前の事故の記事ですね。港の記憶と合わせても、細かな記録までは残っていません。" }]
    },
    shopClerk: {
      telegram: [
        { speaker: "shichijo", text: "この写真に、見覚えはありませんか。" },
        { speaker: "shopClerk", text: "写真ですか？" },
        { speaker: "shichijo", text: "湖のようなんですが、場所が分からなくて。" },
        { speaker: "shopClerk", text: "……あれ。" },
        { speaker: "shichijo", text: "何か？" },
        { speaker: "shopClerk", text: "私、大津に住んでるんですけど。" },
        { speaker: "shopClerk", text: "これと似たの、大津港の近くで見たことがある気がします。" },
        { speaker: "shichijo", text: "大津港？" },
        { speaker: "shopClerk", text: "ええ。" },
        { speaker: "shopClerk", text: "でも、同じものかどうかは分かりませんよ。" },
        { speaker: "shopClerk", text: "こういうの、ほかにもあるかもしれませんし。" },
        { speaker: "shichijo", text: "分かりました。確認してみます。" },
        { narrator: "大津港へ行けるようになった。" }
      ]
    },
    potteryOwner: { potteryShard: [
      { speaker: "shichijo", text: "この欠片、信楽焼でしょうか。" },
      { speaker: "potteryOwner", text: "いや、これは違いますね。" },
      { speaker: "shichijo", text: "そうですか。" },
      { speaker: "potteryOwner", text: "最近は焼き物もいろいろありますからね。" },
      { speaker: "potteryOwner", text: "昔みたいに、土地ごとの特徴だけ見れば分かるってもんでもなくなってきました。" },
      { speaker: "potteryOwner", text: "それに最近は、形や模様なんかも真似されがちでね。" },
      { speaker: "shichijo", text: "真似される？" },
      { speaker: "potteryOwner", text: "ええ。デザインっていうんですか。" },
      { speaker: "potteryOwner", text: "似たものが別のところから出たり、誰が最初に考えたのか分からなくなったり。" },
      { speaker: "potteryOwner", text: "作った人と、世に出した人が同じとは限りませんよ。" }
    ] },
    librarian: { oldAccidentArticle: [{ speaker: "librarian", text: "この記事は当時の地方紙の縮刷版です。前後の記事も閲覧できます。" }] },
    templeStaff: { ishiyamaderaBookmark: [{ speaker: "templeStaff", text: "石山寺と記された古いしおりですね。意匠の詳細は、寺の資料で確認できるかもしれません。" }] }
  };
  const lines = responses[targetId]?.[key] ?? [{ narrator: "相手は証拠を見たが、今のところ新しい情報は得られなかった。" }];
  // 宗一郎に警告文書を示した行為は、コマンド経路にかかわらず同じ進行フラグにする。
  if (targetId === "soichiro" && key === "kugaWarning") {
    game.flags.c2_soichiroSawWarning = true;
    saveGame();
  }
  if (targetId === "shopClerk" && key === "telegram") {
    game.flags.otsuPortUnlocked = true;
    game.flags.otsuPortHintKnown = true;
    // 旧セーブ互換フラグ。新規進行では売店員に見せたときだけ立てる。
    game.flags.c2_fakePaperPhotoChecked = true;
    refreshC2LocationUnlocks();
    saveGame();
  }
  if (targetId === "portReception" && key === "telegram") {
    game.flags.lakeBuoyKnown = true;
    game.flags.lakeAccidentHintKnown = true;
    game.flags.c2_accidentHintKnown = true;
    refreshC2LocationUnlocks();
    saveGame();
  }
  if (targetId === "potteryOwner" && key === "potteryShard") {
    game.flags.c2_shardRejected = true;
    game.flags.c2_designHintKnown = true;
    game.flags.designTheftHintKnown = true;
    game.flags.notShigarakiKnown = true;
    saveGame();
  }
  clearCommandSubchoices();
  hideCommandPanel();
  const item = evidenceMaster[key];
  if (item?.image) showEvidenceImage(item.image);
  startLines(lines, showLocationIdle);
}

function showQuizFeedback(text, callback) {
  clearCommandSubchoices();
  hideCommandPanel();
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

  if (type === "show") {
    openPresentTargets();
    return;
  }

  if (type === "move") {
    openMoveChoices();
    return;
  }

  renderActionChoices(type);
}

function isSpotUnlocked(spotId) {
  if (!movementMap?.spots?.[spotId]) return false;
  if (spotId.startsWith("C2_")) {
    refreshC2LocationUnlocks();
    return !!game.flags.chapter2Started && game.flags.c2UnlockedLocations.includes(spotId);
  }
  // 第2章の移動一覧には、今の章で解放された場所だけを表示する。
  if (game.flags.chapter2Started) return false;
  if (["H1", "H2", "H3", "H4"].includes(spotId)) return true;
  if (spotId === "H5") return !!game.flags.hotelConfirmUnlocked;
  if (spotId === "H6") return !!game.flags.giftAreaUnlocked;

  if (spotId === "K1") return !!game.flags.kiryuyaUnlocked;
  if (spotId === "K2") {
    return !!game.flags.kiryuyaUnlocked && !!game.flags.kiryuyaInsideUnlocked;
  }

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

  refreshC2LocationUnlocks();

  clearCommandSubchoices();
  setActiveCommand("move");
  showSubchoicePanel("move");

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
    { title: "京都駅", ids: ["S1", "S2", "S3", "S4", "S5"] },
    { title: "第2章", ids: Object.keys(movementMap.spots).filter(id => id.startsWith("C2_")) }
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
  const scene = scenes[sceneId];
  if (!scene) return console.error(`Scene not found: ${sceneId}`);

  clearTypingTimer();
  hideCommandPanel();
  clearDeductionScreen();

  // 表紙・章OPで使ったHTMLメニューを本編へ持ち越さない
  if (scene.type !== "title" && scene.type !== "chapter") {
    if (el.choiceArea) el.choiceArea.innerHTML = "";
  }

  game.sceneId = sceneId;
  game.currentSpotId = scene.spotId ?? null;
  if (game.flags.chapter2Started && game.currentSpotId === "C2_ROOM") {
    let roomVisitChanged = false;
    if (game.flags.c2_roomVisitedOnce && game.flags.lakeAccidentKnown && !game.flags.c2_roomRevisitedAfterLibrary) {
      game.flags.c2_roomRevisitedAfterLibrary = true;
      roomVisitChanged = true;
    }
    if (!game.flags.c2_roomVisitedOnce) {
      game.flags.c2_roomVisitedOnce = true;
      roomVisitChanged = true;
    }
    if (roomVisitChanged) saveGame();
  }
  refreshC2LocationUnlocks();
  game.activeQuiz = null;
  game.deductionMode = false;
  game.waitingForAdvance = false;
  game.autoFinishLastLine = false;
  game.lineQueue = [];
  game.lineIndex = -1;
  clearCommandSubchoices();
  clearEvidenceImage();
  clearMessage();

  el.game?.classList.remove("title-screen", "chapter-screen", "deduction-screen");
  el.game?.classList.toggle("chapter-two-active", !!game.flags.chapter2Started);

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

  if (maybeAdvanceInvestigation()) return;

  if (el.message) el.message.textContent = scene.idleText ?? "";

  showMainCommands();
}

function renderBackground(path) {
  if (!el.background) return;
  // CSS背景よりも読み込み状態を確認しやすい通常の画像要素を優先する。
  // 旧HTMLを利用する場合だけ、従来のCSS背景へフォールバックする。
  if (el.backgroundImage) {
    el.background.style.backgroundImage = "";
    if (path) {
      el.backgroundImage.src = path;
      el.backgroundImage.hidden = false;
    } else {
      el.backgroundImage.hidden = true;
      el.backgroundImage.removeAttribute("src");
    }
    return;
  }
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
  if (isSmartphoneLike()) el.game?.classList.add("mobile-evidence-focus");
}

function clearEvidenceImage() {
  if (!el.evidenceImage) return;
  el.evidenceImage.hidden = true;
  el.evidenceImage.removeAttribute("src");
  el.game?.classList.remove("mobile-evidence-focus");
}

function hasSaveData() {
  try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; }
}

function isChapterUnlocked(chapterNumber) {
  if (chapterNumber <= 1) return true;
  const progress = loadProgress();
  return !!progress.chapters[String(chapterNumber - 1)]?.cleared ||
    !!game.flags[`chapter${chapterNumber - 1}Clear`];
}

function startChapterTwoFromSelection() {
  game = createFreshGameState();
  game.flags.chapter1Clear = true;
  game.flags.telegramFound = true;
  game.flags.biwakoLineDirectionKnown = true;
  game.evidence.telegram = true;
  startChapterTwo();
}

function renderTitleScene(scene) {
  clearCommandAvailability();
  clearCommandSubchoices();
  el.game?.classList.add("title-screen");

  hideCommandPanel();

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

  const beginChapterOne = () => {
    game = createFreshGameState();
    try { localStorage.removeItem(SAVE_KEY); } catch {}
    renderScene("OP01");
  };
  const renderMenu = () => {
    ui.innerHTML = "";
    const resume = makeButton("つづきから", loadGame);
    resume.disabled = !hasSaveData();
    resume.setAttribute("aria-disabled", String(resume.disabled));
    ui.append(
      makeButton("はじめから", beginChapterOne),
      resume,
      makeButton("章を選ぶ", renderChapterSelection),
      makeButton("設定", openSettings),
      makeButton("終了", () => showSimpleMessage("ゲームを終了する場合は、このタブまたはウィンドウを閉じてください。"))
    );
  };
  function renderChapterSelection() {
    ui.innerHTML = "";
    const heading = document.createElement("div");
    heading.className = "chapter-select-heading";
    heading.textContent = "章を選ぶ";
    ui.appendChild(heading);
    ui.appendChild(makeButton("第1章　京都駅前、花嫁は消えた", beginChapterOne));

    const unlocked = isChapterUnlocked(2);
    const chapterTwo = makeButton(
      unlocked ? "第2章　十八年前の警告" : "第2章　十八年前の警告　（第1章クリア後）",
      () => renderScene("OP02")
    );
    chapterTwo.disabled = !unlocked;
    chapterTwo.setAttribute("aria-disabled", String(!unlocked));
    ui.appendChild(chapterTwo);
    ui.appendChild(makeButton("タイトルへ戻る", renderMenu));
  }

  renderMenu();
  el.choiceArea.appendChild(ui);
}

function renderChapterScene(scene) {
  clearCommandAvailability();
  el.game?.classList.add("chapter-screen");
  hideCommandPanel();

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
    makeButton(scene.chapterNumber === 2 ? "第2章をはじめる" : "第1章をはじめる", () => {
      if (el.choiceArea) el.choiceArea.innerHTML = "";
      if (el.commandPanel) el.commandPanel.style.display = "";
      if (scene.chapterNumber === 2) startChapterTwoFromSelection();
      else renderScene(scene.startScene);
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

  const saveSummary = document.createElement("p");
  saveSummary.className = "settings-save-summary";
  saveSummary.textContent = "セーブと章クリア記録は、このブラウザに保存されます。章クリア記録は途中セーブとは別に保持されます。詳しくは MENU → ヘルプをご覧ください。";

  overlay.body.append(soundRow, speedTitle, speedGroup, saveSummary);
}

function saveGame() {
  try {
    refreshC2LocationUnlocks();
    syncChapterProgressFromFlags();
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      schemaVersion: SAVE_SCHEMA_VERSION,
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

    const data = migrateLegacySave(JSON.parse(raw));
    game = createFreshGameState();
    game.flags = { ...game.flags, ...(data.flags ?? {}) };
    game.evidence = { ...game.evidence, ...(data.evidence ?? {}) };
    game.actionHistory = data.actionHistory ?? {};
    const telegramRestored = game.flags.chapter2Started && ensureTelegramEvidence();
    refreshC2LocationUnlocks();
    syncChapterProgressFromFlags();

    if (el.commandPanel) el.commandPanel.style.display = "";
    renderScene(data.sceneId ?? data.currentSpotId ?? "H1");
    if (telegramRestored) saveGame();
    if (game.flags.chapter2Clear) showChapterTwoEnding();
    else if (game.flags.chapter2Started && game.flags.c2_reported) showChapterEndPrompt();
    else if (game.flags.chapter1Clear && !game.flags.chapter2Started) showChapterOneEnding();
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

  // iPhone / Android で一度鳴った文字音が、タブ復帰後などに止まる場合だけ再開する。
  // PCではこの追加処理を実行しない。
  if (isSmartphoneLike()) {
    document.addEventListener("pointerdown", refreshMobileAudioContext);
    document.addEventListener("touchstart", refreshMobileAudioContext, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshMobileAudioContext();
    });
    window.addEventListener("pageshow", refreshMobileAudioContext);
  }

  el.game?.addEventListener("click", handleGameAdvance);
  document.addEventListener("keydown", handleKeydown);

  el.cmdTalk?.addEventListener("click", event => { event.stopPropagation(); handleCommand("talk"); });
  el.cmdAsk?.addEventListener("click", event => { event.stopPropagation(); handleCommand("ask"); });
  el.cmdLook?.addEventListener("click", event => { event.stopPropagation(); handleCommand("look"); });
  el.cmdSearch?.addEventListener("click", event => { event.stopPropagation(); handleCommand("search"); });
  el.cmdShow?.addEventListener("click", event => { event.stopPropagation(); handleCommand("show"); });
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
