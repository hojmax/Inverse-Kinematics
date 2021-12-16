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
        ctx: undefined
    },
    goal: {
        x: 45,
        y: 45
    },
    mouseIsClicked: false,
    doGradientDescent: false,
    colorAmount: 100,
    pathHistory: [],
    shouldDrawPath: false,
}

const clearPathHistory = () => {
    state.pathHistory = []
}

const addToPath = (angles) => {
    state.pathHistory.push(anglesToPoint({
        angles,
        width: state.plot.canvasSize,
        height: state.plot.canvasSize
    }))
}

const setArmCtx = (newCtx) => {
    state.arm.ctx = newCtx;
}

const setPlotCtx = (newCtx) => {
    state.plot.ctx = newCtx;
}

const setDoGradientDescent = (bool) => {
    if (!bool) clearPathHistory()
    state.doGradientDescent = bool
}

const setGoal = (newGoal) => {
    if (_.isEqual(newGoal, state.goal)) return
    state.goal = newGoal
    setLossGrid(getLossGrid(state))
    drawAll()
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
    drawAll()
}

const setAngles = (newAngles) => {
    if (_.isEqual(newAngles, state.arm.angles)) return
    state.arm.angles = newAngles
    setJoints(getArmJoints(state))
    drawAll()
}

const setMouseIsClicked = (bool) => {
    if (bool) clearPathHistory()
    state.mouseIsClicked = bool
}