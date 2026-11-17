import { assetMarkup } from "./assets.js";
import { CONTENT as C } from "./content.js";
import { state, visible, has, observe, save } from "./engine.js";
import { escape as e, icon, toast } from "./dom.js";
const APPS = [
  ["messages", "Messages"],
  ["camera", "Photos"],
  ["contacts", "Contacts"],
  ["calls", "Calls"],
  ["mail", "Mail"],
  ["notes", "Notes"],
  ["calendar", "Calendar"],
  ["browser", "Browser"],
  ["social", "Social"],
  ["recorder", "Recorder"],
];
export class VictimPhone {
  constructor(actions) {
    this.actions = actions;
    this.route = state.context?.phoneRoute || "lock";
    this.argument = state.context?.phoneArgument || null;
    this.history = [];
    this.search = state.context?.phoneSearch || "";
  }
  open(route, arg = null) {
    if (this.dialog?.open) {
      this.dialog.close();
      this.dialog.remove();
    }
    if (!has("phone"))
      return toast("Recover the phone from the side table first.");
    if (!this.dialog?.isConnected) {
      const d = document.createElement("dialog");
      d.className = "victim-phone";
      d.setAttribute("aria-label", "Iris’s recovered phone");
      d.innerHTML =
        '<div class="device-frame"><div class="device-camera" aria-hidden="true"></div><div class="device-status"><span>09:41</span><span>READ-ONLY COPY · 74%</span></div><div class="device-screen"></div><footer class="device-system"><button data-system="back" aria-label="Back in phone">' +
        icon("back") +
        '</button><button data-system="home" aria-label="Phone home">' +
        icon("home") +
        '</button><button data-system="close">Return to investigation</button></footer></div>';
      document.body.appendChild(d);
      this.dialog = d;
      d.querySelector("[data-system=close]").onclick = () => d.close();
      d.querySelector("[data-system=home]").onclick = () => this.go("home");
      d.querySelector("[data-system=back]").onclick = () => this.back();
      d.addEventListener("close", () => d.remove());
      d.showModal();
    }
    this.go(route || this.route || "lock", route ? arg : this.argument, false);
  }
  go(route, arg = null, remember = true) {
    if (route === "email" && !visible(C.mail.find((m) => m.id === arg))) {
      route = "mail";
      arg = null;
    }
    if (route === "page" && !visible(C.browser[arg])) {
      route = "browser";
      arg = null;
    }
    if (remember) this.history.push([this.route, this.argument]);
    this.route = route;
    this.argument = arg;
    state.context.phoneRoute = route;
    state.context.phoneArgument = arg;
    save();
    this.render();
  }
  back() {
    const parents = {
      thread: "messages",
      contact: "contacts",
      call: "calls",
      email: "mail",
      page: "browser",
    };
    const [route, arg] = this.history.pop() || [
      parents[this.route] || "home",
      null,
    ];
    this.go(route, arg, false);
  }
  header(title, sub = "", portrait = null) {
    return `<header class="phone-app-heading ${portrait ? "with-avatar" : ""}">${portrait ? `<img src="assets/portraits/${portrait}.png" alt="">` : ""}<div><h2>${e(title)}</h2>${sub ? `<p>${e(sub)}</p>` : ""}</div></header>`;
  }
  render() {
    const screen = this.dialog.querySelector(".device-screen");
    screen.className = "device-screen app-" + this.route;
    screen.scrollTop = 0;
    let html = "";
    if (this.route === "lock")
      html = `<section class="phone-lock"><div class="lock-time">09:41</div><p>Sunday, 19 October</p><div class="phone-owner"><img src="assets/portraits/iris.png" alt="Iris Vasilescu"><span>Iris</span></div><button type="button" class="lock-notification" data-lock-call="elena"><b>Elena · missed call</b><p>Yesterday · 07:04 / voicemail</p></button><div class="copy-authority">Device A-04 · authorised read-only copy.<br>The original remains sealed.</div><button data-go="home" class="unlock-copy">Swipe up / open copy ↑</button></section>`;
    if (this.route === "home")
      html = `<section class="phone-homescreen"><div class="owner-name">Iris</div><div class="phone-app-grid">${APPS.map(([id, label]) => `<button data-go="${id}"><span class="app-tile tile-${id}">${id === "calendar" ? '<b class="calendar-icon-month">OCT</b><strong class="calendar-icon-day">19</strong>' : icon(id)}</span><span>${label}</span></button>`).join("")}</div><div class="device-dock">${["messages", "calls", "camera", "notes"].map((id) => `<button aria-label="Open ${id}" data-go="${id}">${icon(id)}</button>`).join("")}</div><p class="copy-label">Recovered device · no messages will be sent.</p></section>`;
    if (this.route === "messages")
      html =
        this.header("Messages", "Personal conversations / original order") +
        '<label class="sr-only" for="phone-search">Search available messages</label><input type="search" class="phone-search" id="phone-search" placeholder="Search words or a person"><div id="phone-thread-results">' +
        this.threadList(this.search) +
        "</div>";
    if (this.route === "thread") {
      const t = C.threads[this.argument];
      let day = "";
      html =
        this.header(t.name, t.subtitle, t.id === "studio" ? null : t.id) +
        t.messages
          .filter(visible)
          .map((m) => {
            const date = m.time.split(" · ")[0],
              separator =
                date !== day ? `<div class="message-day">${e(date)}</div>` : "";
            day = date;
            const source = m.attachment && C.sources[m.attachment];
            return (
              separator +
              `<article data-message-id="${e(m.id)}" class="phone-message ${m.who === "me" ? "outgoing" : ""}"><p>${e(m.text)}</p><time>${e(m.time.split(" · ")[1] || m.time)} · ${m.who === "me" ? "Iris" : e(m.who === "them" ? t.name : m.who)}</time>${source ? (visible(source) ? `<button class="phone-attachment" data-source="${source.id}">${source.image ? `<img src="assets/world/${source.image}.jpg" alt="Attachment preview">` : icon("mail")}<span>Open original attachment →</span></button>` : '<button class="phone-attachment" data-puzzle="recovery">Queued attachment · inspect recovery index →</button>') : ""}<button class="retain-message" data-retain="${m.id}">Keep message with its source</button></article>`
            );
          })
          .join("");
    }
    if (this.route === "camera")
      html =
        this.header("Photos", "A life before the case") +
        `<div class="phone-albums"><span>Personal</span><span>${has("recovery") ? "Recovered queued item" : "Queued item awaiting recovery"}</span></div><div class="phone-gallery">${["room-before", "shelf-before", "window-memory", ...(has("recovery") ? ["room-prepared"] : [])].map((id) => `<button data-source="${id}"><img src="assets/world/${C.sources[id].image}.jpg" alt="${e(C.sources[id].title)}"><span>${e(C.sources[id].meta)}</span></button>`).join("")}</div>${state.chapter >= 2 && !has("recovery") ? '<button class="phone-primary" data-puzzle="recovery">Inspect queued-media index</button>' : ""}`;
    if (this.route === "contacts")
      html =
        this.header("Contacts", "Iris’s own directory") +
        C.contacts
          .map(
            (c) =>
              `<button class="phone-row" data-contact="${c.id}"><img src="assets/portraits/${c.id}.png" alt=""><span><b>${e(c.name)}</b><small>${e(c.label)}</small></span></button>`,
          )
          .join("");
    if (this.route === "contact") {
      const c = C.contacts.find((c) => c.id === this.argument);
      html = `<div class="contact-identity"><img src="assets/portraits/${c.id}.png" alt="${e(c.name)}"><h2>${e(c.name)}</h2><p>${e(c.label)}</p><p>${e(c.number)}</p></div><button class="phone-primary" data-thread="${c.id}">Open personal conversation</button>${visible(C.interviews[c.id]) ? `<button class="phone-primary" data-interview="${c.id}">Detective: arrange voluntary conversation</button>` : '<p class="phone-context">You have not yet established a reason to interview this person. Their personal record remains available.</p>'}`;
    }
    if (this.route === "calls")
      html =
        this.header("Calls", "Retained device history") +
        `<button class="phone-row" data-call="elena"><span><b>Elena</b><small>Yesterday · 07:04 · missed call / voicemail</small></span><span class="call-missed">↙</span></button><button class="phone-row" data-call="adrian"><span><b>Adrian</b><small>Yesterday · 02:14 · missed</small></span></button><button class="phone-row" data-call="julia"><span><b>Julia</b><small>Yesterday · 00:19 · incoming / 00:43</small></span></button><div class="phone-context">This is Iris’s retained call history. Opening a record does not place a call.</div>`;
    if (this.route === "call") {
      const c = C.contacts.find((c) => c.id === this.argument),
        details = {
          elena: ["18 October · 07:04", "Missed / voicemail retained"],
          adrian: ["18 October · 02:14", "Missed / no voicemail"],
          julia: ["18 October · 00:19", "Incoming / duration 00:43"],
        }[this.argument];
      html =
        this.header("Call record", c.name) +
        `<article class="phone-email"><h2>${e(c.name)}</h2><p>${e(c.number)}</p><p>${e(details[0])}<br>${e(details[1])}</p><p>The call log records a device event; it does not record what was said.</p>${this.argument === "elena" ? '<button class="phone-primary" data-source="audio.voicemail-elena">Open retained voicemail</button>' : ""}<button class="phone-primary" data-thread="${c.id}">Compare personal conversation</button></article>`;
    }
    if (this.route === "mail")
      html =
        this.header("Mail", "Retained inbox") +
        (C.mail
          .filter(visible)
          .map(
            (m) =>
              `<button class="phone-row mail-row" data-mail="${m.id}"><span><b>${e(m.from)}</b><strong>${e(m.subject)}</strong><small>${e(m.time)}</small></span></button>`,
          )
          .join("") ||
          '<p class="phone-context">This extraction includes no released project attachments yet. Continue inspecting the available personal material.</p>');
    if (this.route === "email") {
      const m = C.mail.find((m) => m.id === this.argument);
      html =
        this.header(m.subject, m.from + " / " + m.time) +
        `<article class="phone-email"><p>${e(m.body)}</p><button class="phone-file" data-source="${m.attachment}">${icon("mail")}<span>Open original attachment →</span></button></article>`;
    }
    if (this.route === "notes")
      html =
        this.header("Notes", "Personal drafts") +
        C.notes
          .filter((id) => visible(C.sources[id]))
          .map(
            (id) =>
              `<button class="phone-row note-preview" data-source="${id}"><span><b>${e(C.sources[id].title)}</b><small>${e(C.sources[id].text.split("\n")[1] || "")}</small></span></button>`,
          )
          .join("");
    if (this.route === "calendar") {
      const blanks = 2,
        events = C.calendar.filter(visible);
      html =
        this.header("October 2025", "Appointments and personal reminders") +
        `<div class="phone-calendar"><div class="calendar-week">${["M", "T", "W", "T", "F", "S", "S"].map((x) => `<span>${x}</span>`).join("")}</div><div class="calendar-grid">${Array.from({ length: blanks }, () => "<span></span>").join("")}${Array.from({ length: 31 }, (_, i) => `<button data-day="${i + 1}" class="${events.some((ev) => ev.day === i + 1) ? "has-appointment" : ""} ${(state.context.calendarDay || 17) === i + 1 ? "selected-day" : ""}">${i + 1}</button>`).join("")}</div></div><div id="phone-appointments">${this.appointments(state.context.calendarDay || 17)}</div>`;
    }
    if (this.route === "browser")
      html =
        this.header("Browser", "Saved pages and history") +
        C.browser
          .filter(visible)
          .map(
            (b, i) =>
              `<button class="phone-row" data-page="${C.browser.indexOf(b)}"><span><b>${e(b.title)}</b><small>${e(b.url)}</small></span></button>`,
          )
          .join("") +
        '<p class="phone-context">Saved pages are part of this device copy. Searches do not contact the internet.</p>';
    if (this.route === "page") {
      const b = C.browser[this.argument];
      html =
        this.header(b.title, b.url) +
        `<article class="saved-webpage"><p>${e(b.text)}</p></article>`;
    }
    if (this.route === "social")
      html =
        this.header("Social", "Saved posts / not a live feed") +
        `<article class="phone-social"><header><img src="assets/portraits/iris.png" alt=""><span><b>Iris</b><small>12 October · personal post</small></span></header><button data-source="room-before"><img class="social-image" src="assets/world/room-before.jpg" alt="Iris’s living room before the gathering"></button><p>A photograph before anyone remembered to tell us where to stand. I like that part.</p><small>Mara: The chairs still look uncomfortable.</small></article><article class="phone-social"><header><img src="assets/portraits/mara.png" alt=""><span><b>Mara</b><small>17 October · saved story</small></span></header><p>No speeches until someone has eaten. I believe we negotiated quite well.</p><button class="phone-primary" data-thread="studio">Open related group conversation</button></article>`;
    if (this.route === "recorder")
      html =
        this.header(
          "Recorder",
          "Finished local recordings / transcripts available",
        ) +
        Object.entries(C.audio)
          .filter(
            ([id, a]) =>
              [
                "family-fragment",
                "room-note",
                "assembly",
                "room-original",
                "reassurance",
                "apology",
              ].includes(id) && visible(a),
          )
          .map(
            ([id, a]) =>
              `<button class="phone-row" data-source="audio.${id}"><span>${icon("recorder")}</span><span><b>${e(a.title)}</b><small>Open recording and original transcript</small></span></button>`,
          )
          .join("");
    screen.innerHTML = assetMarkup(html);
    screen
      .querySelector("[data-lock-call]")
      ?.addEventListener("click", () => this.go("call", "elena"));
    const lock = screen.querySelector(".phone-lock");
    if (lock) {
      let start = null;
      lock.addEventListener(
        "touchstart",
        (ev) => {
          const t = ev.changedTouches[0];
          start = [t.clientX, t.clientY];
        },
        { passive: true },
      );
      lock.addEventListener(
        "touchend",
        (ev) => {
          if (!start) return;
          const t = ev.changedTouches[0];
          if (start[1] - t.clientY > 65 && Math.abs(start[0] - t.clientX) < 90)
            this.go("home");
          start = null;
        },
        { passive: true },
      );
    }

    screen
      .querySelectorAll("[data-call]")
      .forEach((b) => (b.onclick = () => this.go("call", b.dataset.call)));
    screen
      .querySelectorAll("[data-go]")
      .forEach((b) => (b.onclick = () => this.go(b.dataset.go)));
    screen
      .querySelectorAll("[data-thread]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            C.threads[b.dataset.thread]
              ? this.go("thread", b.dataset.thread)
              : toast("No retained conversation with this contact.")),
      );
    screen
      .querySelectorAll("[data-contact]")
      .forEach(
        (b) => (b.onclick = () => this.go("contact", b.dataset.contact)),
      );
    screen
      .querySelectorAll("[data-source]")
      .forEach(
        (b) => (b.onclick = () => this.actions.source(b.dataset.source)),
      );
    screen
      .querySelectorAll("[data-puzzle]")
      .forEach(
        (b) => (b.onclick = () => this.actions.puzzle(b.dataset.puzzle)),
      );
    screen
      .querySelectorAll("[data-mail]")
      .forEach((b) => (b.onclick = () => this.go("email", b.dataset.mail)));
    screen
      .querySelectorAll("[data-page]")
      .forEach(
        (b) => (b.onclick = () => this.go("page", Number(b.dataset.page))),
      );
    screen.querySelectorAll("[data-interview]").forEach(
      (b) =>
        (b.onclick = () => {
          this.dialog.close();
          this.actions.interview(b.dataset.interview);
        }),
    );
    screen.querySelectorAll("[data-retain]").forEach(
      (b) =>
        (b.onclick = () => {
          const r = observe(b.dataset.retain);
          toast(r.message);
          if (r.ok) b.textContent = "Retained with original conversation ✓";
        }),
    );
    screen.querySelectorAll("[data-day]").forEach(
      (b) =>
        (b.onclick = () => {
          state.context.calendarDay = Number(b.dataset.day);
          save();
          screen
            .querySelectorAll("[data-day]")
            .forEach((day) => day.classList.toggle("selected-day", day === b));
          screen.querySelector("#phone-appointments").innerHTML =
            this.appointments(Number(b.dataset.day));
          this.bindCalendar(screen);
        }),
    );
    this.bindCalendar(screen);
    const search = screen.querySelector("#phone-search");
    if (search) search.value = this.search;
    if (search)
      search.oninput = () => {
        this.search = search.value;
        state.context.phoneSearch = this.search;
        save();
        screen.querySelector("#phone-thread-results").innerHTML = assetMarkup(
          this.threadList(search.value),
        );
        screen
          .querySelectorAll("[data-thread]")
          .forEach(
            (b) => (b.onclick = () => this.go("thread", b.dataset.thread)),
          );
      };
  }
  bindCalendar(screen) {
    screen.querySelectorAll("[data-calendar-retain]").forEach(
      (b) =>
        (b.onclick = () => {
          const r = observe(b.dataset.calendarRetain);
          toast(r.message);
          if (r.ok) b.textContent = "Appointment retained ✓";
        }),
    );
  }
  threadList(query = "") {
    const q = query.toLowerCase();
    return (
      Object.values(C.threads)
        .filter(
          (t) =>
            !q ||
            t.name.toLowerCase().includes(q) ||
            t.messages
              .filter(visible)
              .some((m) => m.text.toLowerCase().includes(q)),
        )
        .map(
          (t) =>
            `<button class="phone-row" data-thread="${t.id}">${t.id !== "studio" ? `<img src="assets/portraits/${t.id}.png" alt="">` : '<span class="group-avatar">S</span>'}<span><b>${e(t.name)}</b><small>${e(t.messages.filter(visible).at(-1)?.text || t.subtitle)}</small></span></button>`,
        )
        .join("") ||
      '<p class="phone-context">No available conversation matches.</p>'
    );
  }
  openMessageSource(thread, id) {
    this.open("thread", thread);
    const el = [...this.dialog.querySelectorAll("[data-message-id]")].find(
      (el) => el.dataset.messageId === id,
    );
    if (el) {
      el.classList.add("source-cited");
      el.tabIndex = -1;
      el.scrollIntoView({ block: "center" });
      el.focus({ preventScroll: true });
    }
  }
  openCalendarSource(event) {
    this.open("calendar");
    this.dialog.querySelector(`[data-day="${event.day}"]`)?.click();
    const el = [...this.dialog.querySelectorAll("[data-calendar-retain]")]
      .find((el) => el.dataset.calendarRetain === event.source)
      ?.closest("article");
    if (el) {
      el.classList.add("source-cited");
      el.scrollIntoView({ block: "center" });
    }
  }
  appointments(day) {
    const items = C.calendar.filter(visible).filter((ev) => ev.day === day);
    return (
      `<h3>${day} October</h3>` +
      (items
        .map(
          (ev) =>
            `<article class="phone-appointment"><b>${e(ev.time)} · ${e(ev.title)}</b><p>${e(ev.text)}</p><button data-calendar-retain="${ev.source}">Keep appointment in casebook</button></article>`,
        )
        .join("") ||
        '<p class="phone-context">No retained appointment on this date.</p>')
    );
  }
}
