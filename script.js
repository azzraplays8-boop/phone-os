const LOCK_GREETINGS = [
    { max: 5,  text: "Late night, my love" },
    { max: 12, text: "Good morning, my love" },
    { max: 17, text: "Good afternoon, my love" },
    { max: 21, text: "Good evening, my love" },
    { max: 24, text: "Good night, my love" }
];

let lockTimeTickTimer = null;
let pendingMessagesApp = false;

function getGreeting(hours) {
    const match = LOCK_GREETINGS.find((slot) => hours < slot.max);
    return match ? match.text : "";
}

function updateLockClock(now, timeText, meridiem) {
    const valueEl = document.getElementById("lock-time-value");
    const meridiemEl = document.getElementById("lock-time-meridiem");
    const dateEl = document.getElementById("lock-date");
    const greetingEl = document.getElementById("lock-greeting");
    const timeEl = document.getElementById("lock-time");

    if (valueEl) valueEl.textContent = timeText;
    if (meridiemEl) meridiemEl.textContent = meridiem;

    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
    }

    if (greetingEl) {
        greetingEl.textContent = getGreeting(now.getHours());
    }

    if (timeEl) {
        timeEl.classList.remove("tick");
        void timeEl.offsetWidth;
        timeEl.classList.add("tick");

        clearTimeout(lockTimeTickTimer);
        lockTimeTickTimer = setTimeout(() => {
            timeEl.classList.remove("tick");
        }, 500);
    }
}

function updateTime() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const timeText = `${hours}:${formattedMinutes}`;

    const statusTime = document.getElementById("time");

    if (statusTime) {
        statusTime.textContent = `${timeText} ${ampm}`;
    }

    updateLockClock(now, timeText, ampm);
}

updateTime();
setInterval(updateTime, 1000);


/* LOCK SCREEN NOTIFICATION */

function updateNotificationTimestamp() {
    const stamp = document.getElementById("notification-time");

    if (stamp) {
        stamp.textContent = new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        });
    }
}

function handleNotificationTap() {
    const notification = document.getElementById("lock-notification");

    if (!notification || notification.classList.contains("opened")) {
        return;
    }

    notification.classList.add("opened");
    pendingMessagesApp = true;

    setTimeout(() => {
        unlockPhone();
    }, 380);
}

document.addEventListener("DOMContentLoaded", () => {
    updateNotificationTimestamp();
    updateHomeGreeting();

    const notification = document.getElementById("lock-notification");

    if (notification) {
        notification.addEventListener("click", handleNotificationTap);

        notification.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleNotificationTap();
            }
        });
    }
});


/* ==========================================================
   HOME SCREEN GREETING (visual only)
   ========================================================== */

function updateHomeGreeting() {
    const greeting = document.getElementById("home-greeting");
    if (!greeting) return;

    const text = getGreeting(new Date().getHours());
    greeting.textContent = text ? `${text} ❤️` : "Made for you ❤️";
}

const notesData = [
    {
        id: "a-note-for-you",
        title: "A Note For You ❤️",
        emoji: "💗",
        time: "Today",
        preview: "This phone was made with love, and every little detail was shaped so you could feel my heart in it.",
        content: `
            <div class="note-content-block">
                <p>
                    I made this phone for you because I wanted a place where my love could live in a way that feels warm, personal, and full of little moments.
                </p>
                <p>
                    Every app, every detail, and every quiet surprise was made to remind you that you are my favorite person, my safe place, and the happiest part of my day.
                </p>
                <p>
                    Thank you for being the kind of love that makes life feel softer, brighter, and more beautiful just by being in it.
                </p>
            </div>
        `
    },
    {
        id: "things-i-love-about-you",
        title: "Things I Love About You",
        emoji: "✨",
        time: "Favorite things",
        preview: "Your smile, your kindness, your calm, and the way you make everything feel easier and sweeter.",
        content: `
            <div class="note-content-block">
                <ol class="love-list">
                    <li>I love the way you make even ordinary days feel special.</li>
                    <li>I love your smile and the comfort it brings to my heart.</li>
                    <li>I love how gentle, thoughtful, and kind you are.</li>
                    <li>I love the way you listen and make me feel truly seen.</li>
                    <li>I love the way your love makes life feel softer, happier, and lighter.</li>
                </ol>
            </div>
        `
    },
    {
        id: "september-28",
        title: "September 28",
        emoji: "📅",
        time: "Special date",
        preview: "September 28 is our monthsary, and this whole phone is my surprise to celebrate you.",
        content: `
            <div class="note-content-block">
                <p>
                    September 28 is more than just a date to me, it's our monthsary, our little milestone, and one of my favorite reminders that we found something beautiful together.
                </p>
                <p>
                    I wanted this whole phone to be a surprise just for you: a place where every screen could say, in its own way, that I love you and that I thought of you with so much care.
                </p>
                <p>
                    So today, and every day after, I hope you feel how much you mean to me.
                </p>
            </div>
        `
    },
    {
        id: "read-this-last",
        title: "Read This Last",
        emoji: "💌",
        time: "Hidden note",
        preview: "This is the last one, and it's the one I saved for the moment I wanted to say the most.",
        content: `
            <div class="note-content-block final-note-block">
                <p>
                    My love, thank you for being my favorite person, my comfort, and my joy. You make my world feel gentler and brighter just by being in it.
                </p>
                <p>
                    I hope this little surprise reminds you that I love you deeply, sincerely, and in ways that are bigger than words.
                </p>
                <button class="open-heart-button" type="button" onclick="revealFinalMessage()">Open ❤️</button>
                <div class="final-message" id="final-message" aria-live="polite">
                    <p>
                        Happy monthsary, my love. You are my favorite hello, my sweetest peace, and the person I want to keep choosing every single day.
                    </p>
                    <p>
                        Thank you for being you. I love you more than I can say, and I will always be grateful that I get to love you.
                    </p>
                    <p class="signature">Forever yours, ❤️</p>
                </div>
            </div>
        `
    }
];

