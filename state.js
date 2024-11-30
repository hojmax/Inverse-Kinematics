let state = {
    arm: {
        segments: [50.1, 50],
        angles: [-Math.PI / 4, -Math.PI / 2],
        root: {
            x: 175,
            y: 175
        },
        joints: [],
        canvasSize: 350,
        ctx: undefined
    },
    plot: {
        canvasSize: 175,
        lossGrid: [],
        ctx: undefined,
        overlay: {
            ctx: undefined,
            canvasSize: 350,
        }
    },
    goal: {
        x: 45,
        y: 45
    },
    lastGradient: [],
    momentum: 0,
    learningRate: 0.00004,
    mouseIsClicked: false,
    doGradientDescent: true,
    shouldDrawPath: true,
    colorAmount: 100,
    pathHistory: [],
}

const setMomentum = (newMomentum) => {
    state.momentum = newMomentum
}

const setLastGradient = (newLastGradient) => {
    state.lastGradient = newLastGradient
}

const clearPathHistory = () => {
    state.pathHistory = [
        anglesToPoint({
            angles: state.arm.angles,
            width: state.plot.overlay.canvasSize,
            height: state.plot.overlay.canvasSize,
        })
    ]
}

const addToPath = (angles) => {
    state.pathHistory.push(anglesToPoint({
        angles,
        width: state.plot.overlay.canvasSize,
        height: state.plot.overlay.canvasSize
    }))
}

const setArmCtx = (newCtx) => {
    state.arm.ctx = newCtx;
}

const setPlotCtx = (newCtx) => {
    state.plot.ctx = newCtx;
}

const setPlotOverlayCtx = (newCtx) => {
    state.plot.overlay.ctx = newCtx;
}

const setDoGradientDescent = (bool) => {
    state.doGradientDescent = bool
}

const setShouldDrawPath = (bool) => {
    state.shouldDrawPath = bool;
    drawPlotOverlay()
}

const setGoal = (newGoal) => {
    if (_.isEqual(newGoal, state.goal)) return
    state.goal = newGoal
    setLossGrid(getLossGrid(state))
    drawArmCanvas()
    drawPlot(state)
    clearPathHistory()
    drawPlotOverlay()
}

const setLossGrid = (newLossGrid) => {
    state.plot.lossGrid = newLossGrid
}

const setJoints = (newJoints) => {
    state.arm.joints = newJoints
}

const setSegments = (newSegments) => {
    if (_.isEqual(newSegments, state.arm.segments)) return
    state.arm.segments = newSegments
    setJoints(getArmJoints(state))
    setLossGrid(getLossGrid(state))
    drawArmCanvas()
    drawPlot(state)
    clearPathHistory()
    drawPlotOverlay()
}

const setAngles = (newAngles) => {
    if (_.isEqual(newAngles, state.arm.angles)) return
    state.arm.angles = newAngles
    setJoints(getArmJoints(state))
    drawPlotOverlay()
    drawArmCanvas()
}

const setMouseIsClicked = (bool) => {
    if (bool) clearPathHistory()
    state.mouseIsClicked = bool
}

const setLearningRate = (newLearningRate) => {
    state.learningRate = newLearningRate
}
