/* ==========================================================
   HIDDEN HOME EASTER EGG  (final surprise)
   ------------------------------------------------------------
   Self-contained module. It does NOT touch, wrap, or depend on
   any existing app: not the Calculator (0928 egg intact),
   Camera, Music, Notes, Messages, Settings, Lock Screen,
   the Toast system, or the app transition system.

   Trigger: five quick taps on the small home-screen greeting.
   Nothing on screen hints at it, and no instructions are shown.
   ========================================================== */

(function () {
    "use strict";

    const TRIGGER_ID = "home-greeting";
    const REQUIRED_TAPS = 5;
    const TAP_WINDOW_MS = 1400;   /* taps must land close together */
    const LINE_HOLD_MS = 2100;
    const LINE_FADE_MS = 700;

    const SCRIPT_LINES = [
        { text: "Wait... you found this. 👀" },
        { text: "I hid one more thing here." },
        { text: "Because apparently making you a fake phone wasn't enough. ❤️" },
        { text: "Happy Monthsary, my love.", emphasis: true }
    ];

    let tapCount = 0;
    let resetTimer = null;
    let running = false;
    let letterShown = false;
    let sequenceTimers = [];
    let overlay = null;

    /* ---------- helpers ---------- */

    function clearSequence() {
        sequenceTimers.forEach((id) => window.clearTimeout(id));
        sequenceTimers = [];
    }

    function later(fn, delay) {
        sequenceTimers.push(window.setTimeout(fn, delay));
    }

    function getTrigger() {
        return document.getElementById(TRIGGER_ID);
    }

    function isAppOpen() {
        const appWindow = document.getElementById("app-window");
        return Boolean(appWindow && appWindow.classList.contains("active"));
    }


    /* ---------- overlay build ---------- */

    function buildOverlay() {
        const layer = document.createElement("div");
        layer.className = "ee-overlay";
        layer.setAttribute("role", "dialog");
        layer.setAttribute("aria-modal", "true");
        layer.setAttribute("aria-label", "A hidden message");

        const dismiss = document.createElement("button");
        dismiss.className = "ee-dismiss";
        dismiss.type = "button";
        dismiss.setAttribute("aria-label", "Close");
        dismiss.textContent = "✕";
        dismiss.addEventListener("click", close);

        const stage = document.createElement("div");
        stage.className = "ee-stage";

        const lines = SCRIPT_LINES.map((line) => {
            const el = document.createElement("p");
            el.className = line.emphasis ? "ee-line ee-emphasis" : "ee-line";
            el.textContent = line.text;
            stage.appendChild(el);
            return el;
        });

        const heart = document.createElement("div");
        heart.className = "ee-heart";
        heart.innerHTML = '<span class="ee-heart-glyph" aria-hidden="true">&#10084;&#65039;</span>';
        stage.appendChild(heart);

        const button = document.createElement("button");
        button.className = "ee-button";
        button.type = "button";
        button.textContent = "One More Thing";
        button.addEventListener("click", showLetter);
        stage.appendChild(button);

        const letter = document.createElement("div");
        letter.className = "ee-letter";
        letter.innerHTML =
            '<p>Whatever happens, wherever we go,<br>I hope I always get to make little things<br>that remind you how much you mean to me.</p>' +
            '<p>I love you. ❤️</p>' +
            '<p class="ee-letter-ribbon">Happy Monthsary</p>';
        stage.appendChild(letter);

        layer.appendChild(dismiss);
        layer.appendChild(stage);

        document.body.appendChild(layer);

        return { layer, stage, lines, heart, button, letter, dismiss };
    }

    /* ---------- trigger ---------- */

    function registerTap(event) {
        if (running || isAppOpen()) return;

        const trigger = getTrigger();
        if (!trigger) return;

        // Only the greeting itself counts, never a tap that started elsewhere
        if (event && event.target && event.target !== trigger) return;

        tapCount += 1;

        // Restart the pulse cleanly on every tap
        trigger.classList.remove("ee-tap");
        void trigger.offsetWidth;
        trigger.classList.add("ee-tap");

        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
            tapCount = 0;
        }, TAP_WINDOW_MS);

        if (tapCount >= REQUIRED_TAPS) {
            tapCount = 0;
            window.clearTimeout(resetTimer);
            start();
        }
    }

    function attachTrigger() {
        const trigger = getTrigger();
        if (!trigger) return;

        trigger.classList.add("ee-trigger");
        trigger.addEventListener("click", registerTap);
        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                registerTap(event);
            }
        });
    }

    /* ---------- sequence ---------- */

    function start() {
        if (running) return;
        running = true;
        letterShown = false;

        clearSequence();
        overlay = buildOverlay();

        const trigger = getTrigger();
        if (trigger) trigger.classList.remove("ee-tap");

        // Let the layer paint transparent once before fading it in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.layer.classList.add("ee-open");
            });
        });

        let delay = 900;

        SCRIPT_LINES.forEach((line, index) => {
            const el = overlay.lines[index];

            later(() => el.classList.add("ee-visible"), delay);
            delay += LINE_HOLD_MS;

            later(() => el.classList.remove("ee-visible"), delay);
            delay += LINE_FADE_MS;
        });

        later(() => overlay.heart.classList.add("ee-visible"), delay);
        delay += 1100;

        later(() => overlay.button.classList.add("ee-visible"), delay);
        later(() => overlay.dismiss.classList.add("ee-visible"), 700);

        // No tap-to-skip: the sequence is meant to be watched, not rushed.
        // The stage is inert so a stray tap can never swallow or cancel it.
        overlay.stage.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }

    function showLetter() {
        if (letterShown) return;
        letterShown = true;

        clearSequence();

        overlay.heart.classList.remove("ee-visible");
        overlay.button.classList.remove("ee-visible");
        overlay.button.disabled = true;

        // Collapse the finished beats so the letter sits perfectly centred
        overlay.stage.classList.add("ee-letter-mode");

        later(() => {
            if (overlay) overlay.letter.classList.add("ee-visible");
        }, 500);
    }

    function close() {
        if (!overlay) return;

        clearSequence();
        overlay.layer.classList.remove("ee-open");

        const layer = overlay.layer;
        window.setTimeout(() => {
            if (layer.parentNode) layer.parentNode.removeChild(layer);
        }, 750);

        overlay = null;
        running = false;

        // The secret can be discovered again later
        const trigger = getTrigger();
        if (trigger) trigger.classList.remove("ee-tap");
    }

    /* ---------- boot ---------- */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", attachTrigger);
    } else {
        attachTrigger();
    }
})();

