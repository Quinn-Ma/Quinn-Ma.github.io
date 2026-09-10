/* ============================================================
   3D desk scene (Three.js). Objects on the desk are hotspots:
   hover to highlight, click to fly the camera in and open a
   content panel. Drag to orbit. Esc / "back" returns to overview.
   All copy comes from window.SITE (see content.js).
   ============================================================ */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/RoundedBoxGeometry.js";

const SITE = window.SITE;
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const stage = $("#desk-stage");
const canvas = $("#desk-canvas");
if (!stage || !canvas) throw new Error("desk stage missing");

const lang = () => document.documentElement.lang.startsWith("zh") ? "zh" : "en";
const T = () => SITE[lang()];
const theme = () => document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

/* ---------- palette ---------- */
const PAL = {
  dark:  { bg: 0x070b12, wall: 0x172336, wallLow: 0x121c2a, floor: 0x101824, desk: 0xb29170, deskEdge: 0x765943, hemiSky: 0x9fb8ff, hemiGround: 0x1a1410, keyI: 2.6, fillI: 0.9 },
  light: { bg: 0xf4f7fb, wall: 0xe4ebf4, wallLow: 0xd6dfeb, floor: 0xcfd8e4, desk: 0xd8ba94, deskEdge: 0xa0815e, hemiSky: 0xffffff, hemiGround: 0x9aa4b0, keyI: 2.2, fillI: 1.2 }
};
const C = { white: 0xeef1f5, black: 0x1b1f27, metal: 0x2b3038, cyan: 0x22d3ee, mint: 0x2ee6a6, amber: 0xf5b84b, violet: 0xa78bfa, rose: 0xfb6f92, duck: 0xffd23f, orange: 0xff8a3d, leaf: 0x3fa860, pot: 0xb3543a, paper: 0xf6f3ea, blue: 0x3b82f6 };

/* ---------- renderer / scene ---------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
} catch (e) {
  failGracefully(); throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 40);
const world = new THREE.Group();
scene.add(world);

/* ---------- helpers ---------- */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.62, metalness: 0.06, envMapIntensity: 0.45 }, o));
const ceramic = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: .26, clearcoat: .42, clearcoatRoughness: .22, envMapIntensity: .5, ...o });
const rbox = (w, h, d, r = 0.02, seg = 3) => new RoundedBoxGeometry(w, h, d, seg, r);
function mesh(geo, material, { pos = [0, 0, 0], rot = [0, 0, 0], cast = true, receive = true, parent = world } = {}) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(...pos); m.rotation.set(...rot);
  m.castShadow = cast; m.receiveShadow = receive;
  parent.add(m);
  return m;
}
function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
let running = false, raf = 0, inView = true, visible = !document.hidden, userPaused = false;
const themeMats = [];   // { m, key } materials recolored on theme change
function themed(key, o = {}) { const m = mat(PAL[theme()][key], o); themeMats.push({ m, key }); return m; }

/* ---------- room ---------- */
const floor = mesh(new THREE.PlaneGeometry(40, 40), themed("floor", { roughness: 0.9 }), { pos: [0, -0.78, 8], rot: [-Math.PI / 2, 0, 0], cast: false });
const wall = mesh(new THREE.PlaneGeometry(40, 12), themed("wall", { roughness: 0.95 }), { pos: [0, 5.2, -1.05], cast: false });
const skirting = mesh(new THREE.BoxGeometry(40, 0.12, 0.03), themed("wallLow", { roughness: 0.9 }), { pos: [0, -0.72, -1.03], cast: false });
scene.fog = new THREE.Fog(PAL.dark.bg, 4.5, 11);

/* ---------- lights ---------- */
const hemi = new THREE.HemisphereLight(PAL.dark.hemiSky, PAL.dark.hemiGround, 0.55);
scene.add(hemi);
const key = new THREE.DirectionalLight(0xffe9d4, PAL.dark.keyI);
key.position.set(-2.2, 4.2, 2.8);
key.castShadow = true;
key.shadow.mapSize.set(isTouch ? 1024 : 2048, isTouch ? 1024 : 2048);
key.shadow.camera.near = 0.5; key.shadow.camera.far = 12;
key.shadow.camera.left = -2.6; key.shadow.camera.right = 2.6; key.shadow.camera.top = 2.6; key.shadow.camera.bottom = -2.6;
key.shadow.bias = -0.0006; key.shadow.normalBias = 0.02; key.shadow.radius = 4;
scene.add(key);
const fill = new THREE.DirectionalLight(0xbfd8ff, PAL.dark.fillI);
fill.position.set(3, 2.5, 1.5);
scene.add(fill);
const screenGlow = new THREE.PointLight(0x22d3ee, 1.6, 2.4, 2);
screenGlow.position.set(0, 0.55, -0.15);
scene.add(screenGlow);
const lampLight = new THREE.PointLight(0xffc37a, 3.0, 2.8, 2);
lampLight.position.set(1.3, 0.62, -0.55);
scene.add(lampLight);

/* Soft studio reflections, generated once and reused by every material. */
const environment = new THREE.Scene();
environment.background = new THREE.Color(0x566577);
for (const [pos, size, color, intensity] of [
  [[-3, 4, 2], [4, 4], 0xffead2, 2.2],
  [[3, 2, 1], [2, 3], 0xd9edff, 1.6],
  [[0, 3, -3], [3, 2], 0xf2f7ff, 1.4]
]) {
  const lightPanel = new THREE.Mesh(new THREE.PlaneGeometry(...size), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
  lightPanel.material.color.multiplyScalar(intensity);
  lightPanel.position.set(...pos); lightPanel.lookAt(0, 0, 0); environment.add(lightPanel);
}
const pmrem = new THREE.PMREMGenerator(renderer);
const envTarget = pmrem.fromScene(environment, .04);
scene.environment = envTarget.texture;
pmrem.dispose();
environment.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });

/* ---------- desk ---------- */
const DESK_W = 3.4, DESK_D = 1.62;
const woodTexture = canvasTexture(1024, 512, (g, w, h) => {
  g.fillStyle = '#cdbda7'; g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 2) {
    const noise = (Math.sin(y * 127.1) * 43758.5453) % 1;
    g.strokeStyle = `rgba(70,45,27,${.025 + Math.abs(noise) * .13})`;
    g.lineWidth = .5 + Math.abs(noise);
    g.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const wave = Math.sin(x * .007 + y * .013) * 2.5 + Math.sin(x * .022 + y * .21) * .6;
      if (!x) g.moveTo(x, y + wave); else g.lineTo(x, y + wave);
    }
    g.stroke();
  }
});
const woodBump = woodTexture.clone(); woodBump.colorSpace = THREE.NoColorSpace;
mesh(rbox(DESK_W, 0.075, DESK_D, 0.027, 4), themed("desk", { map: woodTexture, bumpMap: woodBump, bumpScale: .0014, roughness: .47 }), { pos: [0, -.0375, 0] });
mesh(rbox(DESK_W - .03, .014, DESK_D - .025, .018), themed('deskEdge', { roughness: .52 }), { pos: [0, -.078, 0] });
// A thin stitched work mat gives the small peripherals a coherent grouping.
mesh(rbox(1.47, .008, .53, .065, 5), mat(0x273744, { roughness: .97 }), { pos: [.23, .004, .245], cast: false });
const matLine = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.41,.002,.47)), new THREE.LineBasicMaterial({ color: 0x697985, transparent: true, opacity: .32 }));
matLine.position.set(.23,.0085,.245); world.add(matLine);
const legMat = mat(C.metal, { metalness: 0.5, roughness: 0.4 });
for (const sx of [-1, 1]) {
  mesh(new THREE.BoxGeometry(0.06, 0.72, 1.2), legMat, { pos: [sx * (DESK_W / 2 - 0.12), -0.43, 0] });
  mesh(new THREE.BoxGeometry(0.06, 0.04, 1.2), legMat, { pos: [sx * (DESK_W / 2 - 0.12), -0.77, 0], cast: false });
}
mesh(new THREE.BoxGeometry(DESK_W - 0.4, 0.05, 0.05), legMat, { pos: [0, -0.7, -0.5], cast: false });
// drawer block on the right
const drawer = mesh(rbox(0.5, 0.5, 1.1, 0.02), themed("deskEdge", { roughness: 0.6 }), { pos: [1.15, -0.33, 0] });
for (const y of [-0.22, -0.4]) mesh(rbox(0.36, 0.02, 0.02, 0.008), legMat, { pos: [1.15, y, 0.56] });