function renderNotesList() {
    const appTitle = document.getElementById("app-title");
    const appContent = document.getElementById("app-content");

    appTitle.textContent = "Notes";
    appContent.innerHTML = `
        <div class="notes-screen">
            <div class="notes-header">
                <div>
                    <p class="notes-kicker">My thoughts</p>
                    <h2>Notes</h2>
                </div>
                <span class="notes-count">${notesData.length} notes</span>
            </div>

            <div class="notes-list">
                ${notesData.map((note) => `
                    <button class="note-item" type="button" onclick="openNote('${note.id}')">
                        <div class="note-item-head">
                            <span class="note-emoji">${note.emoji}</span>
                            <span class="note-time">${note.time}</span>
                        </div>
                        <div class="note-item-body">
                            <h3>${note.title}</h3>
                            <p>${note.preview}</p>
                        </div>
                        <span class="note-arrow">›</span>
                    </button>
                `).join("")}
            </div>
        </div>
    `;
}

function openNote(noteId) {
    const note = notesData.find((item) => item.id === noteId);

    if (!note) return;

    const appTitle = document.getElementById("app-title");
    const appContent = document.getElementById("app-content");

    appTitle.textContent = note.title;
    appContent.innerHTML = `
        <div class="notes-detail-view">
            <button class="notes-back-button" type="button" onclick="renderNotesList()">Back</button>
            <div class="note-detail-card">
                <div class="note-detail-top">
                    <span class="note-detail-emoji">${note.emoji}</span>
                    <span class="note-detail-date">${note.time}</span>
                </div>
                <h2>${note.title}</h2>
                ${note.content}
            </div>
        </div>
    `;

    const detailView = appContent.querySelector(".notes-detail-view");
    if (detailView) {
        requestAnimationFrame(() => {
            detailView.classList.add("visible");
        });
    }
}

function revealFinalMessage() {
    const finalMessage = document.getElementById("final-message");
    const button = document.querySelector(".open-heart-button");

    if (!finalMessage || !button) return;

    finalMessage.classList.add("visible");
    button.textContent = "Opened ❤️";
    button.disabled = true;
    button.classList.add("opened");
}

