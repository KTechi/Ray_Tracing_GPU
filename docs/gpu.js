// ================================================== [50]
//     GPU

'use strict'

function initGPU() {
    gpu = new GPU({ canvas, webGl: gl})
        .addFunction(atan2_, { argumentTypes: { a: 'Number', b: 'Number' }, returnType: 'Number' })
        .addFunction(copy, { argumentTypes: { array: 'Array(4)' }, returnType: 'Array(4)' })
    return gpu.createKernel(kernel)
        .setDebug(true)
        .setConstants({ VW, VH, width: VW, height: VH })
        .setOutput([VW, VH])
        .setGraphical(true)
        .setLoopMaxIterations(10000);
}

function kernel(q) {
    // Origin - North West
    const VW = this.constants.width
    const VH = this.constants.height
    const x = this.thread.x
    const y = VH - this.thread.y

    const tmp = atan2_(y - VH/2, x - VW/2) / 4 + .5
    this.color(1, tmp, 1, 1)

    // const q1 = copy(q)
    // this.color(1-q1[0], q1[0], q1[0], 1)
}

function atan2_(a, b) {
    if (0 < b) return Math.atan(a / b)
    else if (b <  0 && a >= 0) return Math.atan(a/b) + Math.PI
    else if (b <  0 && a <  0) return Math.atan(a/b) - Math.PI
    else if (b == 0 && 0 <  a) return  Math.PI / 2
    else if (b == 0 && a <  0) return -Math.PI / 2
    else if (b == 0 && a == 0) return 0
    return 0;
}
function copy(q) {
    return [q[0], q[1], q[2], q[3]]
}

// ================================================== [50]
//     END
// ================================================== [50]