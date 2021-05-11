import React from "react"
import Chart from "react-apexcharts"

import {secondsToTime, secondsToTimeNoZeroes} from "../utils/secondsToTime.js"
import "./pomodoro-timer.css"

var intervalID

class Pomodoro extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timeSession: {
                m: 0,
                s: 0,
            }, 
            breakSession: {
                m: 0,
                s: 0,
            },
            totalSeconds: 10,
            startSeconds: 0,
            breakSeconds: 5,
            startBreakSeconds: 0,
            timerOn: false,
            startSession: {},
            startBreak: {},
            endSession: false,
            totalSessions: 0,
        }
        this.startTimer = this.startTimer.bind(this)
        this.countdown = this.countdown.bind(this)
        
        this.upTimeSession = this.upTimeSession.bind(this)
        this.downTimeSession = this.downTimeSession.bind(this)

        this.upTimeBreak = this.upTimeBreak.bind(this)
        this.downTimeBreak = this.downTimeBreak.bind(this)
    }
    // UPDATE TOTAL SECONDS ON FIRST MOUNT
    componentDidMount() {
        this.setState ({
            timeSession: secondsToTime(this.state.totalSeconds),
            breakSession: secondsToTime(this.state.breakSeconds),
            startSession: secondsToTimeNoZeroes(this.state.totalSeconds),
            startBreak: secondsToTimeNoZeroes(this.state.breakSeconds),
            startSeconds: this.state.totalSeconds,
            startBreakSeconds: this.state.breakSeconds,
        })
    }

    // CHECK WHEN SESSION AND BREAK ENDS, ADD 1 SESSION AND CHANGE BETWEEN THEM
    componentDidUpdate() {
        if(this.state.totalSeconds === 0 && this.state.endSession === false) {
            this.setState({
                totalSessions: this.state.totalSessions + 1,
                endSession: true,
                totalSeconds: this.state.startSeconds
            })
        } else if (this.state.breakSeconds === 0 && this.state.endSession === true) {
            this.setState({
                endSession: false,
                breakSeconds: this.state.startBreakSeconds
            })
        }
    }

    // START AND STOP BUTTON FOR THE INTERVAL
    startTimer() {
        if(intervalID) {
            clearInterval(intervalID)
        }
        if(this.state.startSeconds !== this.state.totalSeconds || this.state.breakSeconds !== this.state.startBreakSeconds) {
            this.setState ({
                totalSeconds: this.state.startSeconds,
                startSession: secondsToTimeNoZeroes(this.state.startSeconds),
                breakSeconds: this.state.startBreakSeconds,
                breakSession: secondsToTimeNoZeroes(this.state.startBreakSeconds),
            })
        }
        if(this.state.timerOn === false) {
            this.setState ({
                timerOn: true,
            })
            intervalID = setInterval(this.countdown, 1000)
        } else {
            this.setState ({
                timerOn: false,
            })
            clearInterval(intervalID)    
        }
    }

    // DEFINE INTERVAL AND PAUSE, DEPENDING IF ON SESSION OR ON BREAK
    countdown() {
        if(this.state.endSession === true) {
            if(this.state.timerOn === true) {
                this.setState ({
                    breakSeconds: this.state.breakSeconds - 1,
                    breakSession: secondsToTime(this.state.breakSeconds - 1)
                })
            } else {
                this.setState ({
                    breakSeconds: this.state.breakSeconds,
                    breakSession: secondsToTime(this.state.breakSeconds)
                })
            }
        } else {
            if(this.state.timerOn === true) {
                this.setState ({
                    totalSeconds: this.state.totalSeconds - 1,
                    timeSession: secondsToTime(this.state.totalSeconds - 1)
                })
            } else {
                this.setState ({
                    totalSeconds: this.state.totalSeconds,
                    timeSession: secondsToTime(this.state.totalSeconds)
                })
            }
        }
    }

    // BUTTONS FOR ADJUSTING SESSION TIME
    upTimeSession() {
        this.setState ({
            startSeconds: this.state.startSeconds + 60,
            startSession: secondsToTimeNoZeroes(this.state.startSeconds + 60) 
        })
    }
    downTimeSession() {
        if(this.state.startSeconds > 60) {
            this.setState ({
                startSeconds: this.state.startSeconds - 60,
                startSession: secondsToTimeNoZeroes(this.state.startSeconds - 60),
            })
        }
    }
 
    // BUTTONS FOR ADJUSTING BREAK TIME
    upTimeBreak() {
        this.setState ({
            startBreakSeconds: this.state.startBreakSeconds + 60,
            startBreak: secondsToTimeNoZeroes(this.state.startBreakSeconds + 60),
        })
    }
    downTimeBreak() {
        if(this.state.startBreakSeconds > 60) {
            this.setState ({
                startBreakSeconds: this.state.startBreakSeconds - 60,
                startBreak: secondsToTimeNoZeroes(this.state.startBreakSeconds - 60),
            })
        }
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
                            <button
                            className="buttonUpTime"
                            onClick={this.upTimeSession}>Up time</button>
                            
                            <p>{this.state.startSession.m}</p>

                            <button
                            className="buttonDownTime"
                            onClick={this.downTimeSession}>Down time</button>
                        </div>

                    </div>
                    
                    <div 
                    id="breaks"
                    className="setTime">
                        <p>Break time</p>
                        <div 
                        id="break-session"
                        className="setButtons">
                            <button
                            onClick={this.upTimeBreak}>Up time</button>

                            <p>{this.state.startBreak.m}</p>

                            <button
                            onClick={this.downTimeBreak}>Down time</button>
                        </div>

                    </div>

                </div>
                
                <div id="timer">
                {this.state.endSession ? this.state.breakSession.m : this.state.timeSession.m}
                 : {this.state.endSession ? this.state.breakSession.s : this.state.timeSession.s}
                </div>

                <div id="playPause">
                    <button
                    onClick={this.startTimer}>Play/Pause</button>
                </div>

                <div id="numberOfSessions">
                    <p>Total Sessions: {this.state.totalSessions}</p>
                </div>

            </div>
        )
    }
}

export default Pomodoro