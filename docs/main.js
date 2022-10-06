// ================================================== [50]
//     Main

'use strict'

function paint() {
    // Quaternion
    const q_p = new_Quaternion(pitch, [1, 0, 0])
    const q_r = new_Quaternion(roll , [0, 1, 0])
    const q_y = new_Quaternion(yaw  , [0, 0, 1])
    const q = qMultiply(qMultiply(q_r, q_p), q_y)

    const screen_pos = world(camera, 500, screen)
    const upVector = [0, 0, 1]
    let screenX = crossProduct(screen, upVector)
    let screenY = crossProduct(screen, screenX)
    screenX = normalize(screenX)
    screenY = normalize(screenY)
    for (let i = 0; i < 3; i++) {
        screenX[i] /= scale
        screenY[i] /= scale
    }
    const north_west = world2V(screen_pos, -VW/2, screenX, -VH/2, screenY)

    // GPU
    run(north_west, screenX, screenY, camera, light,
        torus[0], torus[1], torus[2], torus[3],
        pic[0], pic[1], pic[2])
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