/* ---------- hotspots registry ---------- */
const hotspots = {};           // key -> { group, meshes, cfg, glow }
const pickMeshes = [];         // flat list for raycasting
function register(key, group, cfg) {
  const meshes = [], cloned = new Map();
  const clone = (m) => {
    if (!m.isMeshStandardMaterial) return m;
    if (!cloned.has(m)) {
      const copy = m.clone();
      copy.userData.baseEmissive = m.emissive.clone();
      copy.userData.baseEmissiveIntensity = m.emissiveIntensity;
      cloned.set(m, copy);
    }
    return cloned.get(m);
  };
  group.traverse((o) => {
    if (!o.isMesh) return;
    o.material = Array.isArray(o.material) ? o.material.map(clone) : clone(o.material);
    o.userData.hotspot = key; meshes.push(o); pickMeshes.push(o);
  });
  group.updateWorldMatrix(true, false);
  cfg.localLook = group.worldToLocal(new THREE.Vector3(...cfg.look));
  group.userData.baseScale = group.scale.clone();
  hotspots[key] = { group, meshes, materials: [...cloned.values()], cfg, glow: 0 };
  return group;
}

/* ---------- monitor (videos) ---------- */
const monitor = new THREE.Group();
monitor.position.set(0, 0, -0.42);
world.add(monitor);
mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.03, 32), legMat, { pos: [0, 0.015, 0.02], parent: monitor });
mesh(rbox(0.07, 0.34, 0.05, 0.01), legMat, { pos: [0, 0.2, -0.02], parent: monitor });
const screenW = 1.24, screenH = 0.72;
const frame = mesh(rbox(screenW + 0.06, screenH + 0.06, 0.045, 0.012), mat(C.black, { roughness: 0.4, metalness: 0.3 }), { pos: [0, 0.62, 0], rot: [-0.06, 0, 0], parent: monitor });
const standbyTex = canvasTexture(1024, 600, (g, w, h) => {
  const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, "#0b1524"); grd.addColorStop(1, "#08111c");
  g.fillStyle = grd; g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgba(34,211,238,.18)"; g.lineWidth = 2;
  for (let x = 0; x < w; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y < h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.fillStyle = "#22d3ee"; g.font = "700 64px 'Space Grotesk', 'Noto Sans SC', sans-serif"; g.textAlign = "center";
  g.fillText("ROBOT DEMOS", w / 2, h / 2 - 10);
  g.fillStyle = "#9aa8bd"; g.font = "500 30px 'JetBrains Mono', monospace";
  g.fillText("loading video…", w / 2, h / 2 + 50);
});
const screenMat = new THREE.MeshBasicMaterial({ map: standbyTex, toneMapped: false });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(screenW, screenH), screenMat);
screen.position.set(0, 0, 0.024); frame.add(screen);
mesh(rbox(0.5, 0.05, 0.03, 0.01), mat(C.metal), { pos: [0, -screenH / 2 - 0.03 + 0.62, 0.0], parent: monitor, cast: false });
register("monitor", monitor, { look: [0, 0.6, -0.42], dir: [0, 0.06, 1], fitW: 1.36, minDist: 0.8, accent: C.cyan });

/* ---------- keyboard + mouse (decor) ---------- */
const kb = new THREE.Group(); kb.position.set(0.12, .008, 0.22); world.add(kb);
mesh(rbox(0.92, 0.03, 0.31, 0.01), mat(C.metal, { roughness: 0.5 }), { pos: [0, 0.015, 0], parent: kb });
{
  const keyGeo = new RoundedBoxGeometry(0.048, 0.014, 0.048, 2, 0.006);
  const keyMat = mat(0xc6cdd5, { roughness: 0.62 });
  const cols = 15, rows = 5;
  const inst = new THREE.InstancedMesh(keyGeo, keyMat, cols * rows + 1);
  const d = new THREE.Object3D(); let i = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (r === 4 && c > 3 && c < 11) continue;
    d.position.set(-0.41 + c * 0.058, 0.035, -0.12 + r * 0.058); d.updateMatrix(); inst.setMatrixAt(i, d.matrix);
    inst.setColorAt(i++, new THREE.Color((c === 0 && r === 0) ? 0x65c9d5 : (c > 12 ? 0x778b9c : 0xe1e6eb)));
  }
  d.position.set(0.02, 0.035, 0.112); d.scale.set(7, 1, 1); d.updateMatrix(); inst.setMatrixAt(i, d.matrix); inst.setColorAt(i++, new THREE.Color(0x8aa0ae));
  inst.count = i; inst.castShadow = true; inst.receiveShadow = true; kb.add(inst);
}
mesh(rbox(0.11, 0.05, 0.17, 0.03, 4), mat(C.metal, { roughness: 0.4, metalness: 0.2 }), { pos: [0.8, 0.036, 0.24] });

mesh(rbox(.012,.014,.033,.005), mat(0x91a7b8, { metalness: .7, roughness: .3 }), { pos: [.8,.062,.205], cast: false });
/* ---------- laptop (projects) ---------- */
const laptop = new THREE.Group();
laptop.position.set(-0.9, 0, -0.09); laptop.rotation.y = 0.45;
world.add(laptop);
const lapBody = mat(0xd9dde3, { roughness: 0.35, metalness: 0.55 });
mesh(rbox(0.64, 0.024, 0.42, 0.012), lapBody, { pos: [0, 0.012, 0], parent: laptop });
mesh(rbox(0.5, 0.004, 0.19, 0.004), mat(C.black, { roughness: 0.7 }), { pos: [0, 0.026, 0.0], parent: laptop, cast: false });
mesh(rbox(0.16, 0.003, 0.1, 0.004), mat(0x9aa2ad, { roughness: 0.4 }), { pos: [0, 0.026, 0.14], parent: laptop, cast: false });
const lid = new THREE.Group(); lid.position.set(0, 0.02, -0.21); lid.rotation.x = -0.2; laptop.add(lid);
mesh(rbox(0.64, 0.42, 0.016, 0.012), lapBody, { pos: [0, 0.21, 0], parent: lid });
const lapTex = canvasTexture(1024, 640, (g, w, h) => {
  g.fillStyle = "#0b1220"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#101a2b"; g.fillRect(0, 0, w, 64);
  g.fillStyle = "#22d3ee"; g.font = "600 30px 'JetBrains Mono', monospace"; g.textAlign = "left";
  g.fillText("~/research  ▸  vla_eval.py", 28, 42);
  const lines = ["Visuotactile world models  ·  imagined RL", "LeRobot × Open-PI  ·  instruction-conditioned VLA", "Isaac Sim benchmark  ·  success / latency / trajectory", "SuperAgent  ·  plan → execute → evaluate → reflect", "Faxingbao  ·  SFT / RLHF / hybrid RAG"];
  g.font = "500 30px 'JetBrains Mono', monospace";
  lines.forEach((l, i) => { g.fillStyle = i % 2 ? "#9aa8bd" : "#e8edf5"; g.fillText("›  " + l, 40, 130 + i * 58); });
  // Study facts from the current manuscript, rather than decorative results.
  g.strokeStyle = "rgba(154,168,189,.35)"; g.strokeRect(60, 450, 900, 150);
  g.fillStyle = "#22d3ee"; g.font = "600 28px 'JetBrains Mono', monospace";
  g.fillText("652,157 parameters  |  160 model-data episodes", 80, 498);
  g.fillStyle = "#e8edf5"; g.font = "500 26px 'JetBrains Mono', monospace";
  g.fillText("680 executions / 40 independent environments", 80, 540);
  g.fillStyle = "#9aa8bd"; g.font = "500 23px 'JetBrains Mono', monospace";
  g.fillText("Simulation + public sensing  |  arXiv:2609.09597", 80, 579);
});
const lapScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.36), new THREE.MeshBasicMaterial({ map: lapTex, toneMapped: false }));
lapScreen.position.set(0, 0.21, 0.009); lid.add(lapScreen);
const laptopKeys = new THREE.InstancedMesh(rbox(.032,.005,.03,.003,2), mat(0x58616e,{roughness:.68}), 48);
const keyDummy = new THREE.Object3D();
for (let i=0;i<48;i++) {
  keyDummy.position.set(-.223+(i%12)*.04,.031,-.072+Math.floor(i/12)*.043);
  keyDummy.updateMatrix(); laptopKeys.setMatrixAt(i,keyDummy.matrix);
}
laptop.add(laptopKeys);
for (const x of [-.23,.23]) mesh(new THREE.CylinderGeometry(.014,.014,.07,16), lapBody, { pos:[x,.026,-.19], rot:[0,0,Math.PI/2], parent:laptop, cast:false });
register("laptop", laptop, { look: [-0.95, 0.2, -0.17], dir: [0.45, 0.42, 0.9], fitW: 0.95, minDist: 0.6, accent: C.violet });

