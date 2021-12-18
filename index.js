const drawArmCanvas = () => {
  state.arm.ctx.clearRect(0, 0, state.arm.canvasSize, state.arm.canvasSize)
  state.arm.ctx.save()
  state.arm.ctx.translate(state.arm.root.x, state.arm.root.y)
  drawArm(state)
  drawCross({
    crossScale: 5,
    lineWidth: 2,
    point: state.goal,
    color: 'red',
    ctx: state.arm.ctx
  })
  state.arm.ctx.restore()
}

const drawPlotOverlay = () => {
  state.plot.overlay.ctx.clearRect(
    0,
    0,
    state.plot.overlay.canvasSize,
    state.plot.overlay.canvasSize
  )
  if (state.shouldDrawPath) drawPath(state)
  drawCross({
    crossScale: 5,
    lineWidth: 2,
    point: anglesToPoint({
      angles: state.arm.angles,
      width: state.plot.overlay.canvasSize,
      height: state.plot.overlay.canvasSize
    }),
    color: 'white',
    ctx: state.plot.overlay.ctx
  })
}

const drawAll = () => {
  drawArmCanvas()
  drawPlot(state)
  drawPlotOverlay()
}

const sliderListener = (index) => {
  const sliderElement = document.getElementById(`slider-${index}`)
  sliderElement.addEventListener("input", () => {
    let newSegments = [...state.arm.segments]
    newSegments[index] = Number.parseFloat(sliderElement.value)
    if (index === 0) newSegments[index] += 0.1
    setSegments(newSegments)
  })
}

const canvasListener = (id, action) => {
  document.getElementById(id).addEventListener("mousemove", action)
  document.getElementById(id).addEventListener("mousedown", event => {
    action(event)
    drawPlotOverlay()
  })
}

window.addEventListener('mouseup', (e) => {
  setMouseIsClicked(false)
})

let lastTime
const fps = 60

const animateGradientDescent = (time) => {
  if (!lastTime) lastTime = time
  const delta = time - lastTime
  window.requestAnimationFrame(animateGradientDescent)
  if (delta <= 1000 / fps) return
  lastTime = time
  if (!state.doGradientDescent || state.mouseIsClicked) return
  const gradient = getGradient(state)
  const newAngles = state.arm.angles.map((e, i) => boundAngle(e - gradient[i] * state.learningRate))
  addToPath(newAngles)
  setAngles(newAngles)
}

window.requestAnimationFrame(animateGradientDescent)

const setup = () => {
  sliderListener(0)
  sliderListener(1)
  canvasListener('arm-canvas', event => {
    const mouseIsDown = event.buttons === 1
    if (!mouseIsDown) return
    const { x, y } = getCanvasMousePosition(event)
    setGoal({ x: x - state.arm.root.x, y: y - state.arm.root.y })
  })
  canvasListener('plot-canvas-overlay', event => {
    const mouseIsDown = event.buttons === 1
    if (!mouseIsDown) return
    const { x, y } = getCanvasMousePosition(event)
    const newAngles = pointToAngles({
      point: { x, y },
      width: state.plot.overlay.canvasSize,
      height: state.plot.overlay.canvasSize
    })
    //hmm
    setAngles(newAngles)
    setMouseIsClicked(true)
  })
  document.getElementById('gradient-switch').addEventListener('click', event => {
    setDoGradientDescent(event.target.checked)
  })
  document.getElementById('path-switch').addEventListener('click', event => {
    setShouldDrawPath(event.target.checked)
  })
  document.getElementById('learning-rate-slider').addEventListener("input", event => {
    setLearningRate(Math.pow(Number.parseFloat(event.target.value), 2) / 100000)
  })
  setLossGrid(getLossGrid(state))
  setJoints(getArmJoints(state))
  setArmCtx(getCtx('arm-canvas'))
  setPlotCtx(getCtx('plot-canvas'))
  setPlotOverlayCtx(getCtx('plot-canvas-overlay'))
  clearPathHistory()
  drawAll()
}

setup()
