import React from "react"

import Pomodoro from "../components/pomodoro-timer"
import RadialChart from "../components/radialChart"

class PomodoroContainer extends React.Component {
    render() {
        return(
            <div>
                <Pomodoro />
                <RadialChart />
            </div>
        )
    }
}

export default PomodoroContainer 