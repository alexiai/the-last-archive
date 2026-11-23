import * as T from "three";

const material = (color, roughness = 0.85, metalness = 0) =>
  new T.MeshStandardMaterial({ color, roughness, metalness });
const Y = new T.Vector3(0, 1, 0);
const smooth = (x) => {
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
};

export function speechLevel(clip, sampleRate, time) {
  if (!clip || time < 0 || time >= clip.duration) return 0;
  const p = time * sampleRate,
    i = Math.floor(p),
    a = clip.values[i] || 0;
  return a + ((clip.values[i + 1] || 0) - a) * (p - i);
}

// Original stylized character. The film and live room share this rig, whose
// pose is a function of time rather than the order in which frames are rendered.
export function createOfficer() {
  const root = new T.Group(),
    torso = new T.Group(),
    head = new T.Group();
  root.name = "Sergeant Petrescu";
  root.position.set(-1.78, 0, -4.84);
  root.rotation.y = 0.55;
  torso.position.y = 1.0;
  root.add(torso);
  head.position.y = 0.642;
  torso.add(head);
  const cloth = material("#29373b", 0.94),
    seam = material("#1c292d", 0.98),
    skin = material("#b69883", 0.77),
    lips = material("#8b645b", 0.82),
    hair = material("#282722", 0.92),
    hairLight = material("#3a3830", 0.94),
    leather = material("#171f21", 0.62),
    brass = material("#a99c78", 0.5, 0.38);
  const weave = document.createElement("canvas");
  weave.width = weave.height = 64;
  const wx = weave.getContext("2d");
  wx.fillStyle = "#f7f6ef";
  wx.fillRect(0, 0, 64, 64);
  wx.fillStyle = "#56666b18";
  for (let i = 0; i < 64; i += 2) {
    wx.fillRect(i, 0, 1, 64);
    wx.fillRect(0, i, 64, 1);
  }
  const weaveMap = new T.CanvasTexture(weave);
  weaveMap.colorSpace = T.SRGBColorSpace;
  weaveMap.wrapS = weaveMap.wrapT = T.RepeatWrapping;
  weaveMap.repeat.set(14, 14);
  cloth.map = weaveMap;
  const sphere = new T.SphereGeometry(1, 28, 20);
  const mesh = (parent, geometry, mat, pos, scale = [1, 1, 1]) => {
    const m = new T.Mesh(geometry, mat);
    m.position.set(...pos);
    m.scale.set(...scale);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const ell = (parent, pos, size, mat) => mesh(parent, sphere, mat, pos, size);
  const box = (parent, pos, size, mat) =>
    mesh(parent, new T.BoxGeometry(1, 1, 1), mat, pos, size);
  const stroke = (parent, points, width, mat) =>
    mesh(
      parent,
      new T.TubeGeometry(
        new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p))),
        20,
        width,
        5,
        false,
      ),
      mat,
      [0, 0, 0],
    );

  // A tailored cross-section gives the shoulders, chest and waist their own
  // widths; a circular lathe made the former jacket and shoulders read as toys.
  const rings = [
    [-0.065, 0.184, 0.11],
    [0.0, 0.19, 0.116],
    [0.12, 0.173, 0.111],
    [0.29, 0.205, 0.12],
    [0.39, 0.218, 0.112],
    [0.445, 0.209, 0.096],
    [0.474, 0.169, 0.085],
    [0.496, 0.069, 0.061],
  ];
  const points = [],
    jacketUV = [],
    indices = [],
    segments = 40;
  for (const [y, width, depth] of rings) {
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2,
        c = Math.cos(angle),
        s = Math.sin(angle);
      points.push(
        Math.sign(c) * Math.abs(c) ** 0.64 * width,
        y,
        Math.sign(s) * Math.abs(s) ** 0.8 * depth,
      );
      jacketUV.push(i / segments, (y + 0.065) / 0.561);
    }
  }
  for (let row = 0; row < rings.length - 1; row++) {
    for (let i = 0; i < segments; i++) {
      const a = row * (segments + 1) + i,
        b = a + segments + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const jacket = new T.BufferGeometry();
  jacket.setAttribute("position", new T.Float32BufferAttribute(points, 3));
  jacket.setAttribute("uv", new T.Float32BufferAttribute(jacketUV, 2));
  jacket.setIndex(indices);
  jacket.computeVertexNormals();
  mesh(torso, jacket, cloth, [0, 0, 0]);
  box(torso, [0, 0.012, 0], [0.386, 0.037, 0.242], leather);
  box(torso, [0, 0.012, -0.128], [0.033, 0.026, 0.012], brass);
  mesh(
    torso,
    new T.CylinderGeometry(0.053, 0.061, 0.083, 28),
    skin,
    [0, 0.508, 0.006],
  );
  for (const s of [-1, 1]) {
    const collarShape = new T.Shape();
    collarShape.moveTo(s * 0.012, 0.495);
    collarShape.lineTo(s * 0.069, 0.495);
    collarShape.lineTo(s * 0.105, 0.451);
    collarShape.lineTo(s * 0.047, 0.42);
    collarShape.closePath();
    mesh(
      torso,
      new T.ShapeGeometry(collarShape),
      seam,
      [0, 0, -0.104],
    ).material.side = T.DoubleSide;
    const pocket = box(
      torso,
      [s * 0.128, 0.305, -0.116],
      [0.077, 0.072, 0.008],
      seam,
    );
    pocket.rotation.y = s * -0.1;
    box(torso, [s * 0.128, 0.342, -0.124], [0.084, 0.014, 0.008], cloth);
    stroke(
      torso,
      [
        [s * 0.18, 0.05, -0.07],
        [s * 0.174, 0.19, -0.09],
        [s * 0.194, 0.33, -0.085],
      ],
      0.0013,
      seam,
    );
    const epaulette = box(
      torso,
      [s * 0.18, 0.465, 0],
      [0.082, 0.008, 0.058],
      seam,
    );
    epaulette.rotation.z = s * -0.13;
    ell(torso, [s * 0.149, 0.468, -0.012], [0.004, 0.002, 0.004], brass);
  }
  stroke(
    torso,
    [
      [0, 0.044, -0.119],
      [0, 0.23, -0.122],
      [0, 0.404, -0.113],
    ],
    0.0014,
    seam,
  );
  for (const y of [0.12, 0.2, 0.28, 0.36])
    ell(torso, [0, y, -0.123], [0.004, 0.004, 0.002], brass);
  box(torso, [0.12, 0.403, -0.113], [0.043, 0.074, 0.023], leather);
  for (let i = 0; i < 4; i++)
    box(torso, [0.12, 0.389 + i * 0.009, -0.128], [0.028, 0.002, 0.003], seam);
  box(torso, [0.135, 0.468, -0.11], [0.004, 0.073, 0.004], leather);
  ell(torso, [-0.119, 0.406, -0.12], [0.019, 0.025, 0.003], brass);
  // Original lettering and insignia, rather than a real institution's uniform.
  const tag = document.createElement("canvas");
  tag.width = 256;
  tag.height = 64;
  const tx = tag.getContext("2d");
  tx.fillStyle = "#1b292c";
  tx.fillRect(0, 0, 256, 64);
  tx.fillStyle = "#c3b69a";
  tx.font = "26px monospace";
  tx.fillText("SGT PETRESCU", 13, 42);
  const nameMap = new T.CanvasTexture(tag);
  nameMap.colorSpace = T.SRGBColorSpace;
  mesh(
    torso,
    new T.PlaneGeometry(0.092, 0.023),
    new T.MeshStandardMaterial({ map: nameMap, roughness: 1 }),
    [-0.116, 0.353, -0.127],
  ).rotation.y = Math.PI;

  // The brow ridge, eye sockets, cheeks, nose and chin are a single surface.
  // Facial features use this same surface function, so they cannot float in
  // front of the skin or disappear underneath it when the head is turned.
  const faceZ = (x, y) => {
    const ny = y / 0.143,
      jaw = 1 - 0.18 * Math.max(0, -ny),
      nx = x / (0.101 * jaw),
      nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    let z = -nz * 0.089;
    const front = Math.min(1, nz * 2.5);
    const bridge =
      0.019 * Math.exp(-((x / 0.014) ** 2) - ((y + 0.001) / 0.043) ** 2);
    const tip =
      0.014 * Math.exp(-((x / 0.018) ** 2) - ((y + 0.026) / 0.014) ** 2);
    const cheek =
      0.005 *
      Math.exp(
        -(((Math.abs(x) - 0.052) / 0.026) ** 2) - ((y + 0.018) / 0.03) ** 2,
      );
    const socket =
      0.006 *
      Math.exp(
        -(((Math.abs(x) - 0.034) / 0.024) ** 2) - ((y - 0.024) / 0.016) ** 2,
      );
    const brow =
      0.003 *
      Math.exp(
        -(((Math.abs(x) - 0.033) / 0.026) ** 2) - ((y - 0.044) / 0.013) ** 2,
      );
    const muzzle =
      0.003 * Math.exp(-((x / 0.033) ** 2) - ((y + 0.063) / 0.02) ** 2);
    return z - front * (bridge + tip + cheek + brow + muzzle - socket);
  };
  const faceGeo = new T.SphereGeometry(1, 64, 44),
    positions = faceGeo.attributes.position,
    colors = [];
  for (let i = 0; i < positions.count; i++) {
    const nx = positions.getX(i),
      ny = positions.getY(i),
      nz = positions.getZ(i),
      y = ny * 0.143,
      x = nx * 0.101 * (1 - 0.18 * Math.max(0, -ny));
    positions.setXYZ(i, x, y, nz < 0 ? faceZ(x, y) : nz * 0.089);
    const blush = Math.exp(
        -(((Math.abs(x) - 0.05) / 0.035) ** 2) - ((y + 0.018) / 0.035) ** 2,
      ),
      tone = new T.Color("#bba08b");
    tone.lerp(new T.Color("#b88d7e"), blush * (nz < 0 ? 0.23 : 0));
    colors.push(tone.r, tone.g, tone.b);
  }
  faceGeo.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  faceGeo.computeVertexNormals();
  const faceMaterial = material("#ffffff", 0.8);
  faceMaterial.emissive.set("#453526");
  faceMaterial.emissiveIntensity = 0.1;
  faceMaterial.vertexColors = true;
  mesh(head, faceGeo, faceMaterial, [0, 0, 0]);

  const capGeo = new T.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, 1.74),
    capPos = capGeo.attributes.position;
  for (let i = 0; i < capPos.count; i++) {
    const nx = capPos.getX(i),
      ny = capPos.getY(i),
      nz = capPos.getZ(i);
    const theta = Math.acos(Math.max(-1, Math.min(1, ny))),
      front = Math.max(0, -nz),
      side = Math.abs(nx),
      angle = theta * (1 - 0.35 * front + 0.025 * side);
    const phi = Math.atan2(nz, nx);
    capPos.setXYZ(
      i,
      Math.cos(phi) * Math.sin(angle) * 0.105,
      Math.cos(angle) * 0.148 + 0.008,
      Math.sin(phi) * Math.sin(angle) * 0.095 + 0.006,
    );
  }
  capGeo.computeVertexNormals();
  mesh(head, capGeo, hair, [0, 0, 0]);
  ell(head, [0, 0.005, 0.063], [0.1, 0.112, 0.045], hair);
  ell(head, [0, 0.001, 0.127], [0.042, 0.043, 0.032], hair);
  for (const s of [-1, 1]) {
    ell(head, [s * 0.096, -0.006, 0.002], [0.012, 0.027, 0.016], skin);
    ell(head, [s * 0.101, -0.006, -0.005], [0.003, 0.016, 0.007], lips);
    stroke(
      head,
      [
        [s * 0.068, 0.107, -0.052],
        [s * 0.09, 0.068, -0.036],
        [s * 0.099, 0.018, 0.004],
      ],
      0.002,
      hairLight,
    );
  }
  for (let i = 0; i < 9; i++) {
    const x = -0.076 + i * 0.016;
    const strand = Array.from({ length: 9 }, (_, j) => {
      const t = j / 8,
        sx = x * (1 - t * 0.2),
        z = -0.05 + t * 0.108;
      return [
        sx,
        0.01 +
          0.148 *
            Math.sqrt(
              Math.max(
                0.01,
                1 - (sx / 0.105) ** 2 - ((z - 0.006) / 0.095) ** 2,
              ),
            ),
        z,
      ];
    });
    stroke(head, strand, 0.00065, hairLight);
  }

  const eyes = [],
    ivory = material("#c0bdb0", 0.6),
    iris = material("#4b5449", 0.65),
    pupil = material("#1c2322", 0.45),
    highlight = material("#b6b9ac", 0.35);
  for (const s of [-1, 1]) {
    const x = s * 0.034,
      y = 0.024,
      z = faceZ(x, y) - 0.0018;
    const eye = new T.Group();
    eye.position.set(x, y, z);
    head.add(eye);
    eyes.push(eye);
    ell(eye, [0, 0, 0], [0.016, 0.0052, 0.0031], ivory);
    ell(eye, [0, 0, -0.0024], [0.0048, 0.0048, 0.0016], iris);
    ell(eye, [0, 0, -0.0035], [0.0026, 0.0042, 0.0009], pupil);
    ell(eye, [-0.0014, 0.0018, -0.0044], [0.0009, 0.001, 0.0004], highlight);
    stroke(
      eye,
      [
        [-0.016, -0.0002, 0],
        [-0.007, 0.0054, -0.0013],
        [0.006, 0.0057, -0.0014],
        [0.016, 0, 0],
      ],
      0.0014,
      lips,
    );
    stroke(
      eye,
      [
        [-0.015, -0.0005, 0],
        [0, -0.0051, -0.0018],
        [0.015, 0, 0],
      ],
      0.0009,
      lips,
    );
    const browPoints = [
      [x - 0.018, 0.046, faceZ(x - 0.018, 0.046) - 0.0017],
      [x, 0.05, faceZ(x, 0.05) - 0.0017],
      [x + 0.018, 0.045, faceZ(x + 0.018, 0.045) - 0.0017],
    ];
    stroke(head, browPoints, 0.0022, hair);
    ell(
      head,
      [s * 0.012, -0.035, faceZ(s * 0.012, -0.035) - 0.0008],
      [0.004, 0.0016, 0.0012],
      lips,
    );
  }
  const mouthZ = faceZ(0, -0.064) - 0.002,
    mouth = ell(
      head,
      [0, -0.064, mouthZ],
      [0.022, 0.0015, 0.0018],
      material("#4a3633"),
    );
  const upperLip = stroke(
    head,
    [
      [-0.023, -0.064, mouthZ + 0.001],
      [-0.009, -0.0618, mouthZ - 0.0008],
      [0, -0.063, mouthZ - 0.001],
      [0.009, -0.0618, mouthZ - 0.0008],
      [0.023, -0.064, mouthZ + 0.001],
    ],
    0.0016,
    lips,
  );
  const lowerLip = ell(
    head,
    [0, -0.067, mouthZ - 0.0007],
    [0.019, 0.002, 0.002],
    lips,
  );

  const limbGeo = new T.CylinderGeometry(0.85, 1, 1, 24, 1),
    arms = [];
  const bone = (parent, a, b, r, mat) => {
    const m = mesh(parent, limbGeo, mat, [0, 0, 0]);
    const pose = (start, end) => {
      const d = end.clone().sub(start);
      m.position.copy(start).add(end).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(Y, d.clone().normalize());
      m.scale.set(r, d.length(), r);
    };
    pose(new T.Vector3(...a), new T.Vector3(...b));
    return { mesh: m, pose };
  };
  for (const s of [-1, 1]) {
    bone(root, [s * 0.104, 0.95, 0], [s * 0.111, 0.51, 0.008], 0.077, cloth);
    bone(
      root,
      [s * 0.111, 0.51, 0.008],
      [s * 0.112, 0.12, 0.014],
      0.058,
      cloth,
    );
    ell(root, [s * 0.112, 0.064, -0.045], [0.073, 0.055, 0.139], leather);
    box(root, [s * 0.112, 0.023, -0.043], [0.131, 0.018, 0.24], leather);
    ell(torso, [s * 0.21, 0.44, -0.003], [0.063, 0.026, 0.069], cloth);
    const upper = bone(
        torso,
        [s * 0.216, 0.428, 0],
        [s * 0.265, 0.169, -0.006],
        0.061,
        cloth,
      ),
      lower = bone(
        torso,
        [s * 0.265, 0.169, -0.006],
        [s * 0.132, 0.155, -0.174],
        0.047,
        cloth,
      );
    ell(torso, [s * 0.265, 0.169, -0.006], [0.047, 0.044, 0.045], cloth);
    arms.push({ sign: s, upper, lower });
  }
  const held = new T.Group();
  held.position.set(0, 0.16, -0.176);
  torso.add(held);
  box(held, [0, 0, 0], [0.214, 0.267, 0.022], material("#443f30"));
  box(held, [0, 0.001, -0.013], [0.185, 0.244, 0.003], material("#b5a88b"));
  box(held, [-0.091, 0, -0.015], [0.007, 0.245, 0.002], material("#83765b"));
  for (const y of [-0.074, -0.045, -0.016, 0.013, 0.042, 0.071])
    box(
      held,
      [0.004, y, -0.0155],
      [0.138, 0.0008, 0.0006],
      material("#968b73"),
    );
  for (const s of [-1, 1]) {
    ell(held, [s * 0.132, -0.005, 0.005], [0.026, 0.042, 0.018], skin);
    for (let i = 0; i < 4; i++) {
      const finger = ell(
        held,
        [s * (0.111 + i * 0.007), -0.012 - i * 0.002, -0.015],
        [0.0058, 0.023 - i * 0.0017, 0.007],
        skin,
      );
      finger.rotation.z = s * -0.15;
    }
    const thumb = ell(
      held,
      [s * 0.106, 0.018, -0.021],
      [0.009, 0.018, 0.0075],
      skin,
    );
    thumb.rotation.z = s * 0.4;
  }
  // Collapse fixed details into a few material batches. Eyes, lips, arms and
  // the notebook keep their independent transforms for their actual movement.
  const mergeFixed = (parent, excluded = new Set()) => {
    const batches = new Map();
    for (const child of [...parent.children]) {
      if (!child.isMesh || excluded.has(child)) continue;
      const m = child.material;
      const key = m.map
        ? m.uuid
        : [
            m.color.getHex(),
            m.roughness,
            m.metalness,
            m.side,
            m.vertexColors,
            m.emissive?.getHex(),
            m.emissiveIntensity,
          ].join("/");
      const group = batches.get(key) || { material: m, meshes: [] };
      group.meshes.push(child);
      batches.set(key, group);
    }
    for (const { material: mat, meshes } of batches.values()) {
      if (meshes.length < 2) continue;
      const geometries = meshes.map((m) => {
        m.updateMatrix();
        const geometry = m.geometry.index
          ? m.geometry.toNonIndexed()
          : m.geometry.clone();
        geometry.applyMatrix4(m.matrix);
        if (!geometry.attributes.uv)
          geometry.setAttribute(
            "uv",
            new T.Float32BufferAttribute(
              new Float32Array(geometry.attributes.position.count * 2),
              2,
            ),
          );
        return geometry;
      });
      const geometry = new T.BufferGeometry();
      for (const name of ["position", "normal", "uv"]) {
        const attributes = geometries.map((g) => g.attributes[name]);
        const data = new Float32Array(
          attributes.reduce((sum, a) => sum + a.array.length, 0),
        );
        let offset = 0;
        attributes.forEach((a) => {
          data.set(a.array, offset);
          offset += a.array.length;
        });
        geometry.setAttribute(
          name,
          new T.Float32BufferAttribute(data, attributes[0].itemSize),
        );
      }
      meshes.forEach((m) => parent.remove(m));
      mesh(parent, geometry, mat, [0, 0, 0]);
      geometries.forEach((g) => g.dispose());
    }
  };
  mergeFixed(root);
  mergeFixed(
    torso,
    new Set(arms.flatMap((arm) => [arm.upper.mesh, arm.lower.mesh])),
  );
  mergeFixed(head, new Set([mouth, lowerLip]));
  mergeFixed(held);
  const closedBlink = (t) => {
    const p = (t + 1.65) % 5.4;
    return smooth(p / 0.075) * (1 - smooth((p - 0.075) / 0.13));
  };
  return {
    root,
    head,
    mouth,
    eyes,
    held,
    arms,
    update(time, level = 0, reduced = false) {
      const quiet = reduced ? 0 : 1,
        breath = Math.sin(time * 1.28);
      torso.rotation.set(
        0.004 * breath * quiet,
        Math.sin(time * 0.27) * 0.008 * quiet,
        Math.sin(time * 0.43) * 0.006 * quiet,
      );
      torso.scale.z = 1 + 0.006 * breath * quiet;
      head.rotation.set(
        (Math.sin(time * 0.72) * 0.009 + level * 0.009) * quiet,
        Math.sin(time * 0.37) * 0.036 * quiet,
        Math.sin(time * 0.23) * 0.006 * quiet,
      );
      const blink = closedBlink(time);
      eyes.forEach((eye) => (eye.scale.y = Math.max(0.05, 1 - blink)));
      mouth.scale.y = 0.0015 + Math.min(1, Math.max(0, level)) * 0.007;
      lowerLip.position.y = -0.067 - level * 0.0035;
      held.rotation.x = Math.sin(time * 0.49) * 0.012 * quiet;
      held.rotation.z = Math.sin(time * 0.31) * 0.007 * quiet;
      held.position.y = 0.16 + breath * 0.002 * quiet;
      held.updateMatrix();
      for (const arm of arms) {
        const s = arm.sign,
          wrist = new T.Vector3(s * 0.132, -0.005, 0.005).applyMatrix4(
            held.matrix,
          );
        arm.upper.pose(
          new T.Vector3(s * 0.216, 0.428, 0),
          new T.Vector3(s * 0.265, 0.169, -0.006),
        );
        arm.lower.pose(new T.Vector3(s * 0.265, 0.169, -0.006), wrist);
      }
    },
  };
}