/* ---------- P1 desktop miniature: dual-arm companion robot ---------- */
const arm = new THREE.Group(); arm.position.set(1.0, 0, -.38); arm.rotation.y = -.18; world.add(arm);
const armWhite = ceramic(0xf1eee6,{roughness:.35,clearcoat:.26});
const armDark = mat(0x202831,{roughness:.4,metalness:.22});
const jointMetal = mat(0x81919c,{metalness:.76,roughness:.28});
const rubber = mat(0x131a21,{roughness:.9});
const robotAccent = mat(0x45c7c3,{emissive:0x31c8c7,emissiveIntensity:.48,roughness:.32});
// Rounded mobile base and suspension; the wheels remain visibly separate.
mesh(rbox(.39,.105,.32,.038,5),armDark,{pos:[0,.116,0],parent:arm});
mesh(rbox(.41,.035,.33,.022,4),armWhite,{pos:[0,.18,0],parent:arm});
mesh(rbox(.305,.056,.023,.025,5),armWhite,{pos:[0,.125,.165],parent:arm});
mesh(rbox(.266,.031,.024,.014,4),mat(0x172732,{roughness:.25}),{pos:[0,.126,.178],parent:arm,cast:false});
mesh(new THREE.SphereGeometry(.008,10,8),robotAccent,{pos:[0,.126,.193],parent:arm,cast:false});
for(const side of [-1,1]) for(const z of [-.106,.106]) {
  mesh(new THREE.CylinderGeometry(.091,.091,.07,28),rubber,{pos:[side*.211,.09,z],rot:[0,0,Math.PI/2],parent:arm});
  mesh(new THREE.CylinderGeometry(.068,.068,.006,28),armDark,{pos:[side*.248,.09,z],rot:[0,0,Math.PI/2],parent:arm,cast:false});
  mesh(new THREE.TorusGeometry(.064,.0026,8,32),robotAccent,{pos:[side*.252,.09,z],rot:[0,Math.PI/2,0],parent:arm,cast:false});
  mesh(new THREE.CylinderGeometry(.02,.02,.007,16),jointMetal,{pos:[side*.253,.09,z],rot:[0,0,Math.PI/2],parent:arm,cast:false});
}
// Narrow support widens into the characteristic white tapered chest.
mesh(rbox(.135,.22,.13,.027,4),armDark,{pos:[0,.302,-.018],parent:arm});
mesh(rbox(.102,.21,.022,.018,4),armWhite,{pos:[0,.313,.051],rot:[-.08,0,0],parent:arm});
mesh(rbox(.008,.077,.006,.003),robotAccent,{pos:[0,.31,.065],rot:[-.08,0,0],parent:arm,cast:false});
const chestGeo=rbox(.285,.294,.16,.04,5);
const chestPos=chestGeo.attributes.position;
for(let i=0;i<chestPos.count;i++) {
  const taper=.66+.34*((chestPos.getY(i)+.147)/.294);
  chestPos.setX(i,chestPos.getX(i)*taper);
}
chestGeo.computeVertexNormals();
mesh(chestGeo,armWhite,{pos:[0,.501,0],parent:arm});
const chestTexture=canvasTexture(512,384,(g,w,h)=>{
  g.fillStyle='#f1eee6';g.fillRect(0,0,w,h);
  g.strokeStyle='#268f8d';g.lineWidth=9;
  g.beginPath();g.ellipse(w/2-13,160,24,14,-.7,0,Math.PI*2);g.stroke();
  g.beginPath();g.ellipse(w/2+13,148,24,14,-.7,0,Math.PI*2);g.stroke();
  g.fillStyle='#29373c';g.font='600 34px sans-serif';g.textAlign='center';g.fillText('ORIGINX',w/2,218);
});
mesh(new THREE.PlaneGeometry(.124,.093),mat(0xffffff,{map:chestTexture,roughness:.7}),{pos:[0,.531,.081],parent:arm,cast:false});
// Neck, rounded display head, and the slim raised binocular sensor.
mesh(new THREE.CylinderGeometry(.038,.039,.091,20),armDark,{pos:[0,.676,-.018],parent:arm});
const robotHead=new THREE.Group();robotHead.position.set(0,.782,-.005);robotHead.rotation.z=-.06;arm.add(robotHead);
mesh(rbox(.325,.238,.115,.05,6),armWhite,{parent:robotHead});
mesh(rbox(.295,.21,.021,.043,6),armDark,{pos:[0,0,.061],parent:robotHead});
const faceTexture=canvasTexture(640,448,(g,w,h)=>{
  g.fillStyle='#0a1820';g.fillRect(0,0,w,h);
  const glow=g.createRadialGradient(w/2,h/2,15,w/2,h/2,w/2);glow.addColorStop(0,'#123039');glow.addColorStop(1,'#0a1820');g.fillStyle=glow;g.fillRect(0,0,w,h);
  g.strokeStyle='#64eeec';g.lineWidth=19;g.lineCap='round';g.shadowColor='#32dedd';g.shadowBlur=15;
  for(const x of [205,435]) {g.beginPath();g.ellipse(x,228,34,43,0,Math.PI,Math.PI*2);g.stroke();}
  g.lineWidth=12;g.beginPath();g.arc(320,263,28,.18,Math.PI-.18);g.stroke();
});
mesh(new THREE.PlaneGeometry(.255,.163),new THREE.MeshBasicMaterial({map:faceTexture,toneMapped:false}),{pos:[0,0,.073],parent:robotHead,cast:false});
for(const side of [-1,1]) mesh(rbox(.009,.09,.045,.004),jointMetal,{pos:[side*.162,-.003,.003],parent:robotHead,cast:false});
mesh(rbox(.038,.073,.03,.01),armDark,{pos:[0,.148,-.02],parent:robotHead});
mesh(rbox(.179,.045,.052,.02,5),armDark,{pos:[0,.194,-.006],parent:robotHead});
for(const x of [-.056,.056]) {
  mesh(new THREE.CylinderGeometry(.011,.011,.004,16),jointMetal,{pos:[x,.194,.021],rot:[Math.PI/2,0,0],parent:robotHead,cast:false});
  mesh(new THREE.SphereGeometry(.006,10,8),mat(0x133c50,{metalness:.7,roughness:.15}),{pos:[x,.194,.025],parent:robotHead,cast:false});
}
// Two articulated arms and compact three-finger grippers.
const robotArms=[];
for(const side of [-1,1]) {
  const shoulder=new THREE.Group();shoulder.position.set(side*.185,.604,0);shoulder.rotation.z=side*.22;arm.add(shoulder);
  mesh(new THREE.SphereGeometry(.064,24,18),armWhite,{parent:shoulder});
  mesh(new THREE.CylinderGeometry(.051,.051,.016,24),armDark,{pos:[0,0,.055],rot:[Math.PI/2,0,0],parent:shoulder,cast:false});
  mesh(new THREE.CapsuleGeometry(.037,.112,5,16),armDark,{pos:[0,-.091,0],parent:shoulder});
  mesh(rbox(.077,.075,.079,.025,4),armWhite,{pos:[0,-.078,0],parent:shoulder});
  const elbow=new THREE.Group();elbow.position.set(0,-.191,0);elbow.rotation.x=-.23;shoulder.add(elbow);
  mesh(new THREE.SphereGeometry(.045,20,14),armDark,{parent:elbow});
  mesh(new THREE.CylinderGeometry(.032,.032,.009,20),jointMetal,{pos:[0,0,.04],rot:[Math.PI/2,0,0],parent:elbow,cast:false});
  mesh(new THREE.CapsuleGeometry(.041,.102,6,20),armWhite,{pos:[0,-.096,0],parent:elbow});
  mesh(new THREE.CylinderGeometry(.033,.033,.035,20),armDark,{pos:[0,-.179,0],parent:elbow});
  mesh(new THREE.TorusGeometry(.034,.0027,8,28),robotAccent,{pos:[0,-.169,0],rot:[Math.PI/2,0,0],parent:elbow,cast:false});
  const hand=new THREE.Group();hand.position.set(0,-.218,0);elbow.add(hand);
  mesh(rbox(.052,.043,.034,.01),armDark,{parent:hand});
  for(const x of [-.021,.021]) {
    const finger=new THREE.Group();finger.position.set(x,-.014,.003);finger.rotation.z=-Math.sign(x)*.16;hand.add(finger);
    mesh(rbox(.012,.039,.015,.004),armDark,{pos:[0,-.016,0],parent:finger});
    mesh(rbox(.012,.023,.012,.004),jointMetal,{pos:[0,-.044,.005],rot:[-.4,0,0],parent:finger,cast:false});
  }
  mesh(rbox(.013,.038,.014,.005),armDark,{pos:[side*.036,-.008,.02],rot:[0,0,side*.6],parent:hand});
  robotArms.push({shoulder,elbow,hand,side});
}
register("arm",arm,{look:[1.0,.50,-.38],dir:[-.22,.25,1],fitW:.88,minDist:.76,accent:C.cyan});