function openApp(appName) {

    const appWindow = document.getElementById("app-window");
    const appTitle = document.getElementById("app-title");
    const appContent = document.getElementById("app-content");

    appWindow.classList.add("active");

    /* Settings manages its own light/dark chrome; other apps keep the default */
    appWindow.classList.remove("settings-dark");
    appWindow.classList.remove("settings-open");

    if (appName === "messages") {

    appTitle.textContent = "Messages";

    appContent.innerHTML = `
        <div class="messages-list">

            <div class="conversation" onclick="openConversation()">
                <div class="contact-icon">💗</div>

                <div class="conversation-info">
                    <strong>My Favorite Person</strong>
                    <span>Tap to open...</span>
                </div>

                <span class="arrow">›</span>
            </div>

        </div>
    `;
}

    else if (appName === "camera") {

        appTitle.textContent = "Camera";

        appContent.innerHTML = `
            <div class="camera-screen">
                <div class="camera-app">
                    <div class="camera-preview" id="camera-preview" aria-label="Camera preview">
                        <div class="camera-focus-ring" id="camera-focus-ring"></div>
                        <div class="camera-badge">Live</div>
                        <div class="camera-toast" id="camera-toast">Photo saved ❤️</div>
                    </div>

                    <div class="camera-controls">
                        <div class="camera-tools-left">
                            <button class="camera-tool" id="camera-flash" type="button" aria-label="Toggle flash">⚡</button>
                            <div class="camera-zoom">1x</div>
                            <button class="camera-tool" id="camera-switch" type="button" aria-label="Switch camera">⇄</button>
                        </div>

                        <button class="shutter-button" id="camera-shutter" type="button" aria-label="Take photo">
                            <span class="shutter-inner"></span>
                        </button>

                        <button class="gallery-button" type="button" aria-label="Gallery preview">
                            <span class="gallery-thumb"></span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        setupCameraInteractions();
    }

else if (appName === "music") {
    appTitle.textContent = "Music";

    appContent.innerHTML = `
        <div class="music-player">

            <div class="album-art">
                💗
            </div>

            <h2>When I Met You</h2>

            <p class="artist">
                APO Hiking Society
            </p>

            <audio id="love-song">
                <source
                    src="music/when-i-met-you.mp3"
                    type="audio/mpeg">
            </audio>

            <button
                class="custom-play-button"
                onclick="playLoveSong()">
                ▶
            </button>

            <p class="music-message">
                Our little song ❤️
            </p>

        </div>
    `;
}

    else if (appName === "notes") {
        renderNotesList();
    }

    else if (appName === "calculator") {

        appTitle.textContent = "Calculator";

        appContent.innerHTML = `
            <div class="calc">

                <div class="calc-display">
                    <div class="calc-history" id="calc-history"></div>
                    <div class="calc-result" id="calc-display-value">0</div>
                </div>

                <div class="calc-keys">
                    <button class="calc-key fn" onclick="calcClear()">C</button>
                    <button class="calc-key fn" onclick="calcToggleSign()">+/−</button>
                    <button class="calc-key fn" onclick="calcPercent()">%</button>
                    <button class="calc-key op" onclick="calcOperator('÷')">÷</button>

                    <button class="calc-key" onclick="calcDigit('7')">7</button>
                    <button class="calc-key" onclick="calcDigit('8')">8</button>
                    <button class="calc-key" onclick="calcDigit('9')">9</button>
                    <button class="calc-key op" onclick="calcOperator('×')">×</button>

                    <button class="calc-key" onclick="calcDigit('4')">4</button>
                    <button class="calc-key" onclick="calcDigit('5')">5</button>
                    <button class="calc-key" onclick="calcDigit('6')">6</button>
                    <button class="calc-key op" onclick="calcOperator('−')">−</button>

                    <button class="calc-key" onclick="calcDigit('1')">1</button>
                    <button class="calc-key" onclick="calcDigit('2')">2</button>
                    <button class="calc-key" onclick="calcDigit('3')">3</button>
                    <button class="calc-key op" onclick="calcOperator('+')">+</button>

                    <button class="calc-key zero" onclick="calcDigit('0')">0</button>
                    <button class="calc-key" onclick="calcDecimal()">.</button>
                    <button class="calc-key op equals" onclick="calcEquals()">=</button>
                </div>

            </div>
        `;

        calcState = {
            display: "0",
            storedValue: null,
            operator: null,
            waitingForSecondValue: false,
            leadingZero: false
        };
        calcRender();
    }

    else if (appName === "settings") {
        renderSettingsApp();
    }
}

let settingsState = {
    airplaneMode: false,
    bluetooth: true,
    appearance: "light",
    brightness: 72,
    wallpaper: "Romantic",
    volume: 62,
    sounds: true,
    phoneName: "My Love's Phone",
    softwareVersion: "Monthsary OS 1.0",
    storage: "∞ GB available"
};

function updateRangeVisual(slider) {
    if (!slider) return;

    const min = Number(slider.min || 0);
    const max = Number(slider.max || 100);
    const value = Number(slider.value || 0);
    const percentage = ((value - min) / (max - min || 1)) * 100;

    slider.style.background = `linear-gradient(to right, #ff678d 0%, #ff678d ${percentage}%, #ececf3 ${percentage}%, #ececf3 100%)`;
}

/* In-place visual sync so toggles never re-render the whole list
   (keeps scroll position and lets transitions stay smooth) */

function syncToggleVisual(toggle) {
    if (!toggle) return;

    const key = toggle.dataset.toggle;
    const isOn = Boolean(settingsState[key]);

    toggle.classList.toggle("on", isOn);
    toggle.setAttribute("aria-pressed", String(isOn));

    const row = toggle.closest(".settings-row");
    const status = row ? row.querySelector("[data-status]") : null;

    if (status) {
        status.textContent = `Status: ${isOn ? "On" : "Off"}`;
    }
}

function applySettingsAppearance(appearance) {
    settingsState.appearance = appearance === "dark" ? "dark" : "light";

    const appWindow = document.getElementById("app-window");
    const appContent = document.getElementById("app-content");

    if (!appContent) return;

    const root = appContent.querySelector(".settings-app, .settings-about-screen");

    /* The Settings app's own chrome (header + window) follows the theme.
       The global phone theme is never touched. */
    if (appWindow) {
        appWindow.classList.toggle("settings-dark", settingsState.appearance === "dark");
    }

    if (root) {
        root.classList.toggle("settings-app-dark", settingsState.appearance === "dark");
        root.classList.toggle("settings-app-light", settingsState.appearance === "light");
    }

    appContent
        .querySelectorAll("[data-appearance]")
        .forEach((button) => {
            const isActive = button.dataset.appearance === settingsState.appearance;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
}

function renderSettingsAboutScreen() {
    const appTitle = document.getElementById("app-title");
    const appContent = document.getElementById("app-content");

    if (!appTitle || !appContent) return;

    appTitle.textContent = "About This Phone";

    const appWindow = document.getElementById("app-window");
    if (appWindow) {
        appWindow.classList.add("settings-open");
    }

    appContent.innerHTML = `
        <div class="settings-about-screen ${settingsState.appearance === "dark" ? "settings-app-dark" : "settings-app-light"}">

            <button class="settings-about-back" type="button">
                <span class="settings-about-back-chevron" aria-hidden="true">‹</span>
                <span>Back</span>
            </button>

            <div class="settings-about-card">
                <div class="settings-about-icon" aria-hidden="true">📱</div>
                <p class="settings-about-label">Monthsary OS</p>
                <h2>Built with love, little details, and way too many hours of coding.</h2>
                <p class="settings-about-signoff">Created especially for you. ❤️</p>
            </div>

            <div class="settings-about-facts">
                <div class="settings-about-fact">
                    <span class="settings-about-fact-label">Phone Name</span>
                    <span class="settings-about-fact-value">${settingsState.phoneName}</span>
                </div>
                <div class="settings-about-fact">
                    <span class="settings-about-fact-label">Software Version</span>
                    <span class="settings-about-fact-value">${settingsState.softwareVersion}</span>
                </div>
                <div class="settings-about-fact">
                    <span class="settings-about-fact-label">Storage</span>
                    <span class="settings-about-fact-value">${settingsState.storage}</span>
                </div>
            </div>

        </div>
    `;

    const backButton = appContent.querySelector(".settings-about-back");
    if (backButton) {
        backButton.addEventListener("click", renderSettingsApp);
    }

    appContent.scrollTop = 0;
}

function bindSettingsControls() {
    const appContent = document.getElementById("app-content");
    if (!appContent) return;

    appContent.querySelectorAll("[data-toggle]").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const key = toggle.dataset.toggle;
            if (!key) return;

            settingsState[key] = !settingsState[key];
            syncToggleVisual(toggle);
        });
    });

    appContent.querySelectorAll("[data-appearance]").forEach((button) => {
        button.addEventListener("click", () => {
            applySettingsAppearance(button.dataset.appearance);
        });
    });

    const aboutButton = appContent.querySelector("[data-about-phone]");
    if (aboutButton) {
        aboutButton.addEventListener("click", renderSettingsAboutScreen);
    }

    const brightnessSlider = appContent.querySelector("#settings-brightness-slider");
    if (brightnessSlider) {
        brightnessSlider.addEventListener("input", (event) => {
            const value = Number(event.target.value);
            settingsState.brightness = value;

            const display = appContent.querySelector(".settings-brightness-value");
            if (display) {
                display.textContent = `${value}%`;
            }

            updateRangeVisual(event.target);
        });
    }

    const volumeSlider = appContent.querySelector("#settings-volume-slider");
    if (volumeSlider) {
        volumeSlider.addEventListener("input", (event) => {
            const value = Number(event.target.value);
            settingsState.volume = value;

            const display = appContent.querySelector(".settings-volume-value");
            if (display) {
                display.textContent = `${value}%`;
            }

            updateRangeVisual(event.target);
        });
    }
}

