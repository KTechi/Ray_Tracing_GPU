// ================================================== [50]
//     Definition

'use strict'

// ================================================== [50]
//     Animation

// let animation = setInterval(repeat, 100)
// setTimeout(stop, 1 * 1000)
// function repeat() {
//     console.log('Animation')
// }
// function stop() {
//     clearInterval(animation)
//     console.log('Animation STOP')
// }

// ================================================== [50]
//     Scroll Listener

document.addEventListener('mousewheel', mousewheel, { passive: false })
function mousewheel(event) {
    // Disable scroll event
    event.preventDefault()
    
    // yaw   = (yaw   - 0.01 * event.deltaX) % (2*Math.PI)
    // pitch = (pitch - 0.01 * event.deltaY)
    // if (pitch < -Math.PI / 2) pitch = -Math.PI / 2
    // if ( Math.PI / 2 < pitch) pitch =  Math.PI / 2

    const q_x = new_Quaternion(-.005 * event.deltaX, [0, 0, 1])
    const q_y = new_Quaternion(-.005 * event.deltaY, [1, 0, 0])
    const q = qMultiply(q_y, q_x)
    g_q = qMultiply(q, g_q)
    torus[1] = g_q

    paint()
}

// ================================================== [50]
//     Mouse Event

//canvas.addEventListener('click'    , click    , false)
canvas.addEventListener('dblclick' , dblclick , false)
//canvas.addEventListener('mousedown', mousedown, false)
//canvas.addEventListener('mouseup'  , mouseup  , false)
function click(event) {
    console.log('Mouse Click:', event.button)
}
function dblclick(event) {
    if (document.pointerLockElement === null)
        canvas.requestPointerLock()
    else
        document.exitPointerLock()
}
function mousedown(event) {}
function mouseup(event) {}

// ====

//canvas.addEventListener('mouseenter' , mouseenter, false)
//canvas.addEventListener('mouseleave' , mouseleave, false)
//canvas.addEventListener('mouseover'  , mouseover , false)
//canvas.addEventListener('mouseout'   , mouseout  , false)
//canvas.addEventListener('contextmenu', contextmenu, false)
function mouseenter(event) {}
function mouseleave(event) {}
function mouseover(event) {}
function mouseout(event) {}
function contextMenu(event) {}

// ====

canvas.addEventListener('mousemove', mousemove, false)
function mousemove(event) {
    if (document.pointerLockElement === canvas) {
        const q_x = new_Quaternion(-.002 * event.movementX, [0, 0, 1])
        const q_y = new_Quaternion(-.002 * event.movementY, crossProduct(screen, [0, 0, 1]))
        const q = qMultiply(q_y, q_x)
        screen = q2v(qRotation(screen, q))
        screen = normalize_(screen)
        paint()
    }
    
    if (event.buttons === 1) {
        // console.log('drag')
    }
}

// ================================================== [50]
//     Key Listener

// document.addEventListener('keypress', keypress, false)
// document.addEventListener('keydown' , keydown , false)
// document.addEventListener('keyup'   , keyup   , false)
function keypress(event) {}
function keydown(event) {}
function keyup(event) {}

// ================================================== [50]
//     Drop Listener

// document.addEventListener('DOMContentLoaded', addDropListener, { passive: false })
function addDropListener(event) {
    const dropArea = document.body

    dropArea.addEventListener('dragover', function (e) {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
    })

    dropArea.addEventListener('drop', function (e) {
        e.preventDefault()
        for (const file of e.dataTransfer.files) {
            if (!file || file.type.indexOf('text/') < 0) continue
            const fr = new FileReader()
            fr.readAsText(file)
            fr.onload = () => { importData(fr.result) }
        }
    })
}

// System -> User
function download(file) {
    const file_extension = file.name.split('.').slice(-1)[0]
    const file_name = file.name + (file_extension === 'txt' ? '' : '.txt' )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(file)
    a.download = file_name
    a.click()
}

// String -> System
function importData(str) {
    if (!confirm('Overwrite?')) return

    for (const row of str.split('\n')) {
        for (const token of row.split(' ')) {
            if (token === '') continue
            console.log(token)
        }
        console.log(' ')
    }
    paint()
}

// ================================================== [50]
//     END
// ================================================== [50]