/* ---------- MicroDuck: cyan biped with camera eyes and orange bill ---------- */
const duck = new THREE.Group(); duck.position.set(1.03,0,.47); duck.rotation.y=-.65; world.add(duck);
const duckShell=ceramic(0x9bdbe0,{roughness:.34,clearcoat:.22});
const duckPanel=mat(0xbac7c7,{roughness:.57,metalness:.16});
const duckOrange=ceramic(0xf48228,{roughness:.38});
const duckYellow=mat(0xf6bd25,{roughness:.42});
const duckFrame=mat(0x20282b,{roughness:.5,metalness:.38});
const duckScrew=mat(0x9ca9a9,{roughness:.3,metalness:.8});
// Low, two-legged chassis. Broad feet preserve the prototype's silhouette.
mesh(rbox(.17,.07,.11,.018,4),duckFrame,{pos:[0,.208,0],parent:duck});
const duckLegs=[];
for(const side of [-1,1]) {
  const leg=new THREE.Group();leg.position.set(side*.069,.183,0);duck.add(leg);
  mesh(new THREE.CylinderGeometry(.034,.034,.035,20),duckScrew,{pos:[side*.015,0,0],rot:[0,0,Math.PI/2],parent:leg});
  mesh(rbox(.046,.067,.049,.008),duckFrame,{pos:[0,-.034,0],rot:[-.17,0,0],parent:leg});
  mesh(new THREE.CylinderGeometry(.026,.026,.05,20),duckScrew,{pos:[0,-.071,.009],rot:[0,0,Math.PI/2],parent:leg});
  mesh(rbox(.043,.067,.045,.006),duckFrame,{pos:[0,-.102,.018],rot:[.11,0,0],parent:leg});
  for(const z of [-.012,.033]) mesh(rbox(.006,.069,.009,.001),duckScrew,{pos:[side*.025,-.105,z],parent:leg,cast:false});
  mesh(rbox(.1,.017,.125,.019,4),duckYellow,{pos:[0,-.173,.026],parent:leg});
  mesh(rbox(.103,.027,.124,.018,4),duckOrange,{pos:[0,-.154,.026],parent:leg});
  mesh(rbox(.053,.045,.053,.009),duckOrange,{pos:[0,-.13,-.009],parent:leg});
  for(const x of [-.016,.016]) mesh(new THREE.SphereGeometry(.0035,8,6),duckFrame,{pos:[x,-.122,.02],parent:leg,cast:false});
  duckLegs.push(leg);
}
// Cyan torso with exposed servo blocks and a small side wing on each hip.
mesh(rbox(.176,.085,.132,.03,5),duckShell,{pos:[0,.282,.018],parent:duck});
mesh(rbox(.14,.027,.092,.009),duckFrame,{pos:[0,.232,0],parent:duck});
for(const side of [-1,1]) {
  const wing=mesh(rbox(.018,.098,.073,.014,4),duckShell,{pos:[side*.123,.214,.003],rot:[-.18,0,side*-.42],parent:duck});
  for(const y of [-.027,.027]) mesh(new THREE.CylinderGeometry(.004,.004,.02,8),duckScrew,{pos:[side*.002,y,.016],rot:[0,0,Math.PI/2],parent:wing,cast:false});
  mesh(new THREE.CylinderGeometry(.026,.026,.018,16),duckScrew,{pos:[side*.092,.252,0],rot:[0,0,Math.PI/2],parent:duck,cast:false});
}
// Mechanical neck: stacked servos, bearing caps and a curved exposed cable.
mesh(rbox(.042,.13,.047,.005),duckFrame,{pos:[0,.385,-.029],parent:duck});
for(const y of [.339,.389,.438]) {
  mesh(rbox(.058,.026,.053,.005),duckFrame,{pos:[0,y,-.029],parent:duck});
  mesh(new THREE.CylinderGeometry(.016,.016,.065,18),duckScrew,{pos:[0,y,-.029],rot:[0,0,Math.PI/2],parent:duck,cast:false});
}
const neckCable=new THREE.CatmullRomCurve3([new THREE.Vector3(.027,.32,-.039),new THREE.Vector3(.041,.375,-.092),new THREE.Vector3(.038,.443,-.071)]);
mesh(new THREE.TubeGeometry(neckCable,16,.003,6,false),duckFrame,{parent:duck,cast:false});
// Extruded side profile: domed cyan shell, grey cheek and a flat orange bill.
const duckHead=new THREE.Group();duckHead.position.set(0,.485,-.005);duckHead.rotation.x=-.13;duck.add(duckHead);
function duckHeadProfile(thickness,inset=0) {
  const shape=new THREE.Shape();
  shape.moveTo(-.135,-.069);shape.lineTo(.143,-.069);
  shape.quadraticCurveTo(.18,-.05,.148,.012);
  shape.quadraticCurveTo(.085,.136,-.025,.142);
  shape.quadraticCurveTo(-.16,.145,-.158,-.015);
  shape.quadraticCurveTo(-.157,-.056,-.135,-.069);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:3,steps:1,curveSegments:16});
  const a=geo.attributes.position;
  for(let i=0;i<a.count;i++){const z=a.getX(i),y=a.getY(i),x=thickness/2-a.getZ(i);a.setXYZ(i,x,y,z);}
  geo.computeVertexNormals();return geo;
}
mesh(duckHeadProfile(.174),duckShell,{parent:duckHead});
for(const side of [-1,1]) {
  const cheek=mesh(duckHeadProfile(.006),duckPanel,{pos:[side*.091,0,0],parent:duckHead,cast:false});
  cheek.scale.set(1,.91,.91);
  mesh(new THREE.CylinderGeometry(.046,.046,.014,32),duckYellow,{pos:[side*.105,.027,-.018],rot:[0,0,Math.PI/2],parent:duckHead});
  mesh(new THREE.CylinderGeometry(.022,.025,.019,28),duckFrame,{pos:[side*.119,.027,-.018],rot:[0,0,Math.PI/2],parent:duckHead,cast:false});
  mesh(new THREE.CylinderGeometry(.011,.012,.021,24),mat(0x10282d,{metalness:.65,roughness:.12}),{pos:[side*.122,.027,-.018],rot:[0,0,Math.PI/2],parent:duckHead,cast:false});
  mesh(new THREE.SphereGeometry(.003,8,6),mat(0xc3e5e6),{pos:[side*.134,.032,-.013],parent:duckHead,cast:false});
  mesh(rbox(.013,.012,.022,.005),duckFrame,{pos:[side*.102,-.007,-.069],rot:[.35,0,0],parent:duckHead,cast:false});
}
// The bill wraps the lower edge and extends forwards, as on the reference.
mesh(rbox(.211,.035,.327,.012,5),duckOrange,{pos:[0,-.071,.015],parent:duckHead});
mesh(rbox(.217,.028,.068,.012,5),duckOrange,{pos:[0,-.055,.177],rot:[-.08,0,0],parent:duckHead});
mesh(rbox(.202,.007,.31,.003),mat(0xc95d22,{roughness:.58}),{pos:[0,-.091,.019],parent:duckHead,cast:false});
for(const side of [-1,1]) mesh(rbox(.014,.044,.025,.007),duckOrange,{pos:[side*.094,-.024,.18],rot:[-.25,0,0],parent:duckHead,cast:false});
register("duck",duck,{look:[1.03,.335,.47],dir:[-.8,.35,1],fitW:.69,minDist:.52,accent:C.mint});

/* ---------- notebook / résumé (experience) ---------- */
const notebook = new THREE.Group(); notebook.position.set(-0.76, 0, 0.51); notebook.rotation.y = -0.15; world.add(notebook);
const coverTex = canvasTexture(512, 700, (g, w, h) => {
  g.fillStyle = "#0f1622"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#22d3ee"; g.fillRect(0, 0, 26, h);
  g.fillStyle = "#e8edf5"; g.textAlign = "left";
  g.font = "700 64px 'Space Grotesk', 'Noto Sans SC', sans-serif"; g.fillText("RESUME", 70, 130);
  g.font = "500 44px 'Noto Sans SC', sans-serif"; g.fillText("马沁桢 · Qinzhen Ma", 70, 200);
  g.fillStyle = "#9aa8bd"; g.font = "500 28px 'JetBrains Mono', monospace";
  ["Lightwheel · Embodied AI Lead", "Baidu · LLM 0→1", "Rice · Kavraki / RobotΠ Lab"].forEach((l, i) => g.fillText(l, 70, 290 + i * 52));
  g.strokeStyle = "rgba(34,211,238,.4)"; g.lineWidth = 3; g.strokeRect(48, 470, w - 100, 160);
  g.fillStyle = "#2ee6a6"; g.font = "600 30px 'JetBrains Mono', monospace"; g.fillText("EXPERIENCE  ▸", 70, 560);
});
const nbMats = [mat(0x0f1622, { roughness: 0.7 }), mat(0x0f1622), mat(0xffffff, { map: coverTex, roughness: 0.8 }), mat(C.paper, { roughness: 0.9 }), mat(0x0f1622), mat(0x0f1622)];
const nb = mesh(new THREE.BoxGeometry(0.34, 0.032, 0.46), nbMats, { pos: [0, 0.016, 0], parent: notebook });
mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.16, 12), mat(C.metal, { metalness: 0.6, roughness: 0.3 }), { pos: [0.23, 0.007, 0.05], rot: [Math.PI / 2, 0, 0.3], parent: notebook });
mesh(new THREE.ConeGeometry(0.007, 0.02, 12), mat(C.black), { pos: [0.203, 0.007, 0.132], rot: [Math.PI / 2, 0, 0.3], parent: notebook, cast: false });
mesh(rbox(.315,.02,.433,.004),mat(C.paper,{roughness:.95}),{pos:[.005,.017,.007],parent:notebook,cast:false});
mesh(new THREE.BoxGeometry(.34,.006,.46),nbMats,{pos:[0,.033,0],parent:notebook,cast:false});
mesh(rbox(.014,.002,.43,.003),mat(0x9c8a66,{roughness:.8}),{pos:[.105,.037,0],parent:notebook,cast:false});
register("notebook", notebook, { look: [-0.76, 0.03, 0.51], dir: [0.12, 1.15, 0.7], fitW: 0.62, minDist: 0.5, accent: C.amber });

