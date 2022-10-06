// ================================================== [50]
//     Definition

'use strict'

const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl2')
let gpu
let run
let scale = 1.0
let VW = window.innerWidth
let VH = window.innerHeight
let pitch = 0
let roll  = 0
let yaw   = 0
let g_q = [1, 0, 0, 0] // Global Quaternion

// ================================================== [50]
//     END
// ================================================== [50]