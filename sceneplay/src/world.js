import * as T from "three";
import { GLTFLoader } from "../vendor/loaders/GLTFLoader.js";
import { mergeGeometries } from "../vendor/utils/BufferGeometryUtils.js";
export const PLACES = {
  landing: { pos: [-2.48, 1.65, -6.15], look: [-2.0, 1.38, -4.15] },
  threshold: { pos: [-2.25, 1.65, -3.0], look: [0.0, 1.0, -0.1] },
  room: { pos: [-0.8, 1.64, 1.55], look: [0.35, 1.0, -1.9] },
  table: { pos: [-0.65, 1.5, 1.05], look: [0.05, 0.62, -0.05] },
  shelf: { pos: [0.95, 1.5, -1.5], look: [1.36, 1.1, -3.0] },
  phone: { pos: [2.65, 1.4, 1.65], look: [2.1, 0.6, 1] },
  window: { pos: [-2.45, 1.6, -0.1], look: [-3.45, 1.4, -1.2] },
};
const v = (a) => new T.Vector3(...a);
let seed = 416;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
function texture(kind) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d");
  if (kind === "wood") {
    x.fillStyle = "#e3d8c9";
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 650; i++) {
      const y = random() * 256;
      x.strokeStyle = `rgba(${random() > 0.5 ? "23,12,8" : "198,150,92"},${random() * 0.22})`;
      x.lineWidth = 0.25 + random() * 2;
      x.beginPath();
      x.moveTo(0, y);
      x.bezierCurveTo(
        70,
        y + random() * 3,
        150,
        y - random() * 3,
        256,
        y + random() * 2,
      );
      x.stroke();
    }
  } else if (kind === "cloth") {
    x.fillStyle = "#dce0d2";
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 2) {
      x.strokeStyle = i % 4 ? "#172f2c44" : "#c0c2a522";
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i, 256);
      x.moveTo(0, i);
      x.lineTo(256, i);
      x.stroke();
    }
  } else {
    x.fillStyle = "#e6e5da";
    x.fillRect(0, 0, 256, 256);
    const data = x.getImageData(0, 0, 256, 256);
    for (let i = 0; i < data.data.length; i += 4) {
      const n = (random() - 0.5) * 26;
      data.data[i] += n;
      data.data[i + 1] += n;
      data.data[i + 2] += n;
    }
    x.putImageData(data, 0, 0);
    for (let i = 0; i < 40; i++) {
      x.fillStyle = "#3a2f2012";
      x.beginPath();
      x.ellipse(
        random() * 256,
        random() * 256,
        random() * 16,
        random() * 30,
        0,
        0,
        Math.PI * 2,
      );
      x.fill();
    }
  }
  const map = new T.CanvasTexture(c);
  map.wrapS = map.wrapT = T.RepeatWrapping;
  map.colorSpace = T.SRGBColorSpace;
  return map;
}
function mat(color, roughness = 0.8, metalness = 0) {
  return new T.MeshStandardMaterial({ color, roughness, metalness });
}
function box(group, name, pos, size, material) {
  const o = new T.Mesh(new T.BoxGeometry(...size), material);
  o.name = name;
  o.position.set(...pos);
  o.castShadow = o.receiveShadow = true;
  group.add(o);
  return o;
}
export class World {
  constructor(canvas, onAction, onHover) {
    this.canvas = canvas;
    this.onAction = onAction;
    this.onHover = onHover;
    this.scene = new T.Scene();
    this.scene.background = new T.Color("#111e20");
    this.scene.fog = new T.FogExp2("#142123", 0.018);
    this.camera = new T.PerspectiveCamera(
      57,
      innerWidth / innerHeight,
      0.03,
      60,
    );
    const probe = document.createElement("canvas").getContext("webgl2"),
      debug = probe?.getExtension("WEBGL_debug_renderer_info"),
      device = debug ? probe.getParameter(debug.UNMASKED_RENDERER_WEBGL) : "";
    this.software = /SwiftShader|llvmpipe|Software/i.test(device);
    probe?.getExtension("WEBGL_lose_context")?.loseContext();
    this.production = globalThis.SCENEPLAY_PRODUCTION_CAPTURE === true;
    this.renderer = new T.WebGLRenderer({
      canvas,
      antialias: !this.software && !this.production,
      powerPreference: "high-performance",
      preserveDrawingBuffer: this.production,
    });
    this.renderer.setPixelRatio(
      this.production
        ? 1
        : this.software
          ? 0.7
          : Math.min(devicePixelRatio, 1.5),
    );
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.clock = new T.Clock();
    this.time = 0;
    this.targets = [];
    this.ray = new T.Raycaster();
    this.mouse = new T.Vector2();
    this.animating = false;
    this.interactive = false;
    this.yaw = 0;
    this.pitch = 0;
    this.assist = false;
    this.targetLook = v(PLACES.landing.look);
    this.place = "landing";
    this.walk = null;
    this.lookOffset = { yaw: 0, pitch: 0 };
    this.lightScene();
    this.bind();
  }
  lightScene() {
    this.scene.add(new T.HemisphereLight("#9fbfc3", "#231a12", 0.5));
    this.windowLight = new T.DirectionalLight("#a6c3ce", 1.65);
    this.windowLight.position.set(-5, 2.7, -1.1);
    this.windowLight.target.position.set(0, 0.7, 0);
    this.windowLight.castShadow = true;
    this.windowLight.shadow.mapSize.set(
      this.software ? 512 : 1024,
      this.software ? 512 : 1024,
    );
    Object.assign(this.windowLight.shadow.camera, {
      left: -5,
      right: 5,
      top: 5,
      bottom: -5,
      near: 0.5,
      far: 20,
    });
    this.windowLight.shadow.bias = -0.0005;
    this.windowLight.shadow.normalBias = 0.035;
    this.scene.add(this.windowLight, this.windowLight.target);
    const fill = new T.PointLight("#c4cfc2", 10, 9, 2);
    fill.position.set(1.0, 2.6, 0.6);
    this.scene.add(fill);
    const lamp = new T.PointLight("#ffc482", 8, 7, 2);
    lamp.position.set(-2.7, 1.7, -2.35);
    this.scene.add(lamp);
    this.lamp = lamp;
    const hall = new T.PointLight("#f8d9a0", 7, 8, 2);
    hall.position.set(-2.25, 2.7, -5.9);
    this.scene.add(hall);
    this.blue = new T.PointLight("#4f8bbf", 3, 8, 2);
    this.blue.position.set(-3, 1.8, -6.3);
    this.scene.add(this.blue);
  }
  async load() {
    const gltf = await new GLTFLoader().loadAsync(
      "assets/models/apartment.glb",
    );
    this.model = gltf.scene;
    this.scene.add(this.model);
    const wood = texture("wood"),
      cloth = texture("cloth"),
      wall = texture("wall");
    this.bookends = [];
    this.markers = [];
    this.phoneMeshes = [];
    this.model.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = o.receiveShadow = true;
      let m = o.material;
      m = m.clone();
      o.material = m;
      const name = m.name.toLowerCase();
      if (name.includes("walnut") || name.includes("oak")) {
        m.map = wood;
        m.bumpMap = wood;
        m.bumpScale = 0.024;
        m.roughness = 0.72;
      }
      if (name.includes("plaster")) {
        m.map = wall;
        m.bumpMap = wall;
        m.bumpScale = 0.018;
        m.roughness = 1;
      }
      if (name.includes("woven") || name === "linen") {
        m.map = cloth;
        m.bumpMap = cloth;
        m.bumpScale = 0.008;
        m.roughness = 1;
      }
      if (name.includes("bronze")) {
        m.color.set("#8b673a");
        m.metalness = 0.72;
        m.roughness = 0.38;
      }
      if (name === "glass") {
        m.transparent = true;
        m.opacity = 0.28;
        m.roughness = 0.1;
        m.depthWrite = false;
      }
      if (o.name === "Cone") {
        m.emissive = new T.Color("#e0a15a");
        m.emissiveIntensity = 0.2;
      }
      if (o.userData.scene_role === "bookend") this.bookends.push(o);
      if (o.userData.scene_role === "marker") this.markers.push(o);
      if (o.name === "victim_phone" || o.name === "phone_screen")
        this.phoneMeshes.push(o);
      if (o.name === "service_door" || o.name === "clock_hand")
        o.visible = false;
    });
    this.sofa = this.model.getObjectByName("sofa_arrangement");
    this.batchRoom();
    this.setVersion("current");
    this.details();
    this.makeOfficer();
    this.createTargets();
    this.move("landing", true);
    return this;
  }
  batchRoom() {
    // Keep evidence, movable furniture and walkable surfaces semantically
    // separate. Batch the remaining fixed geometry by material, baking each
    // object's transform once instead of issuing hundreds of calls per frame.
    this.model.updateMatrixWorld(true);
    const groups = new Map();
    this.model.traverse((o) => {
      if (!o.isMesh || !o.visible || Array.isArray(o.material)) return;
      let parent = o;
      while (parent) {
        if (parent === this.sofa) return;
        parent = parent.parent;
      }
      if (o.userData.scene_role || this.phoneMeshes.includes(o)) return;
      const floor =
        /floorboard|rug|hall_floor|service_corridor_floor|stair_connection_floor/.test(
          o.name,
        );
      const key = [
        o.material.name,
        floor,
        Object.keys(o.geometry.attributes).sort().join(","),
      ].join("/");
      if (!groups.has(key))
        groups.set(key, { material: o.material, floor, items: [] });
      groups.get(key).items.push(o);
    });
    this.staticRoom = new T.Group();
    this.scene.add(this.staticRoom);
    for (const group of groups.values()) {
      const geometries = group.items.map((o) => {
        const geometry = o.geometry.index
          ? o.geometry.toNonIndexed()
          : o.geometry.clone();
        geometry.applyMatrix4(o.matrixWorld);
        return geometry;
      });
      const merged = mergeGeometries(geometries, false);
      if (!merged) {
        geometries.forEach((geometry) => geometry.dispose());
        continue;
      }
      const mesh = new T.Mesh(merged, group.material);
      mesh.name = group.floor ? "merged_floorboard" : "fixed_room_geometry";
      mesh.castShadow = mesh.receiveShadow = true;
      this.staticRoom.add(mesh);
      group.items.forEach((o) => {
        o.visible = false;
      });
      geometries.forEach((geometry) => geometry.dispose());
    }
  }
  setVersion(version) {
    this.renderer.shadowMap.needsUpdate = true;
    this.version = version;
    this.phoneMeshes?.forEach((o) => (o.visible = version === "current"));
    this.policeProps?.forEach((o) => (o.visible = version === "current"));
    if (this.officer) this.officer.visible = version === "current";
    if (this.sofa) {
      this.sofa.position.set(
        version === "before" ? -0.5 : 1.7,
        0,
        version === "before" ? -1.9 : -0.8,
      );
      this.sofa.rotation.set(0, version === "before" ? 0 : -Math.PI / 2, 0);
    }
    this.bookends?.forEach((o) => (o.visible = version !== "current"));
    this.markers?.forEach((o) => (o.visible = version === "current"));
    if (this.clockHands) {
      const [h, m] =
        version === "before"
          ? [18, 14]
          : version === "prepared"
            ? [19, 6]
            : [9, 24];
      this.clockHands[0].rotation.z = (-((h % 12) + m / 60) * Math.PI) / 6;
      this.clockHands[1].rotation.z = (-m * Math.PI) / 30;
    }
  }
  details() {
    this.policeProps = [];
    const wood = mat("#312319"),
      paper = mat("#d3c5a4"),
      gold = mat("#b69a62", 0.38, 0.65),
      black = mat("#152124");
    this.entry = new T.Group();
    this.entry.position.set(-2.83, 0, -3.42);
    this.scene.add(this.entry);
    box(this.entry, "door", [0.56, 1.18, 0], [1.12, 2.36, 0.065], wood);
    for (const y of [0.65, 1.72])
      box(
        this.entry,
        "door-panel",
        [0.56, y, -0.04],
        [0.88, 0.73, 0.025],
        mat("#261d17"),
      );
    box(
      this.entry,
      "door-handle",
      [1.0, 1.02, -0.075],
      [0.16, 0.035, 0.04],
      gold,
    );
    this.entry.rotation.y = -1.25;
    // Ordinary possessions give scale and a life, not a set of category buttons.
    this.clockHands = [];
    for (const length of [0.11, 0.17]) {
      const pivot = new T.Group();
      pivot.position.set(0, 2.35, -3.328);
      this.scene.add(pivot);
      box(
        pivot,
        "clock hand",
        [0, length / 2, 0],
        [0.009, length, 0.01],
        black,
      );
      this.clockHands.push(pivot);
    }
    this.setVersion(this.version || "current");
    const books = new T.Group();
    this.scene.add(books);
    box(
      books,
      "notebook",
      [-0.5, 0.635, -0.07],
      [0.32, 0.04, 0.24],
      mat("#3a3b2d"),
    );
    box(books, "envelope", [-0.2, 0.62, -0.19], [0.22, 0.01, 0.14], paper);
    box(
      this.scene,
      "window sill",
      [-3.36, 0.86, -1.25],
      [0.25, 0.05, 1.9],
      wood,
    );
    const cup = new T.Group();
    cup.position.set(-3.22, 0.94, -1.22);
    this.scene.add(cup);
    const ceramic = mat("#3b6571", 0.32);
    const body = new T.Mesh(
      new T.CylinderGeometry(0.07, 0.065, 0.11, 32, 1, true),
      ceramic,
    );
    cup.add(body);
    const handle = new T.Mesh(
      new T.TorusGeometry(0.043, 0.012, 10, 24),
      ceramic,
    );
    handle.position.x = 0.075;
    handle.rotation.y = Math.PI / 2;
    cup.add(handle);
    const repair = new T.Mesh(new T.BoxGeometry(0.005, 0.095, 0.004), gold);
    repair.position.set(0.05, 0, 0.055);
    repair.rotation.z = 0.2;
    cup.add(repair);
    this.cup = cup;
    const frame = new T.Group();
    frame.position.set(-3.28, 1.025, -1.55);
    frame.rotation.y = Math.PI / 2;
    this.scene.add(frame);
    box(frame, "small-frame", [0, 0, 0], [0.22, 0.28, 0.02], wood);
    new T.TextureLoader().load("assets/photos/iris.png", (map) => {
      map.colorSpace = T.SRGBColorSpace;
      const photo = new T.Mesh(
        new T.PlaneGeometry(0.185, 0.245),
        new T.MeshBasicMaterial({ map }),
      );
      photo.position.z = 0.012;
      frame.add(photo);
    });
    const bag = new T.Group();
    bag.position.set(2.1, 0.616, 1);
    this.scene.add(bag);
    this.policeProps.push(bag);
    const plastic = new T.MeshPhysicalMaterial({
      color: "#d8e0d5",
      transparent: true,
      opacity: 0.12,
      roughness: 0.22,
      metalness: 0,
      depthWrite: false,
    });
    box(bag, "original device seal", [0, 0, 0], [0.23, 0.014, 0.32], plastic);
    box(
      bag,
      "evidence seal",
      [0, 0.012, -0.14],
      [0.23, 0.005, 0.025],
      mat("#794634"),
    );
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 256;
    labelCanvas.height = 96;
    const lx = labelCanvas.getContext("2d");
    lx.fillStyle = "#ddd3af";
    lx.fillRect(0, 0, 256, 96);
    lx.fillStyle = "#29332d";
    lx.font = "bold 28px monospace";
    lx.fillText("A-04 / SEALED", 8, 37);
    lx.font = "18px monospace";
    lx.fillText("CASE 0416", 8, 69);
    const labelMap = new T.CanvasTexture(labelCanvas);
    labelMap.colorSpace = T.SRGBColorSpace;
    const label = new T.Mesh(
      new T.PlaneGeometry(0.14, 0.05),
      new T.MeshBasicMaterial({ map: labelMap }),
    );
    label.rotation.x = -Math.PI / 2;
    label.position.set(0, 0.011, 0.12);
    bag.add(label);
    this.setVersion(this.version);
    // Rain is outside the window, never over the player's screen.
    const rainGeo = new T.BufferGeometry(),
      positions = [];
    for (let i = 0; i < 70; i++) {
      const y = random() * 2 + 0.7,
        z = -0.2 - random() * 2.1;
      positions.push(-3.7, y, z, -3.7, y - 0.14, z + 0.016);
    }
    rainGeo.setAttribute(
      "position",
      new T.Float32BufferAttribute(positions, 3),
    );
    this.rain = new T.LineSegments(
      rainGeo,
      new T.LineBasicMaterial({
        color: "#b3d4d4",
        transparent: true,
        opacity: 0.27,
      }),
    );
    this.scene.add(this.rain);
    const dust = new T.BufferGeometry(),
      pts = [];
    for (let i = 0; i < 90; i++)
      pts.push((random() - 0.5) * 6, random() * 2.5, random() * 5 - 2.7);
    dust.setAttribute("position", new T.Float32BufferAttribute(pts, 3));
    this.dust = new T.Points(
      dust,
      new T.PointsMaterial({
        color: "#c9b886",
        size: 0.009,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    );
    this.scene.add(this.dust);
    this.listeningDesk();
  }
  listeningDesk() {
    // The fourth wall and Iris's ordinary working corner make a complete room.
    // None of these possessions establishes a fact about the death.
    const plaster = [];
    this.model.traverse((o) => {
      if (o.isMesh && o.material.name.includes("plaster"))
        plaster.push(o.material);
    });
    this.rearWall = box(
      this.scene,
      "south wall",
      [0, 1.55, 3.09],
      [7, 3.1, 0.15],
      plaster[0] || mat("#515c4c"),
    );
    const wood = mat("#392a1e"),
      brass = mat("#82724c", 0.4, 0.5),
      paper = mat("#b8ac8e");
    for (const y of [0.18, 0.8])
      box(this.scene, "south moulding", [0, y, 2.98], [7, 0.07, 0.045], wood);
    box(
      this.scene,
      "listening desk",
      [0.55, 0.79, 2.64],
      [1.85, 0.07, 0.62],
      wood,
    );
    for (const x of [-0.25, 1.35])
      for (const z of [2.42, 2.85])
        box(this.scene, "desk leg", [x, 0.38, z], [0.065, 0.76, 0.065], wood);
    for (let i = 0; i < 5; i++) {
      const page = box(
        this.scene,
        "working paper",
        [0.77 + i * 0.013, 0.833 + i * 0.003, 2.55],
        [0.33, 0.002, 0.24],
        paper,
      );
      page.rotation.y = -0.16 + i * 0.035;
    }
    const writing = document.createElement("canvas");
    writing.width = 512;
    writing.height = 384;
    const x = writing.getContext("2d");
    x.fillStyle = "#cfc2a4";
    x.fillRect(0, 0, 512, 384);
    x.fillStyle = "#4a493e";
    x.font = "22px monospace";
    x.fillText("LISTENING NOTES", 32, 45);
    x.font = "16px monospace";
    x.fillText("room tone / domestic recordings", 32, 76);
    for (let row = 0; row < 8; row++) {
      x.fillText(
        `${String(row + 1).padStart(2, "0")}   ${["street, open window", "kettle / kitchen", "hallway, footsteps", "rain / evening"][row % 4]}`,
        32,
        116 + row * 28,
      );
    }
    const noteMap = new T.CanvasTexture(writing);
    noteMap.colorSpace = T.SRGBColorSpace;
    const sheet = new T.Mesh(
      new T.PlaneGeometry(0.33, 0.24),
      new T.MeshStandardMaterial({ map: noteMap, roughness: 1 }),
    );
    sheet.rotation.x = -Math.PI / 2;
    sheet.rotation.z = 0.03;
    sheet.position.set(0.81, 0.853, 2.55);
    this.scene.add(sheet);
    const deck = new T.Group();
    deck.position.set(0.05, 0.855, 2.64);
    this.scene.add(deck);
    box(
      deck,
      "portable cassette recorder",
      [0, 0, 0],
      [0.38, 0.06, 0.22],
      mat("#353b36", 0.55, 0.3),
    );
    box(
      deck,
      "cassette window",
      [0, 0.034, 0.025],
      [0.23, 0.004, 0.1],
      mat("#171c1b"),
    );
    for (const a of [-0.064, 0.064]) {
      const reel = new T.Mesh(
        new T.CylinderGeometry(0.029, 0.029, 0.005, 20),
        paper,
      );
      reel.position.set(a, 0.039, 0.025);
      deck.add(reel);
      const hub = new T.Mesh(
        new T.CylinderGeometry(0.01, 0.01, 0.006, 12),
        wood,
      );
      hub.position.set(a, 0.042, 0.025);
      deck.add(hub);
    }
    for (let i = 0; i < 5; i++)
      box(
        deck,
        "recorder key",
        [-0.12 + i * 0.06, 0.035, -0.078],
        [0.042, 0.012, 0.03],
        mat("#97978a", 0.6, 0.3),
      );
    const band = new T.Mesh(
      new T.TorusGeometry(0.1, 0.009, 8, 32, Math.PI),
      mat("#242827"),
    );
    band.rotation.x = -Math.PI / 2;
    band.position.set(1.19, 0.85, 2.54);
    this.scene.add(band);
    for (const a of [1.09, 1.29])
      box(
        this.scene,
        "headphone earpad",
        [a, 0.85, 2.54],
        [0.06, 0.035, 0.08],
        mat("#1b2323"),
      );
    // A familiar local building drawing, rather than an unexplained suspect wall.
    const art = document.createElement("canvas");
    art.width = 512;
    art.height = 384;
    const a = art.getContext("2d");
    a.fillStyle = "#c1b496";
    a.fillRect(0, 0, 512, 384);
    a.strokeStyle = "#5e6152";
    a.lineWidth = 2;
    for (let i = 0; i < 9; i++) {
      const h = 100 + ((i * 37) % 110),
        px = 35 + i * 49;
      a.strokeRect(px, 290 - h, 42, h);
      for (let row = 0; row < Math.floor(h / 27); row++)
        for (let col = 0; col < 2; col++)
          a.strokeRect(px + 8 + col * 17, 278 - row * 27, 7, 13);
    }
    a.font = "18px serif";
    a.fillStyle = "#5e6152";
    a.fillText("V E S P E R A", 195, 333);
    const artMap = new T.CanvasTexture(art);
    artMap.colorSpace = T.SRGBColorSpace;
    box(
      this.scene,
      "print frame",
      [0.55, 1.91, 2.98],
      [1.05, 0.8, 0.045],
      wood,
    );
    const print = new T.Mesh(
      new T.PlaneGeometry(0.96, 0.72),
      new T.MeshStandardMaterial({ map: artMap, roughness: 1 }),
    );
    print.rotation.y = Math.PI;
    print.position.set(0.55, 1.91, 2.95);
    this.scene.add(print);
    box(this.scene, "desk drawer", [1.0, 0.69, 2.64], [0.6, 0.18, 0.56], wood);
    box(
      this.scene,
      "desk drawer handle",
      [1.0, 0.69, 2.34],
      [0.18, 0.025, 0.035],
      brass,
    );
  }
  makeOfficer() {
    const g = new T.Group();
    g.position.set(-1.78, 0, -4.84);
    g.rotation.y = 0.55;
    this.scene.add(g);
    this.officer = g;
    const navy = mat("#1e2b2b"),
      skin = mat("#957861"),
      leather = mat("#1a1c19"),
      badge = mat("#ac9a6c", 0.38, 0.7);
    const ellipsoid = (p, s, m) => {
      const o = new T.Mesh(new T.SphereGeometry(1, 20, 14), m);
      o.position.set(...p);
      o.scale.set(...s);
      g.add(o);
      o.castShadow = true;
      return o;
    };
    // Y is vertical in the live world. Keep the silhouette anatomical rather
    // than carrying the Blender reference's Z-up proportions into these meshes.
    const torso = new T.Mesh(
      new T.LatheGeometry(
        [
          [0.18, 0.93],
          [0.2, 1.02],
          [0.18, 1.13],
          [0.21, 1.32],
          [0.23, 1.42],
          [0.18, 1.48],
          [0.085, 1.5],
        ].map(([x, y]) => new T.Vector2(x, y)),
        28,
      ),
      navy,
    );
    torso.scale.z = 0.58;
    torso.castShadow = torso.receiveShadow = true;
    g.add(torso);
    this.head = new T.Group();
    this.head.position.y = 1.69;
    g.add(this.head);
    const facePart = (p, s, m) => {
      const o = ellipsoid(p, s, m);
      g.remove(o);
      this.head.add(o);
      return o;
    };
    const face = new T.Mesh(
      new T.LatheGeometry(
        [
          [0.035, -0.13],
          [0.065, -0.115],
          [0.085, -0.075],
          [0.098, -0.01],
          [0.097, 0.045],
          [0.087, 0.105],
          [0.045, 0.14],
          [0.002, 0.147],
        ].map(([x, y]) => new T.Vector2(x, y)),
        32,
      ),
      skin,
    );
    face.scale.z = 0.84;
    face.castShadow = true;
    this.head.add(face);
    const hair = new T.Mesh(
      new T.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, 1.45),
      leather,
    );
    hair.scale.set(0.108, 0.127, 0.105);
    hair.position.set(0, 0.028, 0);
    this.head.add(hair);
    facePart([0, 0.015, 0.058], [0.101, 0.112, 0.046], leather);
    facePart([0, 0.015, 0.12], [0.045, 0.047, 0.038], leather);
    facePart([0, -0.005, -0.087], [0.015, 0.029, 0.022], skin);
    facePart([0, -0.038, -0.082], [0.024, 0.012, 0.01], skin);
    for (const sign of [-1, 1]) {
      facePart([sign * 0.095, -0.006, 0.003], [0.014, 0.029, 0.019], skin);
      facePart(
        [sign * 0.034, 0.026, -0.078],
        [0.017, 0.0055, 0.004],
        mat("#9b9c89"),
      );
      facePart(
        [sign * 0.034, 0.026, -0.083],
        [0.006, 0.005, 0.0025],
        mat("#333b30"),
      );
      facePart([sign * 0.034, 0.041, -0.077], [0.023, 0.003, 0.005], leather);
    }
    facePart([0, -0.066, -0.077], [0.027, 0.0025, 0.003], mat("#63483e"));
    const limb = (p, q, r, m) => {
      const a = v(p),
        b = v(q),
        o = new T.Mesh(
          new T.CylinderGeometry(r, r * 0.88, a.distanceTo(b), 12),
          m,
        );
      o.position.copy(a).add(b).multiplyScalar(0.5);
      o.quaternion.setFromUnitVectors(
        new T.Vector3(0, 1, 0),
        b.sub(a).normalize(),
      );
      g.add(o);
      o.castShadow = true;
      return o;
    };
    for (const sign of [-1, 1]) {
      ellipsoid([sign * 0.21, 1.415, 0], [0.09, 0.085, 0.1], navy);
      limb([sign * 0.11, 0.95, 0], [sign * 0.12, 0.49, 0.02], 0.09, navy);
      limb([sign * 0.12, 0.49, 0.02], [sign * 0.12, 0.08, 0.02], 0.07, navy);
      ellipsoid([sign * 0.12, 0.065, -0.06], [0.085, 0.065, 0.17], leather);
      limb([sign * 0.24, 1.43, 0], [sign * 0.29, 1.15, 0.03], 0.074, navy);
      limb([sign * 0.29, 1.15, 0.03], [sign * 0.19, 1.03, -0.12], 0.06, navy);
      ellipsoid([sign * 0.19, 1.03, -0.13], [0.045, 0.06, 0.04], skin);
    }
    limb([0, 1.47, 0], [0, 1.6, 0], 0.065, skin);
    for (const sign of [-1, 1]) {
      box(
        g,
        "uniform seam",
        [sign * 0.16, 1.25, -0.135],
        [0.007, 0.3, 0.004],
        mat("#121e1c"),
      );
    }
    box(g, "officer badge", [-0.1, 1.4, -0.145], [0.045, 0.06, 0.008], badge);
    box(
      g,
      "officer notebook",
      [0, 1.07, -0.17],
      [0.21, 0.23, 0.025],
      mat("#403c29"),
    );
    box(g, "uniform belt", [0, 1.015, 0], [0.4, 0.045, 0.25], leather);
    box(g, "belt clasp", [0, 1.015, -0.13], [0.045, 0.035, 0.015], badge);
    box(g, "radio", [0.13, 1.38, -0.14], [0.055, 0.095, 0.025], leather);
    box(g, "radio aerial", [0.15, 1.46, -0.14], [0.006, 0.09, 0.006], leather);
    box(g, "collar", [0, 1.5, -0.08], [0.1, 0.09, 0.02], navy);
  }
  createTargets() {
    const add = (id, pos, size, label) => {
      const collider = new T.Mesh(
        new T.BoxGeometry(...size),
        new T.MeshBasicMaterial({ visible: false }),
      );
      collider.position.set(...pos);
      collider.userData = { action: id, label };
      this.scene.add(collider);
      this.targets.push(collider);
      return collider;
    };
    add(
      "officer",
      [-1.78, 1.1, -4.84],
      [0.75, 1.9, 0.6],
      "Speak to Sergeant Petrescu",
    );
    add("door", [-2.25, 1.2, -3.4], [1.1, 2.4, 0.25], "Enter the apartment");
    add(
      "shelf",
      [1.4, 1.1, -3.0],
      [0.85, 0.5, 0.45],
      "Examine the lower shelf",
    );
    add("sofa", [1.7, 0.7, -0.8], [0.95, 1.2, 2.25], "Examine the sofa");
    add(
      "phone",
      [2.1, 0.67, 1],
      [0.35, 0.24, 0.4],
      "Pick up the authorised phone copy",
    );
    add("table", [0, 0.66, 0], [1.5, 0.3, 0.85], "Examine the low table");
    add(
      "desk",
      [0.55, 0.88, 2.64],
      [1.85, 0.28, 0.62],
      "Look at Iris's listening desk",
    );
    add("mug", [-3.2, 0.94, -1.22], [0.32, 0.27, 0.35], "Look at the blue mug");
    for (const [id, p] of Object.entries(PLACES)) {
      if (id === "landing") continue;
      const ring = new T.Mesh(
        new T.RingGeometry(0.11, 0.135, 32),
        new T.MeshBasicMaterial({
          color: "#cfb882",
          transparent: true,
          opacity: 0.18,
          side: T.DoubleSide,
          depthWrite: false,
        }),
      );
      ring.position.set(p.pos[0], 0.045, p.pos[2]);
      ring.rotation.x = -Math.PI / 2;
      ring.userData = {
        action: "walk:" + id,
        label:
          id === "threshold"
            ? "Walk to the doorway"
            : id === "room"
              ? "Step into the room"
              : "Walk closer",
      };
      this.scene.add(ring);
      this.targets.push(ring);
    }
  }
  routeTo(id) {
    const nodes = {
      ...PLACES,
      north: { pos: [-2.25, 1.65, -2.5], look: [0.2, 1, -1] },
      shelfApproach: { pos: [0.95, 1.65, -2.4], look: [1.4, 1, -3] },
      west: { pos: [-2.6, 1.65, -0.1], look: [-0.3, 1, 0] },
      east: { pos: [2.7, 1.65, -2.4], look: [1.4, 1, -2.9] },
      southwest: { pos: [-2.6, 1.65, 1.55], look: [0, 1, 0] },
    };
    const links = [
      ["landing", "threshold"],
      ["threshold", "north"],
      ["north", "shelfApproach"],
      ["shelfApproach", "shelf"],
      ["north", "west"],
      ["north", "room"],
      ["phone", "east"],
      ["east", "shelfApproach"],
      ["west", "window"],
      ["west", "southwest"],
      ["southwest", "room"],
      ["room", "table"],
      ["room", "phone"],
    ];
    const queue = [[this.place]],
      seen = new Set();
    while (queue.length) {
      const path = queue.shift(),
        last = path.at(-1);
      if (last === id) return path.slice(1).map((n) => nodes[n]);
      if (seen.has(last)) continue;
      seen.add(last);
      for (const [a, b] of links) {
        if (a === last && !seen.has(b)) queue.push([...path, b]);
        if (b === last && !seen.has(a)) queue.push([...path, a]);
      }
    }
    return [nodes[id]];
  }
  move(id, instant = false) {
    const p = PLACES[id];
    if (!p) return Promise.resolve();
    const path = this.routeTo(id);
    if (!path.length) path.push(p);
    this.inspectionOrbit = null;
    this.place = id;
    this.lookOffset = { yaw: 0, pitch: 0 };
    if (instant) {
      this.walkResolve?.();
      this.walkResolve = null;
      this.camera.position.copy(v(p.pos));
      this.targetLook.copy(v(p.look));
      this.camera.lookAt(this.targetLook);
      this.walk = null;
      this.walkQueue = [];
      return Promise.resolve();
    }
    return this.travel(path);
  }
  travel(path) {
    this.walkResolve?.();
    this.walkQueue = path.filter(Boolean);
    return new Promise((resolve) => {
      this.walkResolve = resolve;
      this.nextWalk();
    });
  }
  nextWalk() {
    const p = this.walkQueue?.shift();
    if (!p) {
      this.walk = null;
      const done = this.walkResolve;
      this.walkResolve = null;
      done?.();
      return;
    }
    this.walk = {
      start: performance.now(),
      from: this.camera.position.clone(),
      to: v(p.pos),
      lookFrom: this.targetLook.clone(),
      lookTo: v(p.look),
      duration: Math.max(650, this.camera.position.distanceTo(v(p.pos)) * 380),
    };
    window.dispatchEvent(new CustomEvent("walking", { detail: this.place }));
  }
  focus(pos, look, instant = false) {
    this.inspectionOrbit = null;
    this.lookOffset = { yaw: 0, pitch: 0 };
    if (instant) {
      this.camera.position.copy(v(pos));
      this.targetLook.copy(v(look));
      this.walk = null;
      return Promise.resolve();
    }
    return this.travel([{ pos, look }]);
  }
  beginInspection(look) {
    const center = v(look);
    this.inspectionOrbit = {
      center,
      offset: this.camera.position.clone().sub(center),
      yaw: 0,
      pitch: 0,
      scale: 1,
    };
  }
  lean(delta) {
    if (this.inspectionOrbit)
      this.inspectionOrbit.scale = Math.max(
        0.65,
        Math.min(1.25, this.inspectionOrbit.scale + delta),
      );
  }
  hit(x, y) {
    const r = this.canvas.getBoundingClientRect();
    this.mouse.set(
      ((x - r.left) / r.width) * 2 - 1,
      (-(y - r.top) / r.height) * 2 + 1,
    );
    this.ray.setFromCamera(this.mouse, this.camera);
    const chosen = this.ray
      .intersectObjects(this.targets, false)
      .find((h) => h.distance < 7);
    const block = this.ray
      .intersectObjects(
        [this.model, this.staticRoom, this.entry, this.rearWall].filter(
          Boolean,
        ),
        true,
      )
      .find(
        (h) =>
          h.object.visible !== false &&
          h.object.material?.visible !== false &&
          (!h.object.material?.transparent || h.object.material.opacity > 0.6),
      );
    if (chosen && (!block || block.distance + 0.12 >= chosen.distance))
      return chosen.object;
    if (
      block &&
      /floorboard|rug|hall_floor|service_corridor_floor|stair_connection_floor/.test(
        block.object.name,
      )
    ) {
      const point = block.point;
      const nearest = Object.entries(PLACES).sort(
        ([, a], [, b]) =>
          Math.hypot(a.pos[0] - point.x, a.pos[2] - point.z) -
          Math.hypot(b.pos[0] - point.x, b.pos[2] - point.z),
      )[0];
      return {
        userData: { action: "walk:" + nearest[0], label: "Walk closer" },
      };
    }
  }
  bind() {
    let drag = null;
    this.canvas.addEventListener("pointerdown", (ev) => {
      if (!this.interactive && !this.inspectionOrbit) return;
      drag = {
        x: ev.clientX,
        y: ev.clientY,
        lastX: ev.clientX,
        lastY: ev.clientY,
        moved: false,
      };
      this.canvas.setPointerCapture(ev.pointerId);
    });
    this.canvas.addEventListener("pointermove", (ev) => {
      if (!this.interactive && !this.inspectionOrbit) return;
      if (drag) {
        const dx = ev.clientX - drag.lastX,
          dy = ev.clientY - drag.lastY;
        drag.lastX = ev.clientX;
        drag.lastY = ev.clientY;
        drag.moved ||=
          Math.abs(ev.clientX - drag.x) + Math.abs(ev.clientY - drag.y) > 7;
        if (drag.moved && this.inspectionOrbit) {
          this.inspectionOrbit.yaw = Math.max(
            -0.45,
            Math.min(0.45, this.inspectionOrbit.yaw - dx * 0.004),
          );
          this.inspectionOrbit.pitch = Math.max(
            -0.22,
            Math.min(0.22, this.inspectionOrbit.pitch - dy * 0.003),
          );
        } else if (drag.moved) {
          this.lookOffset.yaw = this.lookOffset.yaw - dx * 0.004;
          this.lookOffset.pitch = Math.max(
            -0.65,
            Math.min(0.55, this.lookOffset.pitch - dy * 0.003),
          );
        }
      } else this.onHover?.(this.hit(ev.clientX, ev.clientY)?.userData);
    });
    this.canvas.addEventListener("pointerup", (ev) => {
      if (!this.interactive) {
        drag = null;
        return;
      }
      if (drag && !drag.moved) {
        const hit = this.hit(ev.clientX, ev.clientY);
        if (hit) this.onAction?.(hit.userData.action);
      }
      drag = null;
    });
    this.canvas.addEventListener("pointercancel", () => (drag = null));
    window.addEventListener("resize", () => this.resize());
  }
  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  }
  animate(time = 0) {
    this.time = time;
    this.officer.position.y = Math.sin(time * 1.4) * 0.005;
    this.head.rotation.y = Math.sin(time * 0.43) * 0.06;
    this.officer.rotation.z = Math.sin(time * 0.53) * 0.005;
    this.blue.intensity = 1.5 + (Math.sin(time * 1.2) > 0.85 ? 2.5 : 0);
    this.dust.rotation.y = Math.sin(time * 0.035) * 0.03;
    this.rain.position.y = -((time * 0.35) % 0.35);
    if (this.walk) {
      const p = Math.min(
          1,
          (performance.now() - this.walk.start) / this.walk.duration,
        ),
        u = p * p * (3 - 2 * p);
      this.camera.position.lerpVectors(this.walk.from, this.walk.to, u);
      this.targetLook.lerpVectors(this.walk.lookFrom, this.walk.lookTo, u);
      if (p === 1) this.nextWalk();
    }
    if (this.inspectionOrbit && !this.walk) {
      const o = this.inspectionOrbit,
        offset = o.offset
          .clone()
          .multiplyScalar(o.scale)
          .applyAxisAngle(new T.Vector3(0, 1, 0), o.yaw);
      const right = new T.Vector3()
        .crossVectors(offset, new T.Vector3(0, 1, 0))
        .normalize();
      offset.applyAxisAngle(right, o.pitch);
      this.camera.position.copy(o.center).add(offset);
      this.targetLook.copy(o.center);
    }
    const direction = this.targetLook.clone().sub(this.camera.position);
    direction.applyAxisAngle(new T.Vector3(0, 1, 0), this.lookOffset.yaw);
    const right = new T.Vector3()
      .crossVectors(direction, new T.Vector3(0, 1, 0))
      .normalize();
    direction.applyAxisAngle(right, this.lookOffset.pitch);
    this.camera.lookAt(this.camera.position.clone().add(direction));
    this.renderer.render(this.scene, this.camera);
    if (this.interactive && time - (this.hoverAt || 0) > 0.2) {
      this.hoverAt = time;
      this.onHover?.(this.hit(innerWidth / 2, innerHeight / 2)?.userData);
    }
  }
  start() {
    if (this.animating) return;
    if (this.walk && this.pausedAt)
      this.walk.start += performance.now() - this.pausedAt;
    this.pausedAt = null;
    this.animating = true;
    const frame = () => {
      if (!this.animating) return;
      this.animate(this.clock.getElapsedTime());
      this.frameHandle = requestAnimationFrame(frame);
    };
    frame();
  }
  stop() {
    if (this.animating) this.pausedAt = performance.now();
    this.animating = false;
    cancelAnimationFrame(this.frameHandle);
    this.frameHandle = null;
  }
  cinematic(t) {
    this.targets.forEach((o) => {
      if (o.userData.action?.startsWith("walk:")) o.visible = false;
    });
    this.renderer.shadowMap.needsUpdate =
      Math.floor(t * 2) !== this.shadowBucket;
    this.shadowBucket = Math.floor(t * 2);
    this.interactive = false;
    this.walk = null;
    this.lookOffset = { yaw: 0, pitch: 0 };
    const ease = (x) => x * x * (3 - 2 * x);
    let pos, look;
    if (t < 12) {
      const p = ease(t / 12);
      pos = new T.Vector3(-2.52, 1.67, -6.35).lerp(
        new T.Vector3(-2.48, 1.67, -5.85),
        p,
      );
      look = new T.Vector3(-1.8, 1.5, -4.83);
    } else if (t < 25) {
      const p = ease((t - 12) / 13);
      pos = new T.Vector3(-2.45, 1.6, -5.18).lerp(
        new T.Vector3(-2.32, 1.62, -3.68),
        p,
      );
      look = new T.Vector3(0.15, 1.05, -0.4);
      this.entry.rotation.y = -0.16 - 1.09 * ease(Math.min(1, (t - 12) / 6));
    } else if (t < 31) {
      const p = ease((t - 25) / 6);
      pos = new T.Vector3(-3.0, 1.42, -1.2).lerp(
        new T.Vector3(-3.05, 1.48, -1.42),
        p,
      );
      look = new T.Vector3(-2.7, 1.6, -2.35);
    } else {
      const p = ease(Math.min(1, (t - 31) / 12));
      pos = new T.Vector3(-2.35, 1.65, -3.55).lerp(
        new T.Vector3(...PLACES.threshold.pos),
        p,
      );
      look = new T.Vector3(0.1, 1, -0.1);
    }
    if (t < 12) this.entry.rotation.y = -0.16;
    this.camera.position.copy(pos);
    this.targetLook.copy(look);
    this.officer.position.y = Math.sin(t * 1.5) * 0.007;
    this.officer.rotation.y =
      0.55 - (t > 12 ? Math.min(0.6, (t - 12) * 0.05) : 0);
    // She turns at her wall-side post; translating farther right would put her
    // shoulder through the narrow landing wall as Dima passes.
    this.officer.position.x = -1.78;
    this.head.rotation.y = Math.sin(t * 0.7) * 0.06;
    this.animate(t);
  }
  photograph(version, pos, look) {
    this.targets.forEach((o) => {
      if (o.userData.action?.startsWith("walk:")) o.visible = false;
    });
    const old = this.version;
    this.setVersion(version);
    this.camera.position.copy(v(pos));
    this.targetLook.copy(v(look));
    this.lookOffset = { yaw: 0, pitch: 0 };
    this.walk = null;
    this.animate(0);
    const jpg = this.canvas.toDataURL("image/jpeg", 0.95);
    this.setVersion(old);
    return jpg;
  }
}
