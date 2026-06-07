/**
 * ui.js
 * ----------------------------------------------------------------
 * Builds the slider controls, preset buttons, display toggles,
 * and wires them to the error state + a callback that tells the
 * rest of the app something changed.
 *
 * Design notes:
 *   - Every slider is a raw <input type="range"> with step 0.01
 *     and range [-1, 1].  The numeric value shown beside it is
 *     converted to a human-readable unit (%, deg, or raw).
 *   - The actual effect coefficients live in transformations.js;
 *     this module only handles display formatting.
 * ----------------------------------------------------------------
 */

import { DEFAULT_ERRORS, resetErrors } from './transformations.js';
import { PRESETS } from './presets.js';

// Display unit per error key.
// 'pct'  -> percent (slider * 10  %,  matches K.scale = 0.10)
// 'deg'  -> degrees (slider * K  rad * 180/π)
// 'unit' -> raw grid units (slider * K)
const FORMAT = {
  scaleX: { unit: 'pct',  k: 10,     label: 'X scale' },
  scaleY: { unit: 'pct',  k: 10,     label: 'Y scale' },
  scaleZ: { unit: 'pct',  k: 10,     label: 'Z scale' },

  squareXY:{ unit: 'deg', k: 0.06,   label: 'XY squareness' },
  squareXZ:{ unit: 'deg', k: 0.06,   label: 'XZ squareness' },
  squareYZ:{ unit: 'deg', k: 0.06,   label: 'YZ squareness' },

  pitchX: { unit: 'deg',  k: 0.10,   label: 'X pitch' },
  yawX:   { unit: 'deg',  k: 0.10,   label: 'X yaw'   },
  rollX:  { unit: 'deg',  k: 0.10,   label: 'X roll'  },

  pitchY: { unit: 'deg',  k: 0.10,   label: 'Y pitch' },
  yawY:   { unit: 'deg',  k: 0.10,   label: 'Y yaw'   },
  rollY:  { unit: 'deg',  k: 0.10,   label: 'Y roll'  },

  pitchZ: { unit: 'deg',  k: 0.10,   label: 'Z pitch' },
  yawZ:   { unit: 'deg',  k: 0.10,   label: 'Z yaw'   },
  rollZ:  { unit: 'deg',  k: 0.10,   label: 'Z roll'  },

  straightX: { unit: 'unit', k: 0.35, label: 'X straightness' },
  straightY: { unit: 'unit', k: 0.35, label: 'Y straightness' },
  straightZ: { unit: 'unit', k: 0.35, label: 'Z straightness' },

  linearity: { unit: 'unit', k: 0.25, label: 'Linearity' },
};

// Which group each slider belongs to in the UI
const GROUPS = {
  linear:   ['scaleX','scaleY','scaleZ','squareXY','squareXZ','squareYZ'],
  angular:  ['pitchX','yawX','rollX','pitchY','yawY','rollY','pitchZ','yawZ','rollZ'],
  straight: ['straightX','straightY','straightZ','linearity'],
};

/**
 * Build all UI widgets.
 *
 * @param {Object} errors  - mutable error state object
 * @param {Object} toggles - mutable display-toggle state
 * @param {Function} onChange - called whenever any control moves
 */
export function buildUI(errors, toggles, onChange) {
  const controls = {
    sliders: {},     // key -> { input, readout, wrapper }
    toggles: {},
  };

  // ---------- Sliders -------------------------------------
  for (const [groupId, keys] of Object.entries(GROUPS)) {
    const host = document.getElementById(`group-${groupId}`);
    for (const key of keys) {
      controls.sliders[key] = createSlider(host, key, errors, onChange);
    }
  }

  // ---------- Display toggles ------------------------------
  const toggleBindings = [
    ['toggle-ideal',      'showIdeal'     ],
    ['toggle-distorted',  'showDistorted' ],
    ['toggle-part',       'showPart'      ],
    ['toggle-vectors',    'showVectors'   ],
    ['toggle-magnify',    'magnify'       ],
  ];

  for (const [id, key] of toggleBindings) {
    const el = document.getElementById(id);
    el.checked = !!toggles[key];
    el.addEventListener('change', () => {
      toggles[key] = el.checked;
      onChange({ toggle: key });
    });
    controls.toggles[key] = el;
  }

  // ---------- Reset button ---------------------------------
  document.getElementById('btn-reset').addEventListener('click', () => {
    resetErrors(errors);
    syncSliders(controls.sliders, errors);
    onChange({ reset: true });
  });

  // ---------- Preset buttons -------------------------------
  const presetHost = document.getElementById('preset-grid');
  for (const preset of PRESETS) {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = preset.label;
    b.title = preset.description;
    b.addEventListener('click', () => {
      resetErrors(errors);
      Object.assign(errors, preset.errors);
      syncSliders(controls.sliders, errors);
      onChange({ preset: preset.id });
    });
    presetHost.appendChild(b);
  }

  return controls;
}

// ------------------------------------------------------------
// Slider factory
// ------------------------------------------------------------
function createSlider(host, key, errors, onChange) {
  const fmt = FORMAT[key];

  const wrap = document.createElement('div');
  wrap.className = 'slider';

  const label = document.createElement('div');
  label.className = 'slider-label';
  label.textContent = fmt.label;

  const readout = document.createElement('div');
  readout.className = 'slider-value is-zero';
  readout.textContent = formatValue(0, fmt);

  const input = document.createElement('input');
  input.type = 'range';
  input.min = '-1';
  input.max = '1';
  input.step = '0.01';
  input.value = String(errors[key] ?? 0);
  input.className = 'slider-input';

  input.addEventListener('input', () => {
    const v = parseFloat(input.value);
    errors[key] = v;
    readout.textContent = formatValue(v, fmt);
    wrap.classList.toggle('is-active', Math.abs(v) > 1e-4);
    readout.classList.toggle('is-zero', Math.abs(v) < 1e-4);
    onChange({ key, value: v });
  });

  // double-click on label or readout zeros the slider
  const zero = () => {
    input.value = '0';
    input.dispatchEvent(new Event('input'));
  };
  label.addEventListener('dblclick', zero);
  readout.addEventListener('dblclick', zero);

  wrap.appendChild(label);
  wrap.appendChild(readout);
  wrap.appendChild(input);
  host.appendChild(wrap);

  return { input, readout, wrapper: wrap };
}

/** Sync slider widgets to the current error state. */
function syncSliders(sliders, errors) {
  for (const [key, ctrl] of Object.entries(sliders)) {
    const v = errors[key] ?? 0;
    ctrl.input.value = String(v);
    ctrl.readout.textContent = formatValue(v, FORMAT[key]);
    const active = Math.abs(v) > 1e-4;
    ctrl.wrapper.classList.toggle('is-active', active);
    ctrl.readout.classList.toggle('is-zero', !active);
  }
}

// ------------------------------------------------------------
// Formatting
// ------------------------------------------------------------
function formatValue(sliderVal, fmt) {
  if (!fmt) return sliderVal.toFixed(2);
  const signed = (n, d = 2) => (n >= 0 ? '+' : '') + n.toFixed(d);

  switch (fmt.unit) {
    case 'pct': {
      return signed(sliderVal * fmt.k, 2) + ' %';
    }
    case 'deg': {
      const deg = sliderVal * fmt.k * (180 / Math.PI);
      return signed(deg, 3) + '°';
    }
    case 'unit': {
      return signed(sliderVal * fmt.k, 3) + ' u';
    }
    default:
      return sliderVal.toFixed(2);
  }
}
