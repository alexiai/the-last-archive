// Pointer capture lets one thumb keep walking while the other looks around.
// Releasing, cancelling or leaving the game always releases every direction.
export function bindWalkControls(container, world, unlock) {
  const pointers = new Map(),
    keys = new Map();
  const buttons = [...container.querySelectorAll("[data-walk]")];
  const keyDirections = { w: "forward", s: "backward", a: "left", d: "right" };
  const update = () => {
    const held = new Set([...pointers.values(), ...keys.values()]);
    buttons.forEach((b) => {
      const pressed = held.has(b.dataset.walk);
      b.classList.toggle("is-pressed", pressed);
      b.setAttribute("aria-pressed", String(pressed));
    });
    world.setWalkInput(
      Number(held.has("forward")) - Number(held.has("backward")),
      Number(held.has("right")) - Number(held.has("left")),
    );
  };
  const release = (ev) => {
    pointers.delete(ev.pointerId);
    update();
  };
  const down = (ev) => {
    if (ev.button !== 0 && ev.pointerType === "mouse") return;
    const b = ev.target.closest("[data-walk]");
    if (!b || !container.contains(b)) return;
    ev.preventDefault();
    unlock();
    pointers.set(ev.pointerId, b.dataset.walk);
    b.setPointerCapture(ev.pointerId);
    update();
  };
  const clear = () => {
    const captured = [...pointers.keys()];
    pointers.clear();
    keys.clear();
    update();
    for (const id of captured)
      for (const b of buttons)
        if (b.hasPointerCapture(id)) b.releasePointerCapture(id);
  };
  const visibility = () => {
    if (document.hidden) clear();
  };
  const keydown = (ev) => {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (
      ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)
    )
      return;
    const direction =
      [" ", "Enter"].includes(ev.key) &&
      container.contains(document.activeElement)
        ? document.activeElement.dataset.walk
        : keyDirections[ev.key.toLowerCase()];
    if (!direction) return;
    ev.preventDefault();
    unlock();
    const key = ev.code || ev.key;
    if (!keys.has(key)) keys.set(key, direction);
    update();
  };
  const keyup = (ev) => {
    if (keys.delete(ev.code || ev.key)) {
      update();
    }
  };
  const context = (ev) => ev.preventDefault();
  container.addEventListener("pointerdown", down);
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    container.addEventListener(event, release);
  container.addEventListener("contextmenu", context);
  window.addEventListener("blur", clear);
  window.addEventListener("pagehide", clear);
  window.addEventListener("resize", clear);
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  return () => {
    clear();
    container.removeEventListener("pointerdown", down);
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      container.removeEventListener(event, release);
    container.removeEventListener("contextmenu", context);
    window.removeEventListener("blur", clear);
    window.removeEventListener("pagehide", clear);
    window.removeEventListener("resize", clear);
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("keydown", keydown);
    window.removeEventListener("keyup", keyup);
  };
}