/* ---------- phone (contact) ---------- */
const phone = new THREE.Group(); phone.position.set(0.5, 0, 0.55); phone.rotation.y = 0.25; world.add(phone);
mesh(rbox(0.092, 0.012, 0.19, 0.008), mat(C.black, { roughness: 0.35, metalness: 0.4 }), { pos: [0, 0.006, 0], parent: phone });
const phoneTex = canvasTexture(256, 512, (g, w, h) => {
  const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, "#1d2b44"); grd.addColorStop(1, "#0b1220");
  g.fillStyle = grd; g.fillRect(0, 0, w, h);
  g.fillStyle = "#e8edf5"; g.textAlign = "center"; g.font = "700 60px 'Space Grotesk', sans-serif"; g.fillText("10:24", w / 2, 110);
  g.fillStyle = "#9aa8bd"; g.font = "500 22px 'JetBrains Mono', monospace"; g.fillText("qm18@rice.edu", w / 2, 150);
  const cols = ["#22d3ee", "#2ee6a6", "#f5b84b", "#a78bfa", "#fb6f92", "#3b82f6", "#22d3ee", "#2ee6a6"];
  cols.forEach((c, i) => { g.fillStyle = c; const x = 36 + (i % 4) * 52, y = 220 + Math.floor(i / 4) * 64; g.beginPath(); g.roundRect(x, y, 40, 40, 10); g.fill(); });
  g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.roundRect(24, 400, w - 48, 70, 18); g.fill();
});
const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.082, 0.178), new THREE.MeshBasicMaterial({ map: phoneTex, toneMapped: false }));
phoneScreen.rotation.x = -Math.PI / 2; phoneScreen.position.set(0, 0.0125, 0); phone.add(phoneScreen);
register("phone", phone, { look: [0.5, 0.01, 0.55], dir: [0.05, 1.25, 0.55], fitW: 0.3, minDist: 0.3, accent: C.rose });

/* ---------- books + graduation cap (education) ---------- */
const books = new THREE.Group(); books.position.set(-1.42, 0, .29); books.rotation.y = .15; world.add(books);
const paperMat = mat(0xe8e1d2,{roughness:.94});
for (let i=0;i<3;i++) {
  const b = new THREE.Group(); b.position.y = i*.061; b.rotation.y = (i-1)*.12; books.add(b);
  const coverMat=mat([0x355568,0xd6a564,0x467565][i],{roughness:.7});
  mesh(rbox(.30,.047,.225,.003),paperMat,{pos:[.006,.03,0],parent:b,cast:false});
  for(const y of [.004,.057]) mesh(rbox(.325,.008,.245,.004),coverMat,{pos:[0,y,0],parent:b,cast:false});
  mesh(rbox(.017,.055,.245,.004),coverMat,{pos:[-.158,.031,0],parent:b});
  for(let j=0;j<4;j++) mesh(new THREE.BoxGeometry(.293,.001,.001),mat(0xb9b1a3,{roughness:1}),{pos:[.008,.015+j*.01,.113],parent:b,cast:false});
}
const cap = new THREE.Group(); cap.position.set(0, .184, 0); books.add(cap);
mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.06, 24), mat(C.black, { roughness: 0.6 }), { pos: [0, 0.03, 0], parent: cap });
mesh(rbox(0.3, 0.014, 0.3, 0.004), mat(C.black, { roughness: 0.6 }), { pos: [0, 0.067, 0], rot: [0, 0.35, 0], parent: cap });
mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.16, 8), mat(C.amber), { pos: [0.12, 0.0, 0.1], rot: [0.2, 0, 0.15], parent: cap, cast: false });
mesh(new THREE.SphereGeometry(0.012, 10, 8), mat(C.amber), { pos: [0.135, -0.075, 0.115], parent: cap, cast: false });
register("books", books, { look: [-1.42, 0.16, .29], dir: [-0.3, 0.7, 1], fitW: 0.7, minDist: 0.55, accent: C.blue });

/* ---------- decor: mug, plant, lamp, sticky notes, wall posters ---------- */
const mug = new THREE.Group(); mug.position.set(0.74, 0, -0.06); world.add(mug);
const mugCeramic = ceramic(0xf3e8d8);
mesh(new THREE.CylinderGeometry(.052,.046,.11,32,1,true),mugCeramic,{pos:[0,.058,0],parent:mug});
mesh(new THREE.CylinderGeometry(.045,.040,.09,32,1,true),ceramic(0xdbd1c1,{side:THREE.BackSide}),{pos:[0,.062,0],parent:mug,cast:false});
mesh(new THREE.TorusGeometry(.049,.0035,10,40),mugCeramic,{pos:[0,.113,0],rot:[Math.PI/2,0,0],parent:mug,cast:false});
mesh(new THREE.CylinderGeometry(.068,.068,.006,32),mat(0x9c7c59,{roughness:.9}),{pos:[0,.003,0],parent:mug,cast:false});
mesh(new THREE.CylinderGeometry(0.043, 0.043, 0.004, 24), mat(0x3b2a1e, { roughness: 0.3 }), { pos: [0, 0.094, 0], parent: mug, cast: false });
mesh(new THREE.TorusGeometry(0.03, 0.008, 10, 24, Math.PI), mugCeramic, { pos: [0.05, 0.06, 0], rot: [0, 0, -Math.PI / 2], parent: mug });

const plant = new THREE.Group(); plant.position.set(-1.45, 0, -0.5); world.add(plant);
mesh(new THREE.CylinderGeometry(0.1, 0.075, 0.17, 24), ceramic(0xd3d2c6,{roughness:.42}), { pos: [0, 0.085, 0], parent: plant });
mesh(new THREE.CylinderGeometry(0.092, 0.092, 0.012, 24), mat(0x3a2a1c, { roughness: 1 }), { pos: [0, 0.17, 0], parent: plant, cast: false });
for (let j=0;j<5;j++) mesh(new THREE.TorusGeometry(.079+j*.004,.002,6,32),ceramic(0xc5c4b8),{pos:[0,.035+j*.027,0],rot:[Math.PI/2,0,0],parent:plant,cast:false});
for (let i = 0; i < 9; i++) {
  const a = (i / 9) * Math.PI * 2, r = 0.05 + (i % 3) * 0.03;
  const leaf = mesh(new THREE.SphereGeometry(0.06, 14, 10), mat([0x3a7550,0x568d55,0x759c62][i%3], { roughness: .53 }), { pos: [Math.cos(a) * r, 0.24 + (i % 2) * 0.05, Math.sin(a) * r], parent: plant });
  leaf.scale.set(1, 1.6 + (i % 3) * 0.3, 0.55); leaf.rotation.set(Math.cos(a) * 0.5, a, Math.sin(a) * 0.5);
}

const lamp = new THREE.Group(); lamp.position.set(1.48, 0, -0.58); world.add(lamp);
mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.02, 24), armDark, { pos: [0, 0.01, 0], parent: lamp });
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 10), armDark, { pos: [0, 0.22, 0], parent: lamp });
mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.38, 10), armDark, { pos: [-0.1, 0.55, 0.05], rot: [0, 0, 0.9], parent: lamp });
for(const pos of [[0,.42,0],[-.25,.65,.08]]) mesh(new THREE.CylinderGeometry(.027,.027,.03,20),mat(0xba996a,{metalness:.7,roughness:.3}),{pos,rot:[Math.PI/2,0,0],parent:lamp,cast:false});
const lampHead = mesh(new THREE.ConeGeometry(0.1, 0.13, 24, 1, true), mat(C.metal, { side: THREE.DoubleSide, metalness: 0.4, roughness: 0.4 }), { pos: [-0.25, 0.64, 0.09], rot: [0.5, 0, 0.55], parent: lamp });
mesh(new THREE.SphereGeometry(0.035, 12, 10), mat(0xffe3b0, { emissive: 0xffc37a, emissiveIntensity: 2.2 }), { pos: [-0.27, 0.6, 0.1], parent: lamp, cast: false });
lampLight.position.set(1.48 - 0.27, 0.58, -0.58 + 0.1);

const noteMat = (c) => mat(c, { roughness: 0.9 });
mesh(rbox(0.13, 0.004, 0.13, 0.002), noteMat(0xfff176), { pos: [-0.32, 0.002, -0.42], rot: [0, 0.3, 0], cast: false });
mesh(rbox(0.13, 0.004, 0.13, 0.002), noteMat(0x7ff0c8), { pos: [-0.2, 0.002, -0.55], rot: [0, -0.2, 0], cast: false });

