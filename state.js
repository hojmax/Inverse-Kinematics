let state = {
    segments: [5, 5],
    angles: [0, -Math.PI / 4],
    goal: {
        x: 190,
        y: 190
    },
    armScale: 10,
    root: {
        x: 175,
        y: 175
    },
    armCanvasSize: 350,
    plotCanvasSize: 175,
    lossGrid: [],
    mouseIsClicked: false,
    doGradientDescent: false
}

const setGoal = (newGoal) => {
    state.goal = newGoal
    setLossGrid(getLossGrid(state))
    drawAll()
}

const setLossGrid = (newLossGrid) => {
    state.lossGrid = newLossGrid
}

const setSegments = (newSegments) => {
    state.segments = newSegments
    setLossGrid(getLossGrid(state))
    drawAll()
}

const setAngles = (newAngles) => {
    state.angles = newAngles
    drawAll()
}

const setMouseIsClicked = (bool) => {
    state.mouseIsClicked = bool
    console.log(state.mouseIsClicked)
}