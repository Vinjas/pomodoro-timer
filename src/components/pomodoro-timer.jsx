import React from "react"

import secondsToTime from "../utils/secondsToTime.js"
import "./pomodoro-timer.css"

class Pomodoro extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timeSession: {
                m: 0,
                s: 0,
            }, 
            totalSeconds: 1500,
            breakSession: 5,
        }
        this.startTimer = this.startTimer.bind(this)
        this.countdown = this.countdown.bind(this)

    }

    componentDidMount() {
        this.setState ({
            timeSession: secondsToTime(this.state.totalSeconds)
        })
    }

    startTimer() {
        setInterval(this.countdown, 1000)
    }

    countdown() {
        let seconds = this.state.timeSession.s - 1
        this.setState ({
            timeSession: {
                m: this.state.timeSession.m,
                s: seconds,
            }
        })
    }

    render() {
        return (
            <div id="timer-app">
                <div id="set-time-row">
                    
                    <div 
                    id="session"
                    className="setTime">
                        <p>Session time</p>
                        <div 
                        id="time-session"
                        className="setButtons">
                            <button>Up time</button>
                            <p>{this.state.timeSession.m}</p>
                            <button>Down time</button>
                        </div>

                    </div>
                    
                    <div 
                    id="breaks"
                    className="setTime">
                        <p>Break time</p>
                        <div 
                        id="break-session"
                        className="setButtons">
                            <button>Up time</button>
                            <p>{this.state.breakSession}</p>
                            <button>Down time</button>
                        </div>

                    </div>

                </div>
                <div id="timer">
                    {this.state.timeSession.m} : {this.state.timeSession.s}
                </div>
                <div id="playPause">
                    <button
                    onClick={this.startTimer}>Play/Pause</button>
                </div>
            </div>
        )
    }
}

export default Pomodoro