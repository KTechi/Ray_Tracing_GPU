// ================================================== [50]
//     Main

'use strict'

function paint() {
    // Quaternion
    const q_p = new Quaternion(pitch, new Vector(1, 0, 0))
    const q_r = new Quaternion(roll , new Vector(0, 1, 0))
    const q_y = new Quaternion(yaw  , new Vector(0, 0, 1))
    const q = qMultiply(qMultiply(q_r, q_p), q_y)

    // GPU
    run([q.w, q.x, q.y, q.z])
}

// ================================================== [50]
//     Window

window.onload = load
window.onresize = resize
function load() {
    document.body.append(canvas)
    resize()
    console.log('Ready')
}
function resize() {
    VW = parseInt(scale * canvas.clientWidth)
    VH = parseInt(scale * canvas.clientHeight)
    canvas.width  = VW
    canvas.height = VH
    run = initGPU()
    paint()
}
function isMobile() {
    const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    return window.navigator.userAgent.search(regexp) !== -1
}

// ================================================== [50]
//     END
// ================================================== [50]