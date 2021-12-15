const interpolatedColors = createInterpolatedColors()

const drawLine = (p1, p2, ctx) => {
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

const drawArm = ({ segments, angles, armScale, root }) => {
    const { ctx } = getCtx('arm-canvas')
    ctx.lineWidth = 10
    ctx.strokeStyle = "rgba(50, 50, 50, 0.5)"
    const joints = getArmJoints({ segments, angles, armScale, root })
    for (let i = 0; i < joints.length - 1; i++) {
        drawLine(joints[i], joints[i + 1], ctx)
    }
}
const drawCross = ({ point, crossScale, id, color, lineWidth }) => {
    const { ctx } = getCtx(id)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    drawLine({
        x: point.x - crossScale,
        y: point.y - crossScale
    }, {
        x: point.x + crossScale,
        y: point.y + crossScale
    }, ctx)
    drawLine({
        x: point.x - crossScale,
        y: point.y + crossScale
    }, {
        x: point.x + crossScale,
        y: point.y - crossScale
    }, ctx)
}

const drawPlot = ({ lossGrid }) => {
    const { ctx, width, height } = getCtx("plot-canvas")
    const img = ctx.getImageData(0, 0, width, height)
    const pixels = img.data
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = Math.floor((lossGrid[y][x]) * 100)
            const color = interpolatedColors[index]
            const offset = (y * width + x) * 4
            pixels[offset] = color['r']
            pixels[offset + 1] = color['g']
            pixels[offset + 2] = color['b']
            pixels[offset + 3] = color['opacity'] * 255
        }
    }
    ctx.putImageData(img, 0, 0)
}