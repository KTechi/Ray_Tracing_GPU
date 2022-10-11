// ================================================== [50]
//     GPU

'use strict'

function initGPU() {
    gpu = new GPU({ canvas, webGl: gl})
// Complex Number
.addFunction(new_ComplexNumber , { argumentTypes: { real: 'Number'               }, returnType: 'Array(2)' })
.addFunction(new_ComplexNumber2, { argumentTypes: { r: 'Number', theta: 'Number' }, returnType: 'Array(2)' })
.addFunction(Re,   { argumentTypes: { cn:  'Array(2)' }, returnType: 'Number' })
.addFunction(Im,   { argumentTypes: { cn:  'Array(2)' }, returnType: 'Number' })
.addFunction(t ,   { argumentTypes: { cn1: 'Array(2)', cn2: 'Array(2)' }, returnType: 'Array(2)' })
.addFunction(x ,   { argumentTypes: { cn1: 'Array(2)', cn2: 'Array(2)' }, returnType: 'Array(2)' })
.addFunction(pow_, { argumentTypes: { cn:  'Array(2)', n:   'Number'   }, returnType: 'Array(2)' })
// Quaternion
.addFunction(qConjugate, { argumentTypes: { q: 'Array(4)'                }, returnType: 'Array(4)' })
.addFunction(qMultiply , { argumentTypes: { p: 'Array(4)', q: 'Array(4)' }, returnType: 'Array(4)' })
.addFunction(qRotation , { argumentTypes: { v: 'Array(3)', q: 'Array(4)' }, returnType: 'Array(4)' })
// Vector
.addFunction(new_Vector,   { argumentTypes: { fomr: 'Array(3)', to: 'Array(3)' }, returnType: 'Array(3)' })
.addFunction(norm,         { argumentTypes: { v: 'Array(3)' }, returnType: 'Number' })
.addFunction(normalize_,   { argumentTypes: { v: 'Array(3)' }, returnType: 'Array(3)' })
.addFunction(q2v,          { argumentTypes: { q: 'Array(4)' }, returnType: 'Array(3)' })
.addFunction(innerProduct, { argumentTypes: { u: 'Array(3)', v: 'Array(3)' }, returnType: 'Number' })
.addFunction(crossProduct, { argumentTypes: { u: 'Array(3)', v: 'Array(3)' }, returnType: 'Array(3)' })
.addFunction(add,          { argumentTypes: { a: 'Number', u: 'Array(3)', b: 'Number', v: 'Array(3)' }, returnType: 'Array(3)' })
.addFunction(world,        { argumentTypes: { offset: 'Array(3)', a: 'Number', u: 'Array(3)' }, returnType: 'Array(3)' })
.addFunction(world2V,      { argumentTypes: { offset: 'Array(3)', a: 'Number', u: 'Array(3)', b: 'Number', v: 'Array(3)' }, returnType: 'Array(3)' })
// Math
.addFunction(atan2_, { argumentTypes: { a: 'Number', b: 'Number' }, returnType: 'Number' })
.addFunction(ipow_ , { argumentTypes: { x: 'Number', a: 'Number' }, returnType: 'Number' })
.addFunction(sce,    { argumentTypes: { a: 'Number', b: 'Number', c: 'Number'              }, returnType: 'Array(2)' })
.addFunction(sqe,    { argumentTypes: { a: 'Number', b: 'Number', c: 'Number', d: 'Number' }, returnType: 'Number' })
// Colision Point
.addFunction(getColisionPointTorus, { argumentTypes: { cam: 'Array(3)', ray: 'Array(3)', light: 'Array(3)', material: 'Array(3)', R: 'Number', r: 'Number' }, returnType: 'Array(4)' })
.addFunction(getColisionPointPIC  , { argumentTypes: { cam: 'Array(3)', ray: 'Array(3)', light: 'Array(3)', material: 'Array(3)'                           }, returnType: 'Array(4)' })
    return gpu.createKernel(kernel)
        .setDebug(true)
        .setConstants({ VW, VH, width: VW, height: VH })
        .setOutput([VW, VH])
        .setGraphical(true)
        .setLoopMaxIterations(10000);
}

