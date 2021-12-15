const drawArmCanvas = () => {
  clearCanvas('arm-canvas')
  drawArm(state)
  drawCross({
    id: 'arm-canvas',
    crossScale: 5,
    lineWidth: 2,
    point: state.goal,
    color: 'red'
  })
}

const drawPlotCanvas = () => {
  drawPlot(state)
  drawCross({
    id: 'plot-canvas',
    crossScale: 2.5,
    lineWidth: 1,
    point: anglesToPoint({
      angles: state.angles,
      width: state.plotCanvasSize,
      height: state.plotCanvasSize
    }),
    color: 'white'
  })
}

const drawAll = () => {
  drawArmCanvas()
  drawPlotCanvas()
}
const initiateSlider = (index) => {
  const sliderElement = document.getElementById(`slider-${index}`)
  sliderElement.addEventListener("input", () => {
    let newSegments = [...state.segments]
    newSegments[index] = Number.parseFloat(sliderElement.value)
    setSegments(newSegments)
  })
}

const getCanvasMousePosition = (event, scalar = 1) => {
  const rect = event.target.getBoundingClientRect()
  const x = (event.clientX - rect.left) / scalar
  const y = (event.clientY - rect.top) / scalar
  return { x, y }
}

document.getElementById("plot-canvas").addEventListener("mousemove", (event) => {
  const mouseIsDown = event.buttons === 1
  setMouseIsClicked(mouseIsDown)
  if (!mouseIsDown) return
  const { x, y } = getCanvasMousePosition(event, 2)
  const newAngles = pointToAngles({ point: { x, y }, width: state.plotCanvasSize, height: state.plotCanvasSize })
  setAngles(newAngles)
})

document.getElementById("arm-canvas").addEventListener("mousemove", (event) => {
  const mouseIsDown = event.buttons === 1
  setMouseIsClicked(mouseIsDown)
  if (!mouseIsDown) return
  const { x, y } = getCanvasMousePosition(event)
  setGoal({ x, y })
})

window.addEventListener('mouseup', (e) => {
  setMouseIsClicked(false)
})

initiateSlider(0)
initiateSlider(1)
setLossGrid(getLossGrid(state))
drawAll()