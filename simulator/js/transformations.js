/**
 * transformations.js
 * ----------------------------------------------------------------
 * Coordinate-transformation pipeline for CMM geometric errors.
 *
 * The simulator models 19 classical CMM error terms as genuine
 * coordinate transforms, not visual fakery. For every grid point P
 * we run:
 *
 *     P_final = linearity( straightness( rotation( squareness( scale( P ) ) ) ) )
 *
 * so errors compound in the same order a real machine's error
 * stack-up would produce them.
 *
 * This model is intentionally simplified for training purposes.
 * A production metrology tool would replace these closed-form
 * expressions with a calibrated error map (volumetric compensation
 * table) — see the hook comments below.
 * ----------------------------------------------------------------
 */

// Default (perfect-machine) error state. Sliders mutate this object.
export const DEFAULT_ERRORS = Object.freeze({
  // Linear scale (fractional: 0.1 slider -> +10 % of K.scale)
  scaleX: 0, scaleY: 0, scaleZ: 0,

  // Squareness (non-orthogonality between axis pairs)
  squareXY: 0, squareXZ: 0, squareYZ: 0,

  // Angular errors per axis (accumulate linearly along that axis)
  pitchX: 0, yawX: 0, rollX: 0,
  pitchY: 0, yawY: 0, rollY: 0,
  pitchZ: 0, yawZ: 0, rollZ: 0,

  // Straightness (perpendicular deviation as the axis traverses)
  straightX: 0, straightY: 0, straightZ: 0,

  // Global linearity (non-linear scale / lead-screw error)
  linearity: 0,
});

/**
 * Effect coefficients: how much a full slider deflection (±1)
 * translates to real-world units in the simulation. Tuned so that
 * full deflection of a single slider is clearly visible without
 * destroying the volume.
 */
const K = {
  scale:     0.10,  // ±10 % of each coordinate at full deflection
  square:    0.06,  // rad at full deflection (~3.4°)
  angular:   0.10,  // rad of carriage rotation at axis extremity
  straight:  0.35,  // peak straightness deviation amplitude
  linearity: 0.25,  // peak linearity deviation amplitude
};

/**
 * Create a mutable working copy of the default errors.
 * The UI mutates this object directly; transform code reads it.
 */
export function createErrorState() {
  return { ...DEFAULT_ERRORS };
}

/**
 * Reset all fields in an existing error state to 0. (Preserves
 * object identity so bindings / references stay valid.)
 */
export function resetErrors(e) {
  for (const k of Object.keys(DEFAULT_ERRORS)) e[k] = 0;
  return e;
}

/**
 * Quick check: is the machine "perfect"? Lets the caller skip
 * recomputation when all sliders are zero.
 */
export function hasAnyError(e, eps = 1e-9) {
  for (const k of Object.keys(DEFAULT_ERRORS)) {
    if (Math.abs(e[k]) > eps) return true;
  }
  return false;
}

/**
 * Transform a single point (x, y, z) through the full error stack.
 *
 * @param {Float32Array|number[]} out - length-3 output buffer
 * @param {number} x @param {number} y @param {number} z - input pos
 * @param {Object} e - error state (DEFAULT_ERRORS shape)
 * @param {number} L - half-range of the working volume (for
 *                     normalizing position-dependent terms)
 * @param {number} [amp=1] - optional magnification of the overall
 *                           distortion (used by the "magnify" toggle)
 *
 * NOTE: this function is hot; called once per grid vertex per
 * slider change. Keep it allocation-free.
 *
 * @@REAL-CMM-HOOK@@
 * To integrate real calibration data, replace the body of this
 * function with a lookup into a volumetric error map:
 *
 *     const [dx, dy, dz] = errorMap.sample(x, y, z);
 *     out[0] = x + amp * dx;
 *     out[1] = y + amp * dy;
 *     out[2] = z + amp * dz;
 *
 * The error map is typically a 3-D grid of measured deviations
 * produced from laser-interferometer or ballbar data.
 */
