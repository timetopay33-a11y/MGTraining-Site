/**
 * presets.js
 * ----------------------------------------------------------------
 * Canned error scenarios a trainee might see on a real CMM.
 * Each preset is a partial error state merged on top of a reset
 * (zero) state by ui.js. Values are in slider units, i.e. [-1, 1].
 *
 * @@REAL-CMM-HOOK@@
 * In an actual training workflow these could be populated from
 * historical calibration reports of known problem machines.
 * ----------------------------------------------------------------
 */

export const PRESETS = [
  {
    id: 'perfect',
    label: 'Perfect machine',
    description: 'All error terms zero. Reference state.',
    errors: {}, // everything defaults to zero
  },

  {
    id: 'squareness',
    label: 'Squareness issue',
    description: 'A common after-crash symptom: axes no longer orthogonal.',
    errors: {
      squareXY:  0.55,
      squareXZ: -0.35,
      squareYZ:  0.25,
    },
  },

  {
    id: 'thermal',
    label: 'Thermal growth',
    description:
      'Uniform positive scale error on all axes — the kind of drift seen as the shop warms up.',
    errors: {
      scaleX: 0.45,
      scaleY: 0.45,
      scaleZ: 0.30,
      linearity: 0.15,
    },
  },

  {
    id: 'straightness',
    label: 'Straightness issue',
    description:
      'Worn or contaminated guideway: the probe deviates perpendicular to the axis of motion.',
    errors: {
      straightX: 0.70,
      straightY: 0.35,
      straightZ: 0.20,
    },
  },

  {
    id: 'angular',
    label: 'Angular error',
    description:
      'Pitch, yaw and roll creeping in across all three axes. Typical symptom of bearing wear.',
    errors: {
      pitchX: 0.45,  yawX: -0.30, rollX: 0.20,
      pitchY: 0.25,  yawY:  0.40, rollY: -0.25,
      pitchZ: -0.20, yawZ:  0.15, rollZ: 0.35,
    },
  },

  {
    id: 'combined',
    label: 'Combined volumetric',
    description:
      'A little bit of everything. Useful for showing why volumetric compensation matters.',
    errors: {
      scaleX: 0.20,  scaleY: 0.15, scaleZ: 0.10,
      squareXY: 0.25, squareXZ: 0.15, squareYZ: -0.15,
      pitchX: 0.20,  yawX:  0.15, rollX: -0.10,
      pitchY: -0.15, yawY:  0.20, rollY:  0.10,
      pitchZ: 0.10,  yawZ: -0.15, rollZ:  0.20,
      straightX: 0.25, straightY: 0.20, straightZ: 0.15,
      linearity: 0.20,
    },
  },
];
