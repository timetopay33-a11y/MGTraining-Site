# CMM Geometric Error Training Simulator

A browser-based, interactive visualization of how the 19 classical
geometric error terms of a Coordinate Measuring Machine distort
its measurement volume.

> **Training tool, not metrology software.**
> The math is faithful in *form* — real coordinate transforms,
> compounded in the correct order — but the magnitudes are tuned
> for visibility, not accuracy. Do not use this to predict real
> machine behavior.

---

## What you get

- A 3-D wireframe lattice of the ideal CMM working volume
  (cyan, semi-transparent)
- A second lattice showing that volume after distortion
  (amber, opaque)
- A simple rectangular sample part with measurement features
  (hole centers on the top, front, and right faces, plus the
  eight corners)
- Red deviation vectors from each feature's nominal position
  to its simulated measured position
- Live numeric readout of max and RMS feature deviation
- 19 sliders driving every error term, grouped into three sections
- Preset scenarios: perfect, squareness, thermal growth,
  straightness, angular, and combined volumetric
- Display toggles for ideal / distorted / part / vectors, plus a
  **×10 magnify** toggle that inflates the delta so small errors
  are visible at distance

---

## Folder structure

```
cmm-simulator/
├── index.html                 ← shell + import map
├── README.md                  ← this file
├── css/
│   └── styles.css             ← dark technical theme
└── js/
    ├── main.js                ← entry: scene, camera, render loop
    ├── grid.js                ← 3-D lattice generation and GPU buffers
    ├── transformations.js     ← the 19 error terms as real math
    ├── samplePart.js          ← block + features + deviation vectors
    ├── ui.js                  ← sliders, toggles, preset buttons
    └── presets.js             ← canned error scenarios
```

---

## Running locally

Because `index.html` uses ES modules, it must be served over HTTP.
Opening `index.html` directly with `file://` will fail due to CORS.

Any static server works. A few options:

```bash
# Python 3 (pre-installed on macOS and most Linux)
cd cmm-simulator
python3 -m http.server 8000
# then open http://localhost:8000

# Node.js
npx serve

# VS Code
# install "Live Server" extension → right-click index.html → "Open with Live Server"
```

There is no build step. No dependencies to install. Three.js is
pulled in from a CDN via an import map in `index.html`.

---

## How the error pipeline works

Every grid vertex and every feature point is pushed through the
same five-stage transform in `js/transformations.js`:

```
P_final = linearity( straightness( rotation( squareness( scale( P ) ) ) ) )
```

| Stage        | Error terms                     | Implementation              |
|--------------|----------------------------------|------------------------------|
| Scale        | scaleX, scaleY, scaleZ           | per-axis multiplicative     |
| Squareness   | squareXY, squareXZ, squareYZ     | shear between axis pairs    |
| Rotation     | pitch/yaw/roll × (X, Y, Z)       | position-dependent small rotation, components summed first-order |
| Straightness | straightX, straightY, straightZ  | sinusoidal perpendicular deviation |
| Linearity    | linearity                        | higher-frequency non-linear scale |

Each slider in the UI produces a value in `[-1, 1]`; that raw
value is scaled inside `transformations.js` by coefficients in
the `K` constant so full deflection produces a clear visible
effect. Tune those if you want a more aggressive or more subtle
demonstration.

---

## Extending

The code is deliberately small and flat so instructors can hack
on it. A few places to start:

- **Replace the analytical error model with real calibration
  data.** Every hook where this would plug in is marked
  `@@REAL-CMM-HOOK@@` in the source. The body of
  `transformPoint()` is the obvious place to sample a measured
  volumetric error map instead of evaluating closed-form
  expressions.

- **Add your own preset scenarios.** Edit `js/presets.js` —
  each preset is just a partial error state.

- **Change the sample part.** `js/samplePart.js` defines the
  block dimensions, position and the list of feature points.
  Swap in something closer to your actual inspection program.

- **Add more grid detail.** Bump `GRID_DIVS` or `GRID_SEGS` in
  `js/main.js` for a denser lattice. Performance has plenty of
  headroom at the current settings.

---

## Controls reference

| Action               | Gesture                     |
|----------------------|------------------------------|
| Orbit                | left-drag                    |
| Pan                  | right-drag (or two-finger)   |
| Zoom                 | scroll wheel                 |
| Move a slider        | click & drag the handle      |
| Zero a slider        | double-click its label/value |
| Apply a preset       | click a preset button        |
| Reset all errors     | click **Reset all errors**   |
| Toggle display layer | checkboxes in the Display row |

---

## License

Internal training use. No warranty, express or implied.
