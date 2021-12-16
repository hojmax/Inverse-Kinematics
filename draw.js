const interpolatedColors = createInterpolatedColors()

const drawLine = (p1, p2, ctx) => {
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

const drawArm = ({ arm }) => {
    arm.ctx.lineWidth = 10
    arm.ctx.strokeStyle = "rgba(50, 50, 50, 0.5)"
    for (let i = 0; i < arm.joints.length - 1; i++) {
        drawLine(arm.joints[i], arm.joints[i + 1], arm.ctx)
    }
}

const drawPath = ({ plot, pathHistory }) => {
    plot.ctx.setLineDash([1, 20]);
    for (let i = 0; i < pathHistory.length - 1; i++) {
        drawLine(pathHistory[i], pathHistory[i + 1], plot.ctx)
    }
    plot.ctx.setLineDash([]);
}

const drawCross = ({ point, crossScale, color, lineWidth, ctx }) => {
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

const drawPlot = ({ plot }) => {
    const img = plot.ctx.getImageData(0, 0, plot.canvasSize, plot.canvasSize)
    const pixels = img.data
    for (let y = 0; y < plot.canvasSize; y++) {
        for (let x = 0; x < plot.canvasSize; x++) {
            const index = Math.floor(plot.lossGrid[y][x] * state.colorAmount)
            const color = interpolatedColors[index]
            const offset = (y * plot.canvasSize + x) * 4
            pixels[offset] = color['r']
            pixels[offset + 1] = color['g']
            pixels[offset + 2] = color['b']
            pixels[offset + 3] = color['opacity'] * 255
        }
    }
    plot.ctx.putImageData(img, 0, 0)
}