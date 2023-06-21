// ================================================== [50]
//     Definition

'use strict'

const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true })
let gpu
let run
let scale = 1.0
let VW = window.innerWidth
let VH = window.innerHeight
let pitch = 0
let roll  = 0
let yaw   = 0
let g_q = [1, 0, 0, 0] // Global Quaternion

let camera = [-400, -400, 200]
let screen = [4, 4, -2]
screen = normalize_(screen)
let light = [0, 0, 1000000]

const torus = [
    [0, 0, 0],    // Origin Vector
    [1, 0, 0, 0], // Rotation Quaternion
    [.4, 1, 1],   // Material
    [200, 50],    // R, r
]
const pic = [
    [0, 0, -100], // Origin Vector
    [1, 0, 0, 0], // Rotation Quaternion
    [1, 1, 0],    // Material
]

// ================================================== [50]
//     END
// ================================================== [50]