function poster(x, y, w, h, draw) {
  const tex = canvasTexture(Math.round(w * 800), Math.round(h * 800), draw);
  mesh(rbox(w + 0.04, h + 0.04, 0.025, 0.006), mat(C.black, { roughness: 0.5 }), { pos: [x, y, -1.03], cast: false });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 }));
  p.position.set(x, y, -1.016); p.receiveShadow = true; world.add(p);
}
poster(1.05, 1.15, 0.9, 0.6, (g, w, h) => {
  g.fillStyle = "#0f1622"; g.fillRect(0, 0, w, h);
  g.strokeStyle = "#22d3ee"; g.lineWidth = 6; g.beginPath(); g.arc(w / 2, h / 2 + 10, 150, 0, Math.PI * 2); g.stroke();
  g.setLineDash([10, 16]); g.strokeStyle = "#2ee6a6"; g.beginPath(); g.arc(w / 2, h / 2 + 10, 122, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
  g.fillStyle = "#e8edf5"; g.textAlign = "center"; g.font = "700 40px 'Space Grotesk', sans-serif";
  [["DATA", 0], ["TRAIN", 1], ["EVAL", 2], ["DEPLOY", 3]].forEach(([t, i]) => { const a = -Math.PI / 2 + i * Math.PI / 2; g.fillStyle = "#0f1622"; g.beginPath(); g.roundRect(w / 2 + Math.cos(a) * 150 - 80, h / 2 + 10 + Math.sin(a) * 150 - 26, 160, 52, 12); g.fill(); g.strokeStyle = "#22d3ee"; g.lineWidth = 3; g.stroke(); g.fillStyle = "#e8edf5"; g.fillText(t, w / 2 + Math.cos(a) * 150, h / 2 + 24 + Math.sin(a) * 150); });
  g.fillStyle = "#22d3ee"; g.font = "600 26px 'JetBrains Mono', monospace"; g.fillText("CLOSED LOOP", w / 2, h / 2 + 20);
});
poster(-1.05, 1.2, 0.7, 0.5, (g, w, h) => {
  g.fillStyle = "#10261f"; g.fillRect(0, 0, w, h);
  g.strokeStyle = "#2ee6a6"; g.lineWidth = 5; g.beginPath(); g.arc(w / 2, 150, 70, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.arc(w / 2, 150, 22, 0, Math.PI * 2); g.fillStyle = "#2ee6a6"; g.fill();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.beginPath(); g.moveTo(w / 2 + Math.cos(a) * 30, 150 + Math.sin(a) * 30); g.lineTo(w / 2 + Math.cos(a) * 60, 150 + Math.sin(a) * 60); g.stroke(); }
  g.fillStyle = "#e8edf5"; g.textAlign = "center"; g.font = "700 62px 'Space Grotesk', sans-serif"; g.fillText("OriginX", w / 2, 300);
  g.fillStyle = "#2ee6a6"; g.font = "500 26px 'JetBrains Mono', monospace"; g.fillText("PHYSICAL AI FOR THE HOME", w / 2, 345);
});

/* ---------- videos on the monitor ---------- */
const videoEls = {}, videoTex = {};
const videoHost = $("#desk-videos");
let activeVideo = null;
function buildVideos() {
  for (const v of SITE.videos) {
    const el = document.createElement("video");
    el.muted = true; el.loop = true; el.playsInline = true; el.setAttribute("playsinline", ""); el.crossOrigin = "anonymous";
    el.preload = v.id === SITE.defaultVideo ? "auto" : "metadata";
    el.src = v.file; el.poster = v.poster || "";
    videoHost.appendChild(el);
    videoEls[v.id] = el;
    const tex = new THREE.VideoTexture(el);
    tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter; tex.generateMipmaps = false;
    videoTex[v.id] = tex;
  }
}
function setVideo(id, play = true) {
  if (!videoEls[id]) return;
  if (activeVideo && activeVideo !== id) { videoEls[activeVideo].pause(); }
  activeVideo = id;
  const el = videoEls[id];
  const swap = () => { if (activeVideo !== id) return; screenMat.map = videoTex[id]; screenMat.needsUpdate = true; };
  if (el.readyState >= 2) swap(); else el.addEventListener("loadeddata", swap, { once: true });
  if (play && running) el.play().catch(() => { /* autoplay blocked; retried on user gesture */ });
  updatePanelVideoState();
}
function pauseVideos() { Object.values(videoEls).forEach((v) => v.pause()); }
function resumeVideo() { if (activeVideo && running && !userPaused) videoEls[activeVideo].play().catch(() => {}); }
buildVideos();
setVideo(SITE.defaultVideo, true);

/* ---------- camera control ---------- */
const OVERVIEW_TARGET = new THREE.Vector3(0, 0.32, -0.12);
const overviewTarget = new THREE.Vector3();
const cam = {
  mode: "overview", focusKey: null,
  pos: new THREE.Vector3(0, 1.6, 2.3), look: OVERVIEW_TARGET.clone(),
  wantPos: new THREE.Vector3(), wantLook: new THREE.Vector3(),
  az: 0, pol: 1.02, radius: 2.6, dragAz: 0, dragPol: 0, par: { x: 0, y: 0 }
};
function viewport() { const w = stage.clientWidth || 1, h = stage.clientHeight || 1; return { w, h, aspect: w / h, narrow: w < 760 }; }
function hFovHalfTan() { return Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect; }
function overviewSpherical() {
  const { aspect, narrow } = viewport();
  camera.fov = aspect < 1 ? 48 : 43; camera.updateProjectionMatrix();
  const halfV = Math.tan(THREE.MathUtils.degToRad(camera.fov)/2);
  // Reserve the top label and lower object dock, leaving the desk fully in view.
  cam.radius = Math.max(3.25, 1.95 / (halfV * aspect), 1.45 / (halfV * .72));
  cam.polBase = .96;
  cam.narrow = narrow;
  overviewTarget.copy(OVERVIEW_TARGET);
  overviewTarget.y = .25;
  stage.classList.toggle('is-compact',narrow);
}
function overviewPose(out) {
  const az = cam.az + cam.dragAz + (reduced || idlePaused ? 0 : cam.par.x * 0.12) + (reduced || idlePaused ? 0 : Math.sin(clock.t * 0.25) * 0.02);
  const pol = clamp(cam.polBase + cam.dragPol - (reduced || idlePaused ? 0 : cam.par.y * 0.06), 0.62, 1.32);
  const r = cam.radius;
  out.pos.set(Math.sin(az) * Math.sin(pol) * r, Math.cos(pol) * r, Math.cos(az) * Math.sin(pol) * r).add(overviewTarget);
  out.pos.y += reduced || idlePaused ? 0 : Math.sin(clock.t * 0.5) * 0.015;
  out.look.copy(overviewTarget);
}
const _tmp = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
const _dir = new THREE.Vector3(), _right = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
function focusPose(key, out) {
  const cfg = hotspots[key].cfg;
  hotspots[key].group.updateWorldMatrix(true, false);
  const look = hotspots[key].group.localToWorld(cfg.localLook.clone());
  _dir.set(...cfg.dir).normalize();
  const { narrow } = viewport();
  const halfW = hFovHalfTan(), halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  let dist, shift;
  _right.crossVectors(_up, _dir).normalize();
  if (narrow) {
    // panel is a bottom sheet (52%): fit into the top 48% of the view, centred 26% above the middle
    dist = Math.max(cfg.minDist, (cfg.fitW / 2) / halfW * 1.15, (cfg.fitW * 0.36) / (0.48 * halfH) * 1.15);
    shift = 0.52 * dist * halfH;
    out.pos.copy(look).addScaledVector(_dir, dist);
    out.look.copy(look).addScaledVector(_up, -shift); out.pos.addScaledVector(_up, -shift);
  } else {
    // Measure the actual panel so focus remains correct after layout changes.
    const covered = clamp((panel.getBoundingClientRect().width + 28) / viewport().w, .2, .55);
    dist = Math.max(cfg.minDist, (cfg.fitW / 2) / ((1-covered) * halfW) * 1.15);
    shift = covered * dist * halfW;
    out.pos.copy(look).addScaledVector(_dir, dist);
    out.look.copy(look).addScaledVector(_right, shift); out.pos.addScaledVector(_right, shift);
  }
  // tiny parallax while focused
  if (!reduced && !idlePaused) out.pos.addScaledVector(_right, cam.par.x * 0.03).addScaledVector(_up, -cam.par.y * 0.02);
}
function updateCamera(dt) {
  if (cam.mode === "overview") overviewPose(_tmp); else focusPose(cam.focusKey, _tmp);
  const k = reduced ? 1 : 1 - Math.exp(-dt * (cam.mode === "overview" ? 4.5 : 3.6));
  cam.pos.lerp(_tmp.pos, k); cam.look.lerp(_tmp.look, k);
  camera.position.copy(cam.pos); camera.lookAt(cam.look);
}

/* ---------- interaction ---------- */
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let idlePaused = reduced, returnFocus = null;
let hovered = null, pointer = { x: 0, y: 0, down: false, sx: 0, sy: 0, moved: false, id: null }, needPick = false;
const tip = $("#desk-tip");
function setHover(key, ev) {
  if (hovered !== key) {
    hovered = key;
    canvas.style.cursor = key ? "pointer" : (pointer.down ? "grabbing" : "grab");
    if (key && cam.mode === "overview") { tip.textContent = T().desk.hotspots[key].label; tip.hidden = false; } else tip.hidden = true;
  }
  if (key && ev && !tip.hidden) { tip.style.left = (ev.clientX - stage.getBoundingClientRect().left + 14) + "px"; tip.style.top = (ev.clientY - stage.getBoundingClientRect().top - 10) + "px"; }
}
function pick(ev) {
  const r = stage.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(pickMeshes, false)[0];
  return hit ? hit.object.userData.hotspot : null;
}
canvas.addEventListener("pointerdown", (ev) => {
  if (ev.button !== undefined && ev.button !== 0) return;
  pointer.down = true; pointer.moved = false; pointer.sx = ev.clientX; pointer.sy = ev.clientY; pointer.id = ev.pointerId;
  canvas.setPointerCapture?.(ev.pointerId);
  if (!hovered) canvas.style.cursor = "grabbing";
});
canvas.addEventListener("pointermove", (ev) => {
  const r = stage.getBoundingClientRect();
  cam.par.x = ((ev.clientX - r.left) / r.width - 0.5) * 2;
  cam.par.y = ((ev.clientY - r.top) / r.height - 0.5) * 2;
  if (pointer.down) {
    const dx = ev.clientX - pointer.sx, dy = ev.clientY - pointer.sy;
    if (!pointer.moved && Math.hypot(dx, dy) > 5) pointer.moved = true;
    if (pointer.moved && cam.mode === "overview") {
      cam.dragAz = clamp(cam.dragAz - (ev.movementX || 0) * 0.0045, -0.75, 0.75);
      cam.dragPol = clamp(cam.dragPol - (ev.movementY || 0) * 0.003, -0.25, 0.22);
      setHover(null);
      return;
    }
  }
  if (!isTouch) { const k = pick(ev); setHover(k, ev); }
});
function endPointer(ev) {
  if (!pointer.down) return;
  pointer.down = false;
  canvas.style.cursor = hovered ? "pointer" : "grab";
  if (pointer.moved) return;
  const k = pick(ev);
  if (k) focus(k); else if (cam.mode === "focus") unfocus();
}
canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", () => { pointer.down = false; });
canvas.addEventListener("pointerleave", () => { if (!pointer.down) { setHover(null); cam.par.x = cam.par.y = 0; } });
document.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && cam.mode === "focus") unfocus(); });

