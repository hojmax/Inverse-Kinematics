const drawArmCanvas = () => {
  state.arm.ctx.clearRect(0, 0, state.arm.canvasSize, state.arm.canvasSize)
  state.arm.ctx.save()
  state.arm.ctx.translate(state.arm.root.x, state.arm.root.y)
  drawArm(state)
  drawCross({
    id: 'arm-canvas',
    crossScale: 5,
    lineWidth: 2,
    point: state.goal,
    color: 'red',
    ctx: state.arm.ctx
  })
  state.arm.ctx.restore()
}

const drawPlotCanvas = () => {
  drawPlot(state)
  drawCross({
    id: 'plot-canvas',
    crossScale: 2.5,
    lineWidth: 1,
    point: anglesToPoint({
      angles: state.arm.angles,
      width: state.plot.canvasSize,
      height: state.plot.canvasSize
    }),
    color: 'white',
    ctx: state.plot.ctx
  })
}

const drawAll = () => {
  drawArmCanvas()
  drawPlotCanvas()
  drawPath(state)
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

const getCanvasMousePosition = (event, scalar = 1) => {
  const rect = event.target.getBoundingClientRect()
  const x = (event.clientX - rect.left) / scalar
  const y = (event.clientY - rect.top) / scalar
  return { x, y }
}

const canvasListener = (id, action) => {
  document.getElementById(id).addEventListener("mousemove", action)
  document.getElementById(id).addEventListener("mousedown", action)
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
  const learningRate = 0.00004
  const newAngles = state.arm.angles.map((e, i) => boundAngle(e - gradient[i] * learningRate))
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
  canvasListener('plot-canvas', event => {
    const mouseIsDown = event.buttons === 1
    setMouseIsClicked(mouseIsDown)
    if (!mouseIsDown) return
    const { x, y } = getCanvasMousePosition(event, 2)
    const newAngles = pointToAngles({
      point: { x, y },
      width: state.plot.canvasSize,
      height: state.plot.canvasSize
    })
    setAngles(newAngles)
  })
  document.getElementById('gradient-switch').addEventListener('click', event => {
    setDoGradientDescent(event.target.checked)
  })
  setLossGrid(getLossGrid(state))
  setJoints(getArmJoints(state))
  setArmCtx(getCtx('arm-canvas'))
  setPlotCtx(getCtx('plot-canvas'))
  drawAll()
}

setup()