function renderSettingsApp() {
    const appTitle = document.getElementById("app-title");
    const appContent = document.getElementById("app-content");

    if (!appTitle || !appContent) return;

    appTitle.textContent = "Settings";

    const appWindow = document.getElementById("app-window");
    if (appWindow) {
        appWindow.classList.add("settings-open");
        appWindow.classList.toggle("settings-dark", settingsState.appearance === "dark");
    }

    const themeClass = settingsState.appearance === "dark"
        ? "settings-app settings-app-dark"
        : "settings-app settings-app-light";

    appContent.innerHTML = `
        <div class="${themeClass}">
            <div class="settings-section">
                <div class="settings-section-label">Connection</div>

                <div class="settings-row">
                    <div class="settings-row-main">
                        <span class="settings-icon icon-wifi" aria-hidden="true">📶</span>
                        <div class="settings-copy">
                            <strong>Wi‑Fi</strong>
                            <span>Status: Connected</span>
                        </div>
                    </div>
                    <span class="settings-status">Connected</span>
                </div>

                <div class="settings-row">
                    <div class="settings-row-main">
                        <span class="settings-icon icon-bluetooth" aria-hidden="true">🔵</span>
                        <div class="settings-copy">
                            <strong>Bluetooth</strong>
                            <span data-status>Status: ${settingsState.bluetooth ? "On" : "Off"}</span>
                        </div>
                    </div>
                    <button class="settings-toggle ${settingsState.bluetooth ? "on" : ""}" data-toggle="bluetooth" type="button" aria-label="Toggle Bluetooth" aria-pressed="${settingsState.bluetooth}">
                        <span class="settings-toggle-knob"></span>
                    </button>
                </div>

                <div class="settings-row">
                    <div class="settings-row-main">
                        <span class="settings-icon icon-airplane" aria-hidden="true">✈️</span>
                        <div class="settings-copy">
                            <strong>Airplane Mode</strong>
                            <span data-status>Status: ${settingsState.airplaneMode ? "On" : "Off"}</span>
                        </div>
                    </div>
                    <button class="settings-toggle ${settingsState.airplaneMode ? "on" : ""}" data-toggle="airplaneMode" type="button" aria-label="Toggle Airplane Mode" aria-pressed="${settingsState.airplaneMode}">
                        <span class="settings-toggle-knob"></span>
                    </button>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-section-label">Display</div>

                <div class="settings-row settings-row-appearance">
                    <div class="settings-row-main">
                        <span class="settings-icon icon-appearance" aria-hidden="true">🌗</span>
                        <div class="settings-copy">
                            <strong>Appearance</strong>
                            <span>Light / Dark</span>
                        </div>
                    </div>

                    <div class="settings-segmented" role="group" aria-label="Appearance selector">
                        <button class="settings-segment ${settingsState.appearance === "light" ? "active" : ""}" data-appearance="light" type="button" aria-pressed="${settingsState.appearance === "light"}">Light</button>
                        <button class="settings-segment ${settingsState.appearance === "dark" ? "active" : ""}" data-appearance="dark" type="button" aria-pressed="${settingsState.appearance === "dark"}">Dark</button>
                    </div>
                </div>

                <div class="settings-row settings-row-slider">
                    <div class="settings-row-main settings-row-main-stack">
                        <div class="settings-copy">
                            <strong>Brightness</strong>
                            <span class="settings-brightness-value">${settingsState.brightness}%</span>
                        </div>
                    </div>
                    <input id="settings-brightness-slider" type="range" min="0" max="100" value="${settingsState.brightness}" aria-label="Brightness slider">
                </div>

                <div class="settings-row">
                    <div class="settings-row-main">
                        <span class="settings-icon icon-wallpaper" aria-hidden="true">🖼️</span>
                        <div class="settings-copy">
                            <strong>Wallpaper</strong>
                            <span>Show "Romantic"</span>
                        </div>
                    </div>
                    <span class="settings-status">Romantic</span>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-section-label">Sound</div>

                <div class="settings-row settings-row-slider">
                    <div class="settings-row-main settings-row-main-stack">
                        <div class="settings-copy">
                            <strong>Volume</strong>
                            <span class="settings-volume-value">${settingsState.volume}%</span>
                        </div>
                    </div>
                    <input id="settings-volume-slider" type="range" min="0" max="100" value="${settingsState.volume}" aria-label="Volume slider">
                </div>

                <div class="settings-row">
                    <div class="settings-row-main">
                        <span class="settings-icon icon-sound" aria-hidden="true">🔔</span>
                        <div class="settings-copy">
                            <strong>Sounds &amp; Haptics</strong>
                            <span data-status>Status: ${settingsState.sounds ? "On" : "Off"}</span>
                        </div>
                    </div>
                    <button class="settings-toggle ${settingsState.sounds ? "on" : ""}" data-toggle="sounds" type="button" aria-label="Toggle sounds" aria-pressed="${settingsState.sounds}">
                        <span class="settings-toggle-knob"></span>
                    </button>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-section-label">About</div>

                <div class="settings-row">
                    <div class="settings-row-main">
                        <span class="settings-icon icon-phone" aria-hidden="true">📱</span>
                        <div class="settings-copy">
                            <strong>Phone Name</strong>
                            <span>"${settingsState.phoneName}"</span>
                        </div>
                    </div>
                </div>

                <div class="settings-row">
                    <div class="settings-row-main">
                        <span class="settings-icon icon-version" aria-hidden="true">💻</span>
                        <div class="settings-copy">
                            <strong>Software Version</strong>
                            <span>"${settingsState.softwareVersion}"</span>
                        </div>
                    </div>
                </div>

                <div class="settings-row">
                    <div class="settings-row-main">
                        <span class="settings-icon icon-storage" aria-hidden="true">💾</span>
                        <div class="settings-copy">
                            <strong>Storage</strong>
                            <span>"${settingsState.storage}"</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="settings-section settings-special-section">
                <div class="settings-section-label">Special</div>

                <button class="settings-about-link" data-about-phone type="button">
                    <span class="settings-icon icon-love" aria-hidden="true">❤️</span>
                    <span class="settings-about-link-text">About This Phone ❤️</span>
                    <span class="settings-chevron" aria-hidden="true">›</span>
                </button>
            </div>
        </div>
    `;

    const brightnessSlider = appContent.querySelector("#settings-brightness-slider");
    const volumeSlider = appContent.querySelector("#settings-volume-slider");

    appContent.scrollTop = 0;

    if (brightnessSlider) {
        updateRangeVisual(brightnessSlider);
    }

    if (volumeSlider) {
        updateRangeVisual(volumeSlider);
    }

    bindSettingsControls();
}