export function transformPoint(out, x, y, z, e, L, amp = 1) {
  // Remember ideal position so we can scale the overall delta
  // when the "magnify" toggle is active.
  const ix = x, iy = y, iz = z;

  // --------------------------------------------------------
  // STAGE 1 — Linear scale error (one per axis).
  // Fractional multiplicative error per axis.
  // --------------------------------------------------------
  x *= 1 + e.scaleX * K.scale;
  y *= 1 + e.scaleY * K.scale;
  z *= 1 + e.scaleZ * K.scale;

  // --------------------------------------------------------
  // STAGE 2 — Squareness (non-orthogonality between axes),
  // modeled as shear. An XY squareness of θ means the Y axis
  // tips toward the X axis by θ.
  // --------------------------------------------------------
  const sxy = e.squareXY * K.square;
  const sxz = e.squareXZ * K.square;
  const syz = e.squareYZ * K.square;

  const x2 = x + y * Math.sin(sxy) + z * Math.sin(sxz);
  const y2 = y + z * Math.sin(syz);
  const z2 = z;
  x = x2; y = y2; z = z2;

  // --------------------------------------------------------
  // STAGE 3 — Angular errors (pitch, yaw, roll) per axis.
  //
  // In a real CMM, each linear axis has three angular error
  // components (roll about own axis, pitch and yaw about the
  // two orthogonal axes) that accumulate with carriage motion.
  // We model this by letting the carriage rotation angle at
  // position p along axis A be:
  //
  //     θ(p) = error_rate * (p / L)
  //
  // which is then applied to the probe-tip coordinates through
  // a small-angle rotation.  Rotations from the three axes are
  // summed component-wise (a valid first-order approximation).
  // --------------------------------------------------------
  const nx = x / L, ny = y / L, nz = z / L; // normalized positions

  // Each axis of motion contributes to all three rotation axes.
  // Note the naming convention used here:
  //   pitchX = rotation about Y caused by X-carriage motion
  //   yawX   = rotation about Z caused by X-carriage motion
  //   rollX  = rotation about X caused by X-carriage motion
  const thetaX =
      e.rollX  * K.angular * nx +
      e.rollY  * K.angular * ny +
      e.rollZ  * K.angular * nz;

  const thetaY =
      e.pitchX * K.angular * nx +
      e.pitchY * K.angular * ny +
      e.pitchZ * K.angular * nz;

  const thetaZ =
      e.yawX * K.angular * nx +
      e.yawY * K.angular * ny +
      e.yawZ * K.angular * nz;

  // Apply combined small rotation (first-order accurate):
  //   x' = x + z·θy − y·θz
  //   y' = y − z·θx + x·θz
  //   z' = z + y·θx − x·θy
  const rx = x + z * thetaY - y * thetaZ;
  const ry = y - z * thetaX + x * thetaZ;
  const rz = z + y * thetaX - x * thetaY;
  x = rx; y = ry; z = rz;

  // --------------------------------------------------------
  // STAGE 4 — Straightness.
  // As an axis traverses its range, the probe deviates
  // perpendicular to that axis. Modeled as a sinusoidal
  // profile. A single slider drives both perpendicular
  // directions (with a phase offset) for visual richness.
  // --------------------------------------------------------
  const PI = Math.PI;
  const sx = e.straightX * K.straight;
  const sy = e.straightY * K.straight;
  const sz = e.straightZ * K.straight;

  // X-axis straightness → Y and Z deviations as X varies
  y += sx * Math.sin(PI * nx);
  z += sx * 0.6 * Math.cos(PI * nx);

  // Y-axis straightness → X and Z deviations as Y varies
  x += sy * Math.sin(PI * ny);
  z += sy * 0.6 * Math.cos(PI * ny);

  // Z-axis straightness → X and Y deviations as Z varies
  x += sz * Math.sin(PI * nz);
  y += sz * 0.6 * Math.cos(PI * nz);

  // --------------------------------------------------------
  // STAGE 5 — Linearity.
  // Non-linear positional error (e.g. lead-screw pitch
  // variation). A single global slider drives a higher-
  // frequency sinusoidal correction on all three axes.
  // --------------------------------------------------------
  const lin = e.linearity * K.linearity;
  x += lin * Math.sin(2 * PI * nx);
  y += lin * Math.sin(2 * PI * ny);
  z += lin * Math.sin(2 * PI * nz);

  // --------------------------------------------------------
  // Optional visual magnification of the total distortion.
  // --------------------------------------------------------
  if (amp !== 1) {
    x = ix + (x - ix) * amp;
    y = iy + (y - iy) * amp;
    z = iz + (z - iz) * amp;
  }

  out[0] = x; out[1] = y; out[2] = z;
  return out;
}

/**
 * Convenience: transform an array of flat [x,y,z,...] points
 * into a destination buffer in one pass. Returns `dst`.
 */
export function transformBuffer(src, dst, e, L, amp = 1) {
  const tmp = [0, 0, 0];
  for (let i = 0; i < src.length; i += 3) {
    transformPoint(tmp, src[i], src[i + 1], src[i + 2], e, L, amp);
    dst[i]     = tmp[0];
    dst[i + 1] = tmp[1];
    dst[i + 2] = tmp[2];
  }
  return dst;
}