function kernel(NW, sX, sY, cm, lt,
    torus_o, torus_q, torus_m, torus_data,
    pic_o, pic_q, pic_m) {
    // Origin - North West
    const VW = this.constants.width
    const VH = this.constants.height
    const x = this.thread.x
    const y = VH - this.thread.y
    const north_west = [NW[0], NW[1], NW[2]]
    const screenX    = [sX[0], sX[1], sX[2]]
    const screenY    = [sY[0], sY[1], sY[2]]
    const camera     = [cm[0], cm[1], cm[2]]
    const light      = [lt[0], lt[1], lt[2]]
    const t_o = [torus_o[0], torus_o[1], torus_o[2]]
    const t_q = [torus_q[0], torus_q[1], torus_q[2], torus_q[3]]
    const t_m = [torus_m[0], torus_m[1], torus_m[2]]
    const t_R = torus_data[0]
    const t_r = torus_data[1]
    const p_o = [pic_o[0], pic_o[1], pic_o[2]]
    const p_q = [pic_q[0], pic_q[1], pic_q[2], pic_q[3]]
    const p_m = [pic_m[0], pic_m[1], pic_m[2]]
    const pixel = world2V(north_west, x, screenX, y, screenY)

    let cam = q2v(qRotation(world(camera, -1, t_o)   , qConjugate(t_q)))
    let ray = q2v(qRotation(new_Vector(camera, pixel), qConjugate(t_q)))
    let lt_ = q2v(qRotation(world(light , -1, t_o)   , qConjugate(t_q)))
    ray = normalize(ray)
    let colPoint  = getColisionPointTorus(cam, ray, lt_, t_m, t_R, t_r)

    cam = q2v(qRotation(world(camera, -1, p_o)   , qConjugate(p_q)))
    ray = q2v(qRotation(new_Vector(camera, pixel), qConjugate(p_q)))
    lt_ = q2v(qRotation(world(light , -1, p_o)   , qConjugate(p_q)))
    ray = normalize(ray)
    let colPoint2 = getColisionPointPIC  (cam, ray, lt_, p_m)

    if (colPoint[3] < 0 || (0 < colPoint2[3] && colPoint2[3] < colPoint[3])) colPoint = colPoint2

    let r = 0
    let g = 0
    let b = 0
    if (0 < colPoint[3]) {
        r = colPoint[0]
        g = colPoint[1]
        b = colPoint[2]
    } else {
        r = .1
        g = .1
        b = .1
    }
    this.color(r, g, b, 1)
}

function getColisionPointTorus(cam, ray, light, material, R, r) {
    const c2 = 2 * innerProduct(ray, cam)
    const c3 = norm(cam)**2 + R**2 - r**2
    const c4 = 4 * R**2 * (ray[0]**2 + ray[1]**2)
    const c5 = 8 * R**2 * (ray[0]*cam[0] + ray[1]*cam[1])
    const c6 = 4 * R**2 * (cam[0]**2 + cam[1]**2)

    const t = sqe(2*c2,
                  2*c3 + c2**2 - c4,
                  2*c2*c3 - c5,
                  c3**2 - c6)

    if (t < 0) return [0, 0, 0, -1]

    const v = world(cam, t, ray)
    let l = new_Vector(v, light)
    const angle = atan2_(v[1], v[0])

    let n = [v[0] - R*Math.cos(angle),
             v[1] - R*Math.sin(angle),
             v[2]]
    l = normalize(l)
    n = normalize(n)
    let inp = innerProduct(l, n)
    if (inp < 0) inp = 0
    let r_ = [2*inp*n[0],
              2*inp*n[1],
              2*inp*n[2]]
    r_[0] -= l[0]
    r_[1] -= l[1]
    r_[2] -= l[2]
    r_ = normalize(r_)
    let toCam = new_Vector(v, cam)
    toCam = normalize(toCam)
    const alpha = innerProduct(r_, toCam) < 0 ? 0 : innerProduct(r_, toCam)
    const diff = alpha + 0.2
    const spec = alpha**30
    return [material[0]*diff + spec,
            material[1]*diff + spec,
            material[2]*diff + spec, t]
}
function getColisionPointPIC(cam, ray, light, material) {
    const t = -cam[2] / ray[2]
    if (t < 0) return [0, 0, 0, -1] // Opposite Direction
    const m = [material[0], material[1], material[2]]
    const x = cam[0] + t*ray[0]
    const y = cam[1] + t*ray[1]

    if (0 < Math.sin(x/30)*Math.sin(y/30)) {
        m[0] = 0
        m[1] = 0
        m[2] = 1
    }

    const v = world(cam, t, ray)
    const l = new_Vector(v, light)
    const n = [0, 0, 1]
    l = normalize(l)
    let inp = innerProduct(l, n)
    if (inp < 0) {
        n[2] = -1
        inp = innerProduct(l, n)
        if (inp < 0) inp = 0
    }
    const r =[2*inp*n[0], 2*inp*n[1], 2*inp*n[2]]
    r[0] -= l[0]
    r[1] -= l[1]
    r[2] -= l[2]
    r = normalize(r)
    const toCam = new_Vector(v, cam)
    toCam = normalize(toCam)
    const alpha = innerProduct(r, toCam) < 0 ? 0 : innerProduct(r, toCam)
    const diff = alpha + 0.2
    const spec = alpha**30
    return [m[0]*diff + spec,
            m[1]*diff + spec,
            m[2]*diff + spec, t]
}

// ================================================== [50]
//     END
// ================================================== [50]