function setupCameraInteractions() {
    const preview = document.getElementById("camera-preview");
    const shutterButton = document.getElementById("camera-shutter");
    const toast = document.getElementById("camera-toast");
    const flashButton = document.getElementById("camera-flash");

    if (preview && shutterButton && toast) {
        shutterButton.addEventListener("click", () => {
            preview.classList.remove("shutter-flash");
            void preview.offsetWidth;
            preview.classList.add("shutter-flash");

            toast.classList.remove("visible");
            void toast.offsetWidth;
            toast.classList.add("visible");

            window.clearTimeout(shutterButton.toastTimer);
            shutterButton.toastTimer = window.setTimeout(() => {
                toast.classList.remove("visible");
            }, 1200);
        });

        preview.addEventListener("click", (event) => {
            const focusRing = document.getElementById("camera-focus-ring");
            if (!focusRing) return;

            const rect = preview.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            focusRing.style.left = `${x}px`;
            focusRing.style.top = `${y}px`;
            focusRing.classList.remove("active");
            void focusRing.offsetWidth;
            focusRing.classList.add("active");
        });
    }

    if (flashButton) {
        flashButton.addEventListener("click", () => {
            flashButton.classList.toggle("active");
            if (preview) {
                preview.classList.toggle("flash-mode");
            }
        });
    }

    /* The zoom pill and the switch-camera control are part of the camera
       chrome, so they need to answer when tapped. */
    const zoomLabel = document.querySelector(".camera-zoom");
    const switchButton = document.getElementById("camera-switch");

    if (zoomLabel) {
        zoomLabel.addEventListener("click", () => {
            const steps = ["1x", "2x", "0.5x"];
            const current = steps.indexOf(zoomLabel.textContent.trim());
            const next = steps[(current + 1) % steps.length];

            zoomLabel.textContent = next;
            zoomLabel.classList.remove("bump");
            void zoomLabel.offsetWidth;
            zoomLabel.classList.add("bump");
        });
    }

    if (switchButton) {
        switchButton.addEventListener("click", () => {
            switchButton.classList.toggle("active");
            if (preview) {
                preview.classList.toggle("flipped");
            }
        });
    }
}

function closeApp() {

    document
        .getElementById("app-window")
        .classList.remove("active");

}

let conversationTimers = [];

/* Keeps a re-opened conversation from stacking a second script of
   messages on top of the first one. */
function clearConversationTimers() {
    conversationTimers.forEach((id) => window.clearTimeout(id));
    conversationTimers = [];
}

function laterInConversation(fn, delay) {
    conversationTimers.push(window.setTimeout(fn, delay));
}

