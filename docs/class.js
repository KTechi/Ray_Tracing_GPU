// ================================================== [50]
//     Definition

'use strict'

// Complex Number
function new_ComplexNumber(real) {
    const r = Math.abs(real)
    const theta = 0 < real ? 0 : Math.PI
    return [r, theta]
}
function new_ComplexNumber2(r, theta) {
    const r_ = Math.abs(r)
    const theta_ = 0 < r ? theta : theta + Math.PI
    return [r_, theta_]
}
function Re(cn) {
    const cos = Math.cos(cn[1])
    return Math.abs(cos) < 1e-10 ? 0 : cn[0] * cos
}
function Im(cn) {
    const sin = Math.sin(cn[1])
    return Math.abs(sin) < 1e-10 ? 0 : cn[0] * sin
}
function t(cn1, cn2) {
    let R = cn1[0]*Math.cos(cn1[1]) + cn2[0]*Math.cos(cn2[1])
    let I = cn1[0]*Math.sin(cn1[1]) + cn2[0]*Math.sin(cn2[1])
    if (Math.abs(R) < 1e0) R = 0
    if (Math.abs(I) < 1e0) I = 0
    return [Math.sqrt(R**2 + I**2), atan2_(I, R)]
}
function x(cn1, cn2) {
    const r = cn1[0] * cn2[0]
    const theta = cn1[1] + cn2[1]
    return [r, theta]
}
function pow_(cn, n) {
    const r = Math.pow(cn[0], n)
    const theta = n * cn[1]
    return [r, theta]
}

// Quaternion
function new_Quaternion(angle, axis) {
    return [Math.cos(angle / 2),
            Math.sin(angle / 2) * axis[0],
            Math.sin(angle / 2) * axis[1],
            Math.sin(angle / 2) * axis[2]]
}
function qConjugate(q) {
    return [q[0], -q[1], -q[2], -q[3]]
}
function qMultiply(p, q) {
    return [p[0]*q[0] - p[1]*q[1] - p[2]*q[2] - p[3]*q[3],
            p[0]*q[1] + p[1]*q[0] + p[2]*q[3] - p[3]*q[2],
            p[0]*q[2] - p[1]*q[3] + p[2]*q[0] + p[3]*q[1],
            p[0]*q[3] + p[1]*q[2] - p[2]*q[1] + p[3]*q[0]]
}
function qRotation(v, q) {
    const p_ = [   0, v[0], v[1], v[2]] // Target Quaternion
    const q_ = [q[0], q[1], q[2], q[3]]
    const qc = [q[0],-q[1],-q[2],-q[3]]
    return qMultiply(qMultiply(q_, p_), qc)
}

// Vector
function new_Vector(from, to) {
    return [to[0] - from[0],
            to[1] - from[1],
            to[2] - from[2]]
}
function norm(v) {
    return Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2)
}
function normalize_(v) {
    const s = 1 / Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2)
    return [s*v[0], s*v[1], s*v[2]]
}
function q2v(q) {
    // Quaternion -> Vector
    return [q[1], q[2], q[3]]
}

// ================================================== [50]
//     END
// ================================================== [50]