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

// One original rig is used by both the live character and the rendered film.
// Poses are functions of time, so individual shots can be rendered in any order.
export function createOfficer() {
  const root = new T.Group(),
    torso = new T.Group(),
    head = new T.Group();
  root.name = "Sergeant Petrescu";
  root.position.set(-1.78, 0, -4.84);
  root.rotation.y = 0.55;
  torso.position.y = 1.0;
  root.add(torso);
  head.position.y = 0.69;
  torso.add(head);
  const cloth = material("#243033"),
    seam = material("#142124"),
    skin = material("#a58872", 0.78),
    lips = material("#694d45"),
    hair = material("#282723"),
    leather = material("#151c1d", 0.64),
    brass = material("#a18e66", 0.48, 0.45);
  const sphere = new T.SphereGeometry(1, 24, 18);
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
  const jacket = new T.LatheGeometry(
    [
      [0.178, -0.07],
      [0.195, 0.015],
      [0.181, 0.13],
      [0.204, 0.31],
      [0.222, 0.414],
      [0.174, 0.475],
      [0.075, 0.502],
    ].map((p) => new T.Vector2(...p)),
    32,
  );
  mesh(torso, jacket, cloth, [0, 0, 0], [1, 1, 0.59]);
  box(torso, [0, 0.018, 0], [0.397, 0.042, 0.245], leather);
  box(torso, [0, 0.018, -0.13], [0.04, 0.032, 0.012], brass);
  mesh(
    torso,
    new T.CylinderGeometry(0.055, 0.065, 0.12, 20),
    skin,
    [0, 0.55, 0],
  );
  for (const s of [-1, 1]) {
    const collar = box(
      torso,
      [s * 0.048, 0.486, -0.058],
      [0.065, 0.056, 0.018],
      seam,
    );
    collar.rotation.z = s * 0.45;
    box(torso, [s * 0.13, 0.315, -0.128], [0.075, 0.075, 0.011], seam);
    box(torso, [s * 0.13, 0.355, -0.139], [0.082, 0.012, 0.008], cloth);
  }
  for (const y of [0.16, 0.24, 0.32, 0.4])
    ell(torso, [0, y, -0.132], [0.004, 0.004, 0.003], brass);
  box(torso, [0.125, 0.415, -0.129], [0.045, 0.077, 0.025], leather);
  for (let i = 0; i < 4; i++)
    box(torso, [0.125, 0.399 + i * 0.009, -0.144], [0.029, 0.002, 0.003], seam);
  box(torso, [0.139, 0.482, -0.125], [0.004, 0.073, 0.004], leather);
  ell(torso, [-0.12, 0.414, -0.135], [0.02, 0.027, 0.004], brass);
  // Small original lettering; no borrowed uniform or real institution insignia.
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
    [-0.116, 0.352, -0.145],
  ).rotation.y = Math.PI;

  // Integrate the bridge, nose, cheek and chin into one continuous face surface.
  const faceGeo = new T.SphereGeometry(1, 40, 28),
    positions = faceGeo.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const nx = positions.getX(i),
      ny = positions.getY(i),
      nz = positions.getZ(i);
    const y = ny * 0.137,
      jaw = 1 - 0.25 * Math.max(0, -ny),
      x = nx * 0.098 * jaw;
    let z = nz * 0.086;
    if (nz < 0) {
      const front = Math.min(1, -nz * 2.5);
      const bridge =
        0.022 * Math.exp(-((x / 0.012) ** 2) - ((y + 0.004) / 0.038) ** 2);
      const tip =
        0.012 * Math.exp(-((x / 0.018) ** 2) - ((y + 0.023) / 0.013) ** 2);
      const cheek =
        0.004 *
        Math.exp(
          -(((Math.abs(x) - 0.052) / 0.025) ** 2) - ((y + 0.022) / 0.035) ** 2,
        );
      z -= front * (bridge + tip + cheek);
    }
    positions.setXYZ(i, x, y, z);
  }
  faceGeo.computeVertexNormals();
  mesh(head, faceGeo, skin, [0, 0, 0]);
  const cap = new T.SphereGeometry(1, 32, 18, 0, Math.PI * 2, 0, 1.37);
  mesh(head, cap, hair, [0, 0.029, 0.008], [0.103, 0.119, 0.094]);
  ell(head, [0, 0.012, 0.063], [0.1, 0.112, 0.045], hair);
  ell(head, [0, 0.015, 0.123], [0.04, 0.046, 0.032], hair);
  for (const s of [-1, 1])
    ell(head, [s * 0.094, -0.008, 0.003], [0.012, 0.027, 0.016], skin);
  // Eyelids and pupils share a transform: a blink cannot leave floating pupils.
  const eyes = [];
  for (const s of [-1, 1]) {
    const eye = new T.Group();
    eye.position.set(s * 0.033, 0.025, -0.081);
    head.add(eye);
    eyes.push(eye);
    ell(eye, [0, 0, 0], [0.014, 0.0048, 0.002], material("#a7a697"));
    ell(eye, [0, 0, -0.002], [0.0045, 0.0043, 0.0015], material("#41483a"));
    ell(eye, [0, 0, -0.0035], [0.0021, 0.0032, 0.001], leather);
    const brow = ell(
      head,
      [s * 0.034, 0.041, -0.077],
      [0.019, 0.0022, 0.003],
      hair,
    );
    brow.rotation.z = s * 0.07;
    ell(head, [s * 0.034, 0.018, -0.08], [0.016, 0.0014, 0.0025], lips);
  }
  const mouth = ell(
    head,
    [0, -0.061, -0.078],
    [0.022, 0.0018, 0.0018],
    material("#3e302e"),
  );
  const lowerLip = ell(head, [0, -0.065, -0.079], [0.02, 0.002, 0.002], lips);

  const limbGeo = new T.CylinderGeometry(1, 0.85, 1, 16, 1),
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
    bone(root, [s * 0.105, 0.95, 0], [s * 0.115, 0.51, 0.01], 0.078, cloth);
    bone(root, [s * 0.115, 0.51, 0.01], [s * 0.115, 0.12, 0.015], 0.061, cloth);
    ell(root, [s * 0.115, 0.065, -0.055], [0.078, 0.058, 0.151], leather);
    ell(torso, [s * 0.211, 0.414, 0], [0.075, 0.077, 0.09], cloth);
    const upper = bone(
      torso,
      [s * 0.22, 0.407, 0],
      [s * 0.27, 0.16, -0.01],
      0.065,
      cloth,
    );
    const lower = bone(
      torso,
      [s * 0.27, 0.16, -0.01],
      [s * 0.143, 0.067, -0.17],
      0.051,
      cloth,
    );
    ell(torso, [s * 0.27, 0.16, -0.01], [0.055, 0.052, 0.05], cloth);
    arms.push({ sign: s, upper, lower });
  }
  const held = new T.Group();
  held.position.set(0, 0.074, -0.173);
  torso.add(held);
  box(held, [0, 0, 0], [0.215, 0.236, 0.026], material("#4b4634"));
  box(held, [0, 0.001, -0.015], [0.185, 0.213, 0.003], material("#b5a88b"));
  for (const s of [-1, 1]) {
    ell(held, [s * 0.135, -0.005, 0.002], [0.032, 0.045, 0.02], skin);
    for (let i = 0; i < 4; i++)
      ell(
        held,
        [s * (0.108 + i * 0.012), -0.02, -0.017],
        [0.007, 0.027 - i * 0.002, 0.008],
        skin,
      );
    ell(held, [s * 0.106, 0.024, -0.023], [0.011, 0.019, 0.008], skin);
  }
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
      mouth.scale.y = 0.0018 + Math.min(1, Math.max(0, level)) * 0.008;
      lowerLip.position.y = -0.065 - level * 0.004;
      held.rotation.x = Math.sin(time * 0.49) * 0.012 * quiet;
      held.rotation.z = Math.sin(time * 0.31) * 0.007 * quiet;
      held.position.y = 0.074 + breath * 0.002 * quiet;
      held.updateMatrix();
      for (const arm of arms) {
        const s = arm.sign,
          wrist = new T.Vector3(s * 0.135, -0.005, 0.002).applyMatrix4(
            held.matrix,
          );
        const shoulder = new T.Vector3(s * 0.22, 0.407, 0),
          elbow = new T.Vector3(s * 0.27, 0.16, -0.01);
        arm.upper.pose(shoulder, elbow);
        arm.lower.pose(elbow, wrist);
      }
    },
  };
}