function openConversation() {

    const appTitle = document.getElementById("app-title");
    const appContent = document.getElementById("app-content");

    appTitle.textContent = "My Favorite Person";

    appContent.innerHTML = `
        <div class="chat" id="chat">

            <div class="typing">
                typing...
            </div>

        </div>
    `;

    clearConversationTimers();

    laterInConversation(() => {
        addMessage("Heyyy 👀");
    }, 1200);

    laterInConversation(() => {
        addMessage("If you're reading this...");
    }, 2500);

    laterInConversation(() => {
        addMessage("I made this entire phone just for you. 💗");
    }, 4000);

    laterInConversation(() => {
        addMessage("Happy Monthsary! 🥹❤️");
    }, 5500);

    laterInConversation(() => {
        showSecretButton();
    }, 7000);
}


function addMessage(message) {

    const chat = document.getElementById("chat");

    /* The scripted chat can still be running after the user has closed
       Messages or opened another app. Bail out quietly instead of
       throwing on a missing element. */
    if (!chat) return;

    const typing = chat.querySelector(".typing");

    if (typing) {
        typing.remove();
    }

    const newMessage = document.createElement("div");

    newMessage.className = "chat-message received";

    newMessage.textContent = message;

    chat.appendChild(newMessage);

    const newTyping = document.createElement("div");

    newTyping.className = "typing";

    newTyping.textContent = "typing...";

    chat.appendChild(newTyping);
}

function showSecretButton() {

    const chat = document.getElementById("chat");

    if (!chat) return;

    const typing = chat.querySelector(".typing");

    if (typing) {
        typing.remove();
    }

    const button = document.createElement("button");

    button.className = "secret-button";

    button.textContent = "💗 Open Secret Message";

    button.onclick = openSecretMessage;

    chat.appendChild(button);
}


function openSecretMessage() {

    const appContent = document.getElementById("app-content");

    appContent.innerHTML = `
        <div class="secret-message">

            <div class="secret-heart">
                💗
            </div>

            <h1>For You</h1>

            <p>
                Out of all the things I could have made,
                I wanted to make something you could actually
                explore.
            </p>

            <p>
                Every little button, screen, and detail
                is here because it's for you.
            </p>

            <h2>Happy Monthsary ❤️</h2>

            <p class="small-text">
                — Ronel
            </p>

        </div>
    `;
}

function unlockPhone() {

    const lockScreen = document.getElementById("lock-screen");

    if (!lockScreen || lockScreen.classList.contains("unlocked")) {
        return;
    }

    lockScreen.classList.add("unlocked");

    if (pendingMessagesApp) {
        pendingMessagesApp = false;

        setTimeout(() => {
            if (typeof openApp === "function") {
                openApp("messages");
            }
        }, 620);
    }
}

function toggleMusic(button) {

    if (button.textContent === "▶") {
        button.textContent = "⏸";
    } else {
        button.textContent = "▶";
    }
}

function playLoveSong() {
    const song = document.getElementById("love-song");
    const button = document.querySelector(".custom-play-button");

    if (!song || !button) {
        console.error("Music player is not ready yet.");
        return;
    }

    if (song.paused) {
        song.play()
            .then(() => {
                button.textContent = "⏸";
                const message = document.querySelector(".music-message");
                if (message) {
                    message.textContent = "Our little song ❤️";
                }
            })
            .catch((error) => {
                console.error("Music error:", error);
                button.textContent = "▶";
                const message = document.querySelector(".music-message");
                if (message) {
                    message.textContent = "Media is still loading... try again in a moment ❤️";
                }
            });
    } else {
        song.pause();
        button.textContent = "▶";
    }
}/* ============ CALCULATOR ============ */

let calcState = {
    display: "0",
    storedValue: null,
    operator: null,
    waitingForSecondValue: false,
    leadingZero: false
};