/* ---------- focus / panel ---------- */
const panel = $("#desk-panel"), panelBody = $("#desk-panel-content"), backBtn = $("#desk-back");
function focus(key) {
  if (!hotspots[key]) return;
  returnFocus = document.activeElement?.closest?.("#desk-legend button") || $(`#desk-legend button[data-key="${key}"]`);
  cam.mode = "focus"; cam.focusKey = key; cam.dragAz = cam.dragPol = 0;
  stage.classList.add("focused");
  stage.dataset.focus = key;
  setHover(null);
  renderPanel(key);
  panel.hidden = false; requestAnimationFrame(() => panel.classList.add("open"));
  $$("#desk-legend button").forEach((b) => { b.classList.toggle("on", b.dataset.key === key); b.setAttribute("aria-pressed",String(b.dataset.key === key)); });
  if (key === "monitor") resumeVideo();
  backBtn.focus({ preventScroll: true });
}
function unfocus() {
  const focusWasInPanel = panel.contains(document.activeElement);
  cam.mode = "overview"; cam.focusKey = null;
  stage.classList.remove("focused"); delete stage.dataset.focus;
  panel.classList.remove("open"); setTimeout(() => { if (cam.mode === "overview") panel.hidden = true; }, 350);
  $$("#desk-legend button").forEach((b) => {b.classList.remove("on");b.setAttribute("aria-pressed","false");});
  if (activeVideo) videoEls[activeVideo].muted = true;
  updatePanelVideoState();
  if (focusWasInPanel) returnFocus?.focus({preventScroll:true});
}
backBtn.addEventListener("click", unfocus);

function link(id, text) { return `<a class="dp-more" href="#${id}">${esc(text)} ↓</a>`; }
function renderPanel(key) {
  const t = T(), D = t.desk, H = D.hotspots[key], L = SITE.links;
  let body = "";
  if (key === "monitor") {
    body = `<div class="dp-videos">${SITE.videos.map((v) => {
      const vt = D.videos[v.id];
      return `<button type="button" class="dp-video ${v.id === activeVideo ? "on" : ""}" data-video="${v.id}"><img src="${v.poster}" alt="" loading="lazy"><span><b>${esc(vt.title)}</b><small>${esc(vt.desc)}</small></span></button>`;
    }).join("")}</div>
    <div class="dp-controls"><button type="button" class="dp-btn" id="dp-play"></button><button type="button" class="dp-btn" id="dp-mute"></button></div>
    <p class="dp-note">${esc(D.videoNote)}</p>${link("projects", D.scrollMore)}`;
  } else if (key === "laptop") {
    body = `<ul class="dp-list">${t.projects.items.map((p) => `<li><span class="badge badge-${p.accent === "mint" ? "mint" : p.accent === "amber" ? "amber" : p.accent === "violet" ? "violet" : "cyan"}">${esc(p.badge)}</span><b>${esc(p.title)}</b></li>`).join("")}</ul>${link("projects", D.scrollMore)}`;
  } else if (key === "arm") {
    body = `<ol class="dp-steps">${t.loop.nodes.map((n) => `<li><div><b>${esc(n.short)}</b><span>${esc(n.title)}</span></div></li>`).join("")}</ol>
    <div class="chips">${t.skills.groups[0].items.map(([n]) => `<span class="chip cyan">${esc(n)}</span>`).join("")}</div>${link("loop", D.scrollMore)}`;
  } else if (key === "duck") {
    const S = t.startup;
    body = `<div class="dp-brand"><b>${esc(S.brand)}</b><small>${esc(S.tagline)}</small></div><h4>${esc(S.headline)}</h4><p>${esc(S.desc)}</p>
    <a class="btn btn-primary" href="${lang() === "en" ? L.startupEn : L.startup}" target="_blank" rel="noopener">${esc(S.cta)} ↗</a>${link("startup", D.scrollMore)}`;
  } else if (key === "notebook") {
    const E = t.experience, Hh = t.hero;
    body = `<div class="dp-me"><img src="${L.avatar}" alt=""><div><b>${esc(Hh.name)}</b><small>${esc(Hh.roles[0])}</small></div></div>
    <ul class="dp-list">${E.items.map((it) => `<li><small class="mono">${esc(it.date)}</small><b>${esc(it.role)}</b><span>${esc(it.org)}</span></li>`).join("")}</ul>
    <a class="btn btn-amber" href="${L.resume}" download>${esc(Hh.ctaTertiary)}</a>${link("experience", D.scrollMore)}`;
  } else if (key === "phone") {
    const Ct = t.contact;
    const row = (lbl, val, act) => `<div class="crow"><div class="l"><div class="lbl">${esc(lbl)}</div><div class="val">${esc(val)}</div></div>${act}</div>`;
    body = `<div class="dp-contact">${row(Ct.email, L.email, `<button class="act" type="button" data-copy="${esc(L.email)}">${esc(Ct.copy)}</button>`)}${row(Ct.wechat, L.wechat, `<button class="act" type="button" data-copy="${esc(L.wechat)}">${esc(Ct.copy)}</button>`)}${row(Ct.phoneUS, L.phoneUS, `<a class="act" href="tel:${L.phoneUS.replace(/\s/g, "")}">${esc(Ct.open)}</a>`)}${row(Ct.linkedin, "linkedin.com/in/qinzhen-ma", `<a class="act" href="${L.linkedin}" target="_blank" rel="noopener">${esc(Ct.open)} ↗</a>`)}${row(Ct.github, "github.com/quinn-ma", `<a class="act" href="${L.github}" target="_blank" rel="noopener">${esc(Ct.open)} ↗</a>`)}</div>${link("contact", D.scrollMore)}`;
  } else if (key === "books") {
    const Ed = t.education;
    body = `<ul class="dp-list">${Ed.items.map((e) => `<li><small class="mono">${esc(e.date)}</small><b>${esc(e.school)}</b><span>${esc(e.degree)}</span></li>`).join("")}<li><small class="mono">HONOR</small><b>${esc(Ed.honors[0][0])}</b><span>${esc(Ed.honors[0][1])}</span></li></ul>${link("education", D.scrollMore)}`;
  }
  panelBody.innerHTML = `<div class="dp-k">${esc(H.label)}</div><h3>${esc(H.title)}</h3><p class="dp-lead">${esc(H.desc)}</p>${body}`;
  // bindings
  $$("[data-video]", panelBody).forEach((b) => b.addEventListener("click", () => { userPaused = false; setVideo(b.dataset.video, true); $$("[data-video]", panelBody).forEach((x) => x.classList.toggle("on", x === b)); }));
  $("#dp-play", panelBody)?.addEventListener("click", () => { const v = videoEls[activeVideo]; if (v.paused) { userPaused = false; v.play().catch(() => {}); } else { userPaused = true; v.pause(); } updatePanelVideoState(); });
  $("#dp-mute", panelBody)?.addEventListener("click", () => { const v = videoEls[activeVideo]; v.muted = !v.muted; updatePanelVideoState(); });
  $$("[data-copy]", panelBody).forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) { /* ignore */ }
    window.siteToast?.(`${T().contact.copied}: ${b.dataset.copy}`);
  }));
  $$("a.dp-more", panelBody).forEach((a) => a.addEventListener("click", () => setTimeout(unfocus, 50)));
  updatePanelVideoState();
}
function updatePanelVideoState() {
  const D = T().desk, v = activeVideo && videoEls[activeVideo];
  const play = $("#dp-play"), mute = $("#dp-mute");
  if (play && v) play.textContent = v.paused ? "▶ " + D.play : "❚❚ " + D.pause;
  if (mute && v) mute.textContent = v.muted ? "🔇 " + D.unmute : "🔊 " + D.mute;
}

