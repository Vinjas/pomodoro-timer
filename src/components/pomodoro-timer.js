import React from "react"

import "./pomodoro-timer.css"

class Pomodoro extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: {
                m: 25,
                s: 15,
            },   
        }
        this.startTimer = this.startTimer.bind(this)
        this.countdown = this.countdown.bind(this)
        this.pauseTimer = this.pauseTimer.bind(this)

    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60))

        let divisor_for_minutes = secs % (60 * 60)
        let minutes = Math.floor(divisor_for_minutes / 60)

        let divisor_for_seconds = divisor_for_minutes % 60
        let seconds = Math.ceil(divisor_for_seconds)

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds,
        }
        return obj
    }

    startTimer() {
        setInterval(this.countdown, 1000)
    }

    pauseTimer() {
        clearInterval(this.startTimer())
    }

    countdown() {
        let seconds = this.state.time.s - 1
        this.setState ({
            time: {
                m: this.state.time.m,
                s: seconds,
            }
        })
    }

    render() {
        return (
            <div id="timer-app">
                <div id="set-time-row">
                    <div id="session">
                        <button>Up time</button>
                        <button>Down time</button>
                    </div>
                    <div id="breaks">
                        <button>Up time</button>
                        <button>Down time</button>
                    </div>
                </div>
                <div id="timer">
                    {this.state.time.m} : {this.state.time.s}
                </div>
                <div id="buttons">
                    <button
                    onClick={this.startTimer}>Play</button>

                    <button
                    onClick={this.pauseTimer}>Pause</button>
                </div>
            </div>
        )
    }
}

export default Pomodoro