function formatCalculatorValue(value) {
    if (!Number.isFinite(value)) {
        return "Error";
    }

    const rounded = Number(value.toFixed(10));
    const text = String(rounded);
    return text.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function calcRender() {
    const display = document.getElementById("calc-display-value");
    const history = document.getElementById("calc-history");

    if (!display) return;

    const text = calcState.display;

    display.classList.remove("small", "tiny");
    if (text.length > 7) display.classList.add("small");
    if (text.length > 10) display.classList.add("tiny");

    display.textContent = text;

    if (history) {
        history.textContent =
            calcState.storedValue !== null && calcState.operator
                ? `${formatCalculatorValue(calcState.storedValue)} ${calcState.operator}`
                : "";
    }
}

function performCalculatorOperation(left, right, op) {
    switch (op) {
        case "+":
            return left + right;
        case "−":
            return left - right;
        case "×":
            return left * right;
        case "÷":
            if (right === 0) {
                return Number.POSITIVE_INFINITY;
            }
            return left / right;
        default:
            return right;
    }
}

function calcDigit(d) {
    if (calcState.display === "Error") {
        calcState.display = "0";
        calcState.leadingZero = false;
    }

    if (calcState.waitingForSecondValue) {
        calcState.display = d;
        calcState.waitingForSecondValue = false;
        calcState.leadingZero = false;
    } else if (calcState.display === "0") {
        if (d === "0") {
            calcState.display = "0";
            calcState.leadingZero = true;
        } else if (calcState.leadingZero) {
            calcState.display = "0" + d;
            calcState.leadingZero = false;
        } else {
            calcState.display = d;
            calcState.leadingZero = false;
        }
    } else if (calcState.display.length < 12) {
        calcState.display += d;
        calcState.leadingZero = false;
    }

    calcRender();
}

function calcDecimal() {
    if (calcState.display === "Error") {
        calcState.display = "0.";
        calcState.leadingZero = false;
    } else if (calcState.waitingForSecondValue) {
        calcState.display = "0.";
        calcState.waitingForSecondValue = false;
        calcState.leadingZero = false;
    } else if (!calcState.display.includes(".")) {
        if (calcState.display.length < 12) {
            calcState.display += ".";
        }
    }

    calcRender();
}

function calcOperator(op) {
    if (calcState.display === "Error") {
        return;
    }

    const currentValue = Number(calcState.display);

    if (calcState.operator && calcState.storedValue !== null && !calcState.waitingForSecondValue) {
        const result = performCalculatorOperation(calcState.storedValue, currentValue, calcState.operator);
        calcState.display = formatCalculatorValue(result);
        calcState.storedValue = result;
    } else if (!calcState.waitingForSecondValue) {
        calcState.storedValue = currentValue;
    }

    calcState.operator = op;
    calcState.waitingForSecondValue = true;
    calcState.leadingZero = false;
    calcRender();
}

function calcEquals() {
    if (calcState.display === "0928" && calcState.operator === null && calcState.storedValue === null) {
        openCalcSecret();
        return;
    }

    if (calcState.operator === null || calcState.storedValue === null) {
        calcState.display = formatCalculatorValue(Number(calcState.display));
        calcState.leadingZero = false;
        calcRender();
        return;
    }

    const result = performCalculatorOperation(
        calcState.storedValue,
        Number(calcState.display),
        calcState.operator
    );

    if (!Number.isFinite(result)) {
        calcState.display = "Error";
        calcState.storedValue = null;
        calcState.operator = null;
        calcState.waitingForSecondValue = false;
        calcRender();
        return;
    }

    calcState.display = formatCalculatorValue(result);
    calcState.storedValue = null;
    calcState.operator = null;
    calcState.waitingForSecondValue = false;
    calcState.leadingZero = false;
    calcRender();
}

function calcClear() {
    calcState = {
        display: "0",
        storedValue: null,
        operator: null,
        waitingForSecondValue: false,
        leadingZero: false
    };
    calcRender();
}

function calcToggleSign() {
    if (calcState.display === "Error") {
        calcState.display = "0";
    } else if (calcState.display !== "0") {
        calcState.display = calcState.display.startsWith("-")
            ? calcState.display.slice(1)
            : `-${calcState.display}`;
    }

    calcState.leadingZero = false;
    calcRender();
}

function calcPercent() {
    if (calcState.display === "Error") {
        return;
    }

    calcState.display = formatCalculatorValue(Number(calcState.display) / 100);
    calcState.leadingZero = false;
    calcRender();
}

/* ============ CALCULATOR EASTER EGG ============ */

function openCalcSecret() {
    const appTitle = document.getElementById("app-title");
    const appContent = document.getElementById("app-content");

    if (!appTitle || !appContent) return;

    appTitle.textContent = "Calculator";
    calcState = {
        display: "0",
        storedValue: null,
        operator: null,
        waitingForSecondValue: false,
        leadingZero: false
    };

    appContent.innerHTML = `
        <div class="calc-secret">
            <div class="calc-secret-hearts">
                <span>💗</span><span>❤️</span><span>💗</span>
            </div>

            <div class="calc-secret-sequence">
                <p>💗 You found something...</p>
                <p>Some things are impossible to calculate.</p>
                <p>But one thing is easy.</p>
                <p>How much I love you.</p>
            </div>

            <div class="calc-secret-infinity">∞</div>

            <button class="calc-secret-open" type="button" onclick="revealCalcSecretMessage()">
                Open Secret ❤️
            </button>
        </div>
    `;
}

function revealCalcSecretMessage() {
    const appContent = document.getElementById("app-content");

    if (!appContent) return;

    appContent.innerHTML = `
        <div class="calc-secret calc-secret-message">
            <div class="calc-secret-hearts">
                <span>💗</span><span>❤️</span><span>💗</span>
            </div>

            <h2>Happy Monthsary ❤️</h2>

            <p>
                Every day with you feels like a beautiful chapter I never want to end.
            </p>

            <p>
                Thank you for being my favorite person, my calm, and my greatest joy.
            </p>

            <button class="calc-secret-back" type="button" onclick="openApp('calculator')">
                ‹ Back to Calculator
            </button>
        </div>
    `;
}


/* ==========================================================
   SYSTEM TOAST / NOTIFICATION SYSTEM
   Reusable system-wide feedback layer.

   Usage:
       showToast("Photo saved ❤️");
       showToast("Message opened 💗", { icon: "💌", duration: 1800 });
       hideToast();

   Additive only - does not touch any existing app logic.
   ========================================================== */

const TOAST_VISIBLE_DURATION = 2000;
const TOAST_EXIT_DURATION = 280;
const TOAST_SWAP_DURATION = 300;
const TOAST_PRESS_DURATION = 200;

const TOAST_PRESS_TARGETS = [
    ".app",
    ".dock-icon",
    ".app-header button",
    ".note-item",
    ".notes-back-button",
    ".open-heart-button",
    ".secret-button",
    ".calc-secret-open",
    ".calc-secret-back",
    ".custom-play-button"
].join(", ");

let toastLayer = null;
let activeToast = null;
let toastHideTimer = null;
let toastRemoveTimer = null;
let toastSwapTimer = null;

function getToastLayer() {

    if (toastLayer && toastLayer.isConnected) {
        return toastLayer;
    }

    const phone = document.querySelector(".phone");

    if (!phone) {
        return null;
    }

    toastLayer = document.createElement("div");

    toastLayer.id = "toast-layer";
    toastLayer.className = "toast-layer";
    toastLayer.setAttribute("role", "status");
    toastLayer.setAttribute("aria-live", "polite");

    phone.appendChild(toastLayer);

    syncToastLayerPosition();

    return toastLayer;
}

function syncToastLayerPosition() {

    if (!toastLayer || !toastLayer.isConnected) {
        return;
    }

    const appWindow = document.getElementById("app-window");

    const isAppOpen = Boolean(appWindow && appWindow.classList.contains("active"));

    toastLayer.classList.toggle("is-app-open", isAppOpen);
}

function createToastElement() {

    const toast = document.createElement("div");
    toast.className = "toast";

    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.className = "toast-text";

    toast.appendChild(icon);
    toast.appendChild(text);

    return toast;
}

function clearToastTimers() {

    window.clearTimeout(toastHideTimer);
    window.clearTimeout(toastRemoveTimer);
    window.clearTimeout(toastSwapTimer);

    toastHideTimer = null;
    toastRemoveTimer = null;
    toastSwapTimer = null;
}

function showToast(message, options) {

    const settings = options || {};

    const text =
        message === null || message === undefined ? "" : String(message).trim();

    if (!text) {
        return null;
    }

    const layer = getToastLayer();

    if (!layer) {
        return null;
    }

    const duration = Number.isFinite(settings.duration)
        ? Math.max(400, settings.duration)
        : TOAST_VISIBLE_DURATION;

    const icon = settings.icon ? String(settings.icon) : "";

    clearToastTimers();

    const isNewToast = !activeToast || !activeToast.isConnected;

    if (isNewToast) {

        // Safety net: only ever one toast in the layer, never a stack
        layer.querySelectorAll(".toast").forEach((node) => node.remove());

        activeToast = createToastElement();
        layer.appendChild(activeToast);
    }

    const toast = activeToast;

    toast.querySelector(".toast-icon").textContent = icon;
    toast.querySelector(".toast-text").textContent = text;
    toast.classList.toggle("has-icon", Boolean(icon));

    // Reset state so the enter transition always replays cleanly
    toast.classList.remove("is-visible", "is-leaving", "is-updating");

    void toast.offsetWidth;

    toast.classList.add("is-visible");

    if (!isNewToast) {

        // Replaced a visible toast: keep it up, just pulse it
        toast.classList.add("is-updating");

        toastSwapTimer = window.setTimeout(() => {
            if (toast.isConnected) {
                toast.classList.remove("is-updating");
            }
        }, TOAST_SWAP_DURATION);
    }

    toastHideTimer = window.setTimeout(() => {
        hideToast();
    }, duration);

    return toast;
}

function hideToast() {

    const toast = activeToast;

    if (!toast || !toast.isConnected) {
        return;
    }

    window.clearTimeout(toastHideTimer);
    window.clearTimeout(toastSwapTimer);

    if (toast.classList.contains("is-leaving")) {
        return;
    }

    toast.classList.remove("is-updating", "is-visible");
    toast.classList.add("is-leaving");

    toastRemoveTimer = window.setTimeout(() => {
        if (activeToast === toast) {
            toast.remove();
            activeToast = null;
        }
    }, TOAST_EXIT_DURATION);
}


/* ---------- SUBTLE PRESS FEEDBACK (visual only, no vibration API) ---------- */

function findPressTarget(node) {

    if (!node || typeof node.closest !== "function") {
        return null;
    }

    return node.closest(TOAST_PRESS_TARGETS);
}

function findToastTrigger(node) {

    if (!node || typeof node.closest !== "function") {
        return null;
    }

    return node.closest("[data-toast]");
}

function handlePressStart(event) {

    if (event.pointerType === "mouse" && event.button !== 0) {
        return;
    }

    const target = findPressTarget(event.target);

    if (!target) {
        return;
    }

    target.classList.add("is-pressed");

    // Safety net in case the pointer is released outside the element
    window.clearTimeout(target.pressTimer);

    target.pressTimer = window.setTimeout(() => {
        target.classList.remove("is-pressed");
    }, TOAST_PRESS_DURATION);
}

function handlePressEnd(event) {

    const target = findPressTarget(event.target);

    if (!target) {
        return;
    }

    window.clearTimeout(target.pressTimer);
    target.classList.remove("is-pressed");
}


/* ---------- OPTIONAL data-toast HOOK (dormant until an element opts in) ---------- */

function handleDataToast(event) {

    const trigger = findToastTrigger(event.target);

    if (!trigger) {
        return;
    }

    const message = trigger.getAttribute("data-toast");

    if (message) {
        showToast(message);
    }
}


/* ---------- BOOTSTRAP ---------- */

function initNotificationPolish() {

    document.addEventListener("pointerdown", handlePressStart, { passive: true });
    window.addEventListener("pointerup", handlePressEnd, { passive: true });
    window.addEventListener("pointercancel", handlePressEnd, { passive: true });

    document.addEventListener("click", handleDataToast);

    const appWindow = document.getElementById("app-window");

    if (appWindow && typeof MutationObserver !== "undefined") {

        // Read-only observer: keeps the toast anchored in the right spot
        new MutationObserver(syncToastLayerPosition).observe(appWindow, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNotificationPolish);
} else {
    initNotificationPolish();
}

window.Toast = {
    show: showToast,
    hide: hideToast
};