/* ---------- legend / hint / i18n ---------- */
const legend = $("#desk-legend"), hint = $("#desk-hint");
const ORDER = ["monitor", "duck", "arm", "laptop", "notebook", "books", "phone"];
const iconPaths = {
 monitor:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8M12 16v5"/>',
 duck:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>',
 arm:'<rect x="5" y="5" width="14" height="11" rx="4"/><path d="M9 10h.01M15 10h.01M9 13h6M12 2v3M3 9v4m18-4v4M8 16v4h8v-4"/>',
 laptop:'<rect x="5" y="3" width="14" height="12" rx="1.5"/><path d="m5 15-3 5h20l-3-5M10 17h4"/>',
 notebook:'<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M8 3v18M3 7h4M3 12h4M3 17h4m8-10h5m-5 4h5"/>',
 books:'<path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v8"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/>'
};
const icon = (key) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[key]}</svg>`;
function renderChrome() {
  const D = T().desk;
  $('#studio-title').textContent = lang()==='zh' ? '从桌上的物件，认识我的工作' : 'A little desk. A world of work.';
  $('#studio-reset').title = lang()==='zh' ? '恢复初始视角' : 'Reset view';
  $('#studio-reset').setAttribute('aria-label', $('#studio-reset').title);
  $('#studio-motion').title = lang()==='zh' ? (idlePaused?'继续桌面动画':'暂停桌面动画') : (idlePaused?'Resume desk animation':'Pause desk animation');
  $('#studio-motion').setAttribute('aria-label', $('#studio-motion').title);
  $('#studio-motion').setAttribute('aria-pressed',String(idlePaused));
  legend.innerHTML = ORDER.map((k) => `<button type="button" data-key="${k}" class="${cam.focusKey === k ? "on" : ""}" aria-pressed="${cam.focusKey === k}">${icon(k)}<span>${esc(D.hotspots[k].label)}</span></button>`).join("");
  $$("button", legend).forEach((b) => b.addEventListener("click", () => (cam.focusKey === b.dataset.key ? unfocus() : focus(b.dataset.key))));
  hint.textContent = isTouch ? D.hintTouch : D.hint;
  backBtn.textContent = "← " + D.back;
  if (cam.mode === "focus") renderPanel(cam.focusKey);
}
$('#studio-reset').addEventListener('click',()=>{cam.dragAz=cam.dragPol=cam.az=0;cam.par.x=cam.par.y=0;unfocus();});
$('#studio-motion').addEventListener('click',()=>{idlePaused=!idlePaused;renderChrome();});
window.addEventListener("site:lang", renderChrome);
window.addEventListener("site:theme", () => applyTheme());
function applyTheme() {
  const p = PAL[theme()];
  themeMats.forEach(({ m, key: k }) => m.color.setHex(p[k]));
  hemi.color.setHex(p.hemiSky); hemi.groundColor.setHex(p.hemiGround);
  key.intensity = p.keyI; fill.intensity = p.fillI;
  scene.background = new THREE.Color(p.bg);
  scene.fog.color.setHex(p.bg);
}

/* ---------- idle animation ---------- */
const clock = { t: 0, last: performance.now() };
function animate(dt) {
  const t = clock.t;
  if (!reduced && !idlePaused) {
  robotHead.rotation.y=Math.sin(t*.55)*.16;
  robotHead.rotation.z=-.045+Math.sin(t*.72)*.025;
  for(const part of robotArms) {
    part.shoulder.rotation.z=part.side*(.22+Math.sin(t*.65+part.side)*.045);
    part.elbow.rotation.x=-.23+Math.sin(t*.65+part.side)*.055;
  }
  duck.position.y = 0;
  duckHead.rotation.y = Math.sin(t * .65) * .18; duckHead.rotation.z = Math.sin(t * .85) * .035;

  screenGlow.intensity = 1.0 + Math.sin(t * 7.3) * 0.08 + Math.sin(t * 2.1) * 0.12;
  }
  // Selection feedback remains available when idle motion is paused.
  for (const k in hotspots) {
    const h = hotspots[k];
    const want = (k === hovered || k === cam.focusKey) ? 1 : 0;
    h.glow += (want - h.glow) * (reduced ? 1 : Math.min(1, dt * 9));
    const s = 1 + h.glow * (k === cam.focusKey || reduced ? 0 : 0.025);
    h.group.scale.copy(h.group.userData.baseScale).multiplyScalar(s);
    if (h.glow > 0.001 || h._wasGlow) {
      h.materials.forEach((m) => {
        if(m.userData.keep) return;
        m.emissive.copy(m.userData.baseEmissive).lerp(new THREE.Color(h.cfg.accent),h.glow);
        m.emissiveIntensity = m.userData.baseEmissiveIntensity + h.glow * .14;
      });
      h._wasGlow = h.glow > 0.001;
    }
  }
}
// keep the arm's own LED and duck LEDs from being overridden by glow
[arm, duck].forEach((g) => g.traverse((o) => { if (o.isMesh && o.material.emissiveIntensity > 0.5) o.material.userData.keep = true; }));

/* ---------- loop / lifecycle ---------- */
function tick(now) {
  if (!running) return;
  raf = requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - clock.last) / 1000); clock.last = now; if (!idlePaused) clock.t += dt;
  animate(dt);
  updateCamera(dt);
  renderer.render(scene, camera);
}
function start() { if (running) return; running = true; clock.last = performance.now(); raf = requestAnimationFrame(tick); resumeVideo(); }
function stop() { running = false; cancelAnimationFrame(raf); pauseVideos(); }
function syncRunning() { if (inView && visible) start(); else stop(); }
new IntersectionObserver((ents) => { inView = ents[0].isIntersecting; syncRunning(); }, { threshold: 0.05 }).observe(stage);
document.addEventListener("visibilitychange", () => { visible = !document.hidden; syncRunning(); });
function resize() {
  const { w, h } = viewport();
  renderer.setSize(w, h, false);
  camera.aspect = w / h; overviewSpherical();
}
new ResizeObserver(resize).observe(stage);
// retry autoplay on the first user gesture (some browsers block muted autoplay in low-power mode)
const gesture = () => { resumeVideo(); window.removeEventListener("pointerdown", gesture); window.removeEventListener("keydown", gesture); };
window.addEventListener("pointerdown", gesture); window.addEventListener("keydown", gesture);

function failGracefully() {
  stage.classList.add("no-webgl");
  const order = ['monitor','duck','arm','laptop','notebook','books','phone'];
  const links = ['projects','startup','loop','projects','experience','education','contact'];
  const content = SITE[lang()];
  $('#desk-legend').innerHTML = order.map((key,i)=>`<a class="btn btn-ghost" href="#${links[i]}">${esc(content.desk.hotspots[key].label)}</a>`).join('');
  const fallback = document.createElement('img'); fallback.className='scene-fallback'; fallback.src=SITE.videos[0].poster; fallback.alt=content.desk.demoTitle; stage.prepend(fallback);
  const l = $("#desk-loading"); if (l) l.textContent = (window.SITE && SITE[document.documentElement.lang.startsWith("zh") ? "zh" : "en"].desk.unsupported) || "3D unavailable";
}

/* ---------- boot ---------- */
function boot() {
  applyTheme(); resize(); renderChrome();

  overviewPose(_tmp); cam.look.copy(_tmp.look); cam.pos.copy(_tmp.pos);
  if(!reduced) cam.pos.multiplyScalar(1.06);
  renderer.compile(scene, camera);
  start();
  stage.classList.add("ready");
  $("#desk-loading")?.remove();
  // deep link: ?focus=monitor|duck|arm|laptop|notebook|books|phone
  const f = new URLSearchParams(location.search).get("focus");
  if (f && hotspots[f]) setTimeout(() => focus(f), 400);
}
canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); stop(); }, false);
canvas.addEventListener("webglcontextrestored", () => start(), false);
if (window.SITE_READY) boot(); else window.addEventListener("site:ready", boot, { once: true });
