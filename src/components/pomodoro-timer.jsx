import React from "react"
import Chart from "react-apexcharts"

import {secondsToTime, secondsToTimeNoZeroes} from "../utils/secondsToTime.js"
import secondsToPercent from "../utils/secondsToPercent"
import "./pomodoro-timer.css"

var intervalID
var multiplesOfSeconds

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
            totalSeconds: 120,
            startSeconds: 0,
            
            breakSeconds: 100,
            startBreakSeconds: 0,

            timerOn: false,
            
            startSession: {},
            startBreak: {},

            endSession: false,

            onSession: false,

            percentage: 100,

            totalSessions: 0,
        }
        this.startTimer = this.startTimer.bind(this)
        this.countdown = this.countdown.bind(this)
        
        this.upTimeSession = this.upTimeSession.bind(this)
        this.downTimeSession = this.downTimeSession.bind(this)

        this.upTimeBreak = this.upTimeBreak.bind(this)
        this.downTimeBreak = this.downTimeBreak.bind(this)

        this.resetState = this.resetState.bind(this)
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
                percentage: 100,
                totalSeconds: this.state.startSeconds
            })
        } else if (this.state.breakSeconds === 0 && this.state.endSession === true) {
            this.setState({
                endSession: false,
                percentage: 100,
                breakSeconds: this.state.startBreakSeconds
            })
        }
    }

    // START AND STOP BUTTON FOR THE INTERVAL
    startTimer() {
        if (multiplesOfSeconds === undefined) {
            multiplesOfSeconds = secondsToPercent(this.state.startSeconds)
        }
        
        if(intervalID) {
            clearInterval(intervalID)
        }

        if(this.state.startSeconds !== this.state.totalSeconds && this.state.onSession === false) {
            this.setState ({
                totalSeconds: this.state.startSeconds,
                startSession: secondsToTimeNoZeroes(this.state.startSeconds),
            })
        }
        if(this.state.breakSeconds !== this.state.startBreakSeconds && this.state.onSession === false) {
            this.setState ({
                breakSeconds: this.state.startBreakSeconds,
                breakSession: secondsToTimeNoZeroes(this.state.startBreakSeconds),
            })
        }

        if(this.state.timerOn === false) {
            this.setState ({
                timerOn: true,
                onSession: true,
            })
            intervalID = setInterval(this.countdown, 100)
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
        // UPDATE RADICAL CHART PERCENTAGE
        if (this.state.endSession) {
            if (this.state.breakSeconds <= multiplesOfSeconds[this.state.percentage - 1]) {
                this.setState({
                    percentage: this.state.percentage - 1
                })
            }
        } else {
            if (this.state.totalSeconds <= multiplesOfSeconds[this.state.percentage - 1]) {
                this.setState({
                    percentage: this.state.percentage - 1
                })
        }
    }

    }

    // BUTTONS FOR ADJUSTING SESSION TIME
    upTimeSession() {
        if(this.state.onSession === false) {
            this.setState ({
                startSeconds: this.state.startSeconds + 60,
                startSession: secondsToTimeNoZeroes(this.state.startSeconds + 60) 
            })
        }
    }
    downTimeSession() {
        if(this.state.startSeconds > 60 && this.state.onSession === false) {
            this.setState ({
                startSeconds: this.state.startSeconds - 60,
                startSession: secondsToTimeNoZeroes(this.state.startSeconds - 60),
            })
        }
    }
 
    // BUTTONS FOR ADJUSTING BREAK TIME
    upTimeBreak() {
        if(this.state.onSession === false) {
            this.setState ({
                startBreakSeconds: this.state.startBreakSeconds + 60,
                startBreak: secondsToTimeNoZeroes(this.state.startBreakSeconds + 60),
            })
        }

    }
    downTimeBreak() {
        if(this.state.startBreakSeconds > 60 && this.state.onSession === false) {
            this.setState ({
                startBreakSeconds: this.state.startBreakSeconds - 60,
                startBreak: secondsToTimeNoZeroes(this.state.startBreakSeconds - 60),
            })
        }
    }

    resetState() {
        this.setState ({
            // CHANGE INITIAL SECOND TO 25 + 5
            totalSeconds: 100,
            breakSeconds: 110,
            // #############################
            timerOn: false,
            endSession: false,
            onSession: false,
            percentage: 100,
            totalSessions: 0,
            timeSession: secondsToTime(this.state.startSeconds),
            breakSession: secondsToTime(this.state.startBreakSeconds),
            startSession: secondsToTimeNoZeroes(this.state.startSeconds),
            startBreak: secondsToTimeNoZeroes(this.state.startBreakSeconds),
            startSeconds: this.state.totalSeconds,
            startBreakSeconds: this.state.breakSeconds,
        })
    }

    render() {
        // DEFINE RADIAL CHART PROPERTIES
        const chartOptions = {
            series: [this.state.percentage],            
            
            options: {
                chart: {
                    height: 350,
                    type: 'radialBar',
                },
                
                colors: ["#20E647"],
                
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: '70%',
                            background: '#fff',
                            image: undefined,
                            imageOffsetX: 0,
                            imageOffsetY: 0,
                            position: 'front',

                        },
                        dataLabels: {
                            show: true,
                            name: {
                                show: true,
                                offsetY: 15,
                                color: "#888",
                                fontSize: "50px"
                            },
                            value: {
                                show: true,
                            }
                        },
                    },
                },
                fill: {
                    type: "gradient",
                    gradient: {
                      shade: "dark",
                      type: "vertical",
                      gradientToColors: ["#87D4F9"],
                      stops: [0, 100]
                    }
                  },
                
                stroke: {
                    lineCap: "round"
                },

                labels: [this.state.timeSession.m + ":" + this.state.timeSession.s],
            },
        }
                      
        const chartBreak = {
            series: [this.state.percentage],
            
            options: {
                chart: {
                    height: 350,
                    type: 'radialBar',
                },
                
                colors: ["#d30808"],
                
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: '70%',
                            background: '#fff',
                            image: undefined,
                            imageOffsetX: 0,
                            imageOffsetY: 0,
                            position: 'front',

                        },
                        dataLabels: {
                            show: true,
                            name: {
                                show: true,
                                offsetY: 15,
                                color: "#888",
                                fontSize: "50px"
                            },
                            value: {
                                show: true,
                            }
                        },
                    },
                },
                fill: {
                    type: "gradient",
                    gradient: {
                      shade: "dark",
                      type: "vertical",
                      gradientToColors: ["#87D4F9"],
                      stops: [0, 100]
                    }
                  },
                
                stroke: {
                    lineCap: "round"
                },


                labels: [this.state.breakSession.m + ":" + this.state.breakSession.s],
            },
        }


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
                            
                            <p>{this.state.startSession.m}:00</p>

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

                            <p>{this.state.startBreak.m}:00</p>

                            <button
                            onClick={this.downTimeBreak}>Down time</button>
                        </div>

                    </div>

                </div>
                
                <div id="chart">
                    {this.state.endSession 
                    ? <Chart 
                        options={chartBreak.options} 
                        series={chartOptions.series} 
                        type="radialBar" 
                        height={350} />
                    : <Chart 
                        options={chartOptions.options} 
                        series={chartOptions.series} 
                        type="radialBar" 
                        height={350} />}
                </div>

                {/*<div id="timer">
                {this.state.endSession 
                    ? this.state.breakSession.m 
                    : <Chart 
                        options={chartOptions.options} 
                        series={chartOptions.series} 
                        type="radialBar" 
                        height={350} />}
                </div>*/}

                <div id="playPause">
                    <button
                    onClick={this.startTimer}>Play/Pause</button>
                </div>

                <div id="numberOfSessions">
                    <p>Total Sessions: {this.state.totalSessions}</p>
                </div>

                {/*<div id="chart">
                    <Chart 
                    options={chartOptions.options} 
                    series={chartOptions.series} 
                    type="radialBar" 
                    height={350} />
                </div> */}               

                <div>
                    <button
                    onClick={this.resetState}>Reset timer</button>
                </div>

            </div>
        )
    }
}

export default Pomodoro