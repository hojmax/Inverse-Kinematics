let state = {
    segments: [5, 5],
    angles: [-Math.PI/4, -Math.PI / 2],
    goal: {
        x: 190,
        y: 190
    },
    armScale: 9,
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
}