// ================================================== [50]
//     Definition

'use strict'

// Vector
function innerProduct(u, v) {
    return (u[0]*v[0] +
            u[1]*v[1] +
            u[2]*v[2]  )
}
function crossProduct(u, v) {
    return [u[1]*v[2] - u[2]*v[1],
            u[2]*v[0] - u[0]*v[2],
            u[0]*v[1] - u[1]*v[0]]
}
function add(a, u, b, v) {
    return [a*u[0] + b*v[0],
            a*u[1] + b*v[1],
            a*u[2] + b*v[2]]
}
function world(offset, a, v) {
    return [offset[0] + a*v[0],
            offset[1] + a*v[1],
            offset[2] + a*v[2]]
}
function world2V(offset, a, u, b, v) {
    return world(offset, 1, add(a, u, b, v))
}

// Math
function atan2_(a, b) {
    if (0 < b) return Math.atan(a / b)
    else if (b <  0 && a >= 0) return Math.atan(a/b) + Math.PI
    else if (b <  0 && a <  0) return Math.atan(a/b) - Math.PI
    else if (b == 0 && 0 <  a) return  Math.PI / 2
    else if (b == 0 && a <  0) return -Math.PI / 2
    else if (b == 0 && a == 0) return 0
    return 0
}

// Solve Cubic Equation
// x^3 + ax^2 + bx + c = 0
function sce(a, b, c) {
    const p = -(a**2)/3 + b
    const q = 2*a**3/27 - a*b/3 + c
    const r = q**2/4 + p**3/27
    let A = [0, 0]
    let B = [0, 0]
    if (r < 0) {
        const q_ = new_ComplexNumber(-q/2)
        const r_ = pow_(new_ComplexNumber(r), .5)
        A = pow_(t(q_, r_), 1/3)
        r_[1] += Math.PI
        B = pow_(t(q_, r_), 1/3)
    } else {
        const a_ = -q/2 + Math.sqrt(r)
        const b_ = -q/2 - Math.sqrt(r)
        A = [Math.pow(Math.abs(a_), 1/3), 0 <= a_ ? 0 : Math.PI]
        B = [Math.pow(Math.abs(b_), 1/3), 0 <= b_ ? 0 : Math.PI]
    }
    const C = new_ComplexNumber(-a/3)
    return t(t(A, B), C)
}

// Solve Quartic Equation
// x^4 + ax^3 + bx^2 + cx + d = 0
function sqe(a, b, c, d) {
    const p = -3*a**2/8 + b
    const q = a**3/8 - a*b/2 + c
    const r = -3*a**4/256 + a**2*b/16 - a*c/4 + d
    const lambda = sce(-p/2, -r, p*r/2 - q**2/8)
    const neg_1 = new_ComplexNumber(-1)
    const two   = new_ComplexNumber( 2)
    const four  = new_ComplexNumber( 4)
    const neg_p = new_ComplexNumber(-p)
    const neg_q = new_ComplexNumber(-q)
    const neg_r = new_ComplexNumber(-r)
    const m = pow_(t(x(two, lambda), neg_p), .5)
    let n = x(neg_q, pow_(x(two, m), -1)) // if m is zero, n will be zero
    if (Math.abs(m[0]) < 1e-3) // calculate n in a different way
        n = pow_(t(neg_r, pow_(lambda, 2)), .5)
    const neg_m = x(m, neg_1)
    const neg_n = x(n, neg_1)
    const tmp1 = pow_(t(x(x(t(lambda,     n), four), neg_1), pow_(m, 2)), .5)
    const tmp2 = pow_(t(x(x(t(lambda, neg_n), four), neg_1), pow_(m, 2)), .5)
    let ans1 = t(neg_m, tmp1)
    let ans2 = t(neg_m, x(tmp1, neg_1))
    let ans3 = t(m, tmp2)
    let ans4 = t(m, x(tmp2, neg_1))
    ans1[0] /= 2
    ans2[0] /= 2
    ans3[0] /= 2
    ans4[0] /= 2
    ans1 = t(ans1, x(new_ComplexNumber(a/4), neg_1))
    ans2 = t(ans2, x(new_ComplexNumber(a/4), neg_1))
    ans3 = t(ans3, x(new_ComplexNumber(a/4), neg_1))
    ans4 = t(ans4, x(new_ComplexNumber(a/4), neg_1))
    let t_ = -1
    if (Math.abs(Im(ans1)) < 1e-12 && 0 < Re(ans1) && (t_ === -1 || Re(ans1) < t_)) t_ = Re(ans1)
    if (Math.abs(Im(ans2)) < 1e-12 && 0 < Re(ans2) && (t_ === -1 || Re(ans2) < t_)) t_ = Re(ans2)
    if (Math.abs(Im(ans3)) < 1e-12 && 0 < Re(ans3) && (t_ === -1 || Re(ans3) < t_)) t_ = Re(ans3)
    if (Math.abs(Im(ans4)) < 1e-12 && 0 < Re(ans4) && (t_ === -1 || Re(ans4) < t_)) t_ = Re(ans4)
    return t_
}

// ================================================== [50]
//     END
// ================================================== [50]