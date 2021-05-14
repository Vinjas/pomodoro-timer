import React from "react"
import Chart from "react-apexcharts"
import { Helmet } from "react-helmet"

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
            totalSeconds: 1500,
            startSeconds: 0,
            
            breakSeconds: 300,
            startBreakSeconds: 0,

            timerOn: false,
            
            startSession: {},
            startBreak: {},

            onBreak: false,

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
        if(this.state.totalSeconds === 0 && this.state.onBreak === false) {
            this.setState({
                totalSessions: this.state.totalSessions + 1,
                onBreak: true,
                percentage: 100,
                totalSeconds: this.state.startSeconds
            })
            multiplesOfSeconds = secondsToPercent(this.state.startBreakSeconds)
        } else if (this.state.breakSeconds === 0 && this.state.onBreak === true) {
            this.setState({
                onBreak: false,
                percentage: 100,
                breakSeconds: this.state.startBreakSeconds
            })
            multiplesOfSeconds = secondsToPercent(this.state.startSeconds)
        }
    }

    // START AND STOP BUTTON FOR THE INTERVAL
    startTimer() {
        if (this.state.onSession === false) {
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
        if(this.state.onBreak === true) {
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
        if (this.state.onBreak) {
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
        if(this.state.startSeconds > 120 && this.state.onSession === false) {
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
        if(this.state.startBreakSeconds > 120 && this.state.onSession === false) {
            this.setState ({
                startBreakSeconds: this.state.startBreakSeconds - 60,
                startBreak: secondsToTimeNoZeroes(this.state.startBreakSeconds - 60),
            })
        }
    }

    resetState() {
        if(this.state.timerOn) {
            this.startTimer()
        }

        this.setState ({
            // CHANGE INITIAL SECOND TO 25 + 5
            totalSeconds: 120,
            breakSeconds: 100,
            // #############################

            onSession: false,

            onBreak: false,

            percentage: 100,
            totalSessions: 0,

            timeSession: secondsToTime(this.state.startSeconds),
            breakSession: secondsToTime(this.state.startBreakSeconds),

            startSession: secondsToTimeNoZeroes(this.state.startSeconds),
            startBreak: secondsToTimeNoZeroes(this.state.startBreakSeconds),

            startSeconds: this.state.startSeconds,
            startBreakSeconds: this.state.startBreakSeconds,
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
                colors: ["#fff"], 
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: '85%',
                        },
                        track: {
                            background: '#FF9090',
                            strokeWidth: '100%',
                            margin: 0, // margin is in pixels

                          },
                        dataLabels: {
                            show: true,
                            name: {
                                show: true,
                                offsetY: 20,
                                color: "#fff",
                                fontSize: "40px",
                                fontFamily: "Spartan",
                                fontWeight: 'thin',
                            },
                            value: {
                                show: false,
                            }
                        },
                    },
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
                colors: ["#fff"], 
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: '85%',
                        },
                        track: {
                            background: '#AAE5DB',
                            strokeWidth: '100%',
                            margin: 0, // margin is in pixels

                          },
                        dataLabels: {
                            show: true,
                            name: {
                                show: true,
                                offsetY: 20,
                                color: "#fff",
                                fontSize: "40px",
                                fontFamily: "Spartan",
                                fontWeight: 'thin',
                            },
                            value: {
                                show: false,
                            }
                        },
                    },
                },
                stroke: {
                    lineCap: "round"
                },
                labels: [this.state.breakSession.m + ":" + this.state.breakSession.s],
            },
        }

        return (
            <div id="timer-app">               
                <Helmet>
                    {this.state.onBreak 
                    ?
                    <style>
                        {"body {background: linear-gradient(180deg, #2DF5C5 0%, #37EC5F 90.55%), #FC5045;; height: 100%; margin: 0; background-repeat: no-repeat; background-attachment: fixed;}"}
                    </style>
                    :
                    <style>
                        {"body {background: linear-gradient(180deg, #FB5945 0%, #F53447 90.55%), #FC5045; height: 100%; margin: 0; background-repeat: no-repeat; background-attachment: fixed;}"}
                    </style>
                    }


                </Helmet>               
                
                <div id="app">
                    <div id="sessionOrBreak">
                        {this.state.onBreak
                        ? "Take a break"
                        : "Focus on your task"}
                    </div>

                    <div id="set-time-row">
                        
                        <div 
                        id="session"
                        className="setTime">
                            Work
                            <div 
                            id="time-session"
                            className="setButtons">
                                <button
                                className="buttonsSetTime"
                                onClick={this.upTimeSession}>
                                    {this.state.onSession ? "" :
                                    <svg 
                                    aria-hidden="true" focusable="false" data-prefix="fas" 
                                    data-icon="arrow-up" className="svg-inline--fa fa-arrow-up fa-w-14" role="img" 
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="#FF9090" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path>
                                    </svg>}
                                
                                </button>
                                
                                {this.state.startSession.m}:00

                                <button
                                className="buttonsSetTime"
                                onClick={this.downTimeSession}>
                                    {this.state.onSession ? "" :
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" 
                                    data-icon="arrow-down" className="svg-inline--fa fa-arrow-down fa-w-14" role="img" 
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="#FF9090" d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
                                    </svg>}                            
                                </button>
                            </div>

                        </div>
                        
                        <div 
                        id="breaks"
                        className="setTime">
                            Break
                            <div 
                            id="break-session"
                            className="setButtons">
                                <button
                                className="buttonsSetTime"
                                onClick={this.upTimeBreak}>
                                    {this.state.onSession ? "" :
                                    <svg 
                                    aria-hidden="true" focusable="false" data-prefix="fas" 
                                    data-icon="arrow-up" className="svg-inline--fa fa-arrow-up fa-w-14" role="img" 
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="#FF9090" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path>
                                    </svg>}
                                </button>

                                {this.state.startBreak.m}:00

                                <button
                                className="buttonsSetTime"
                                onClick={this.downTimeBreak}>
                                    {this.state.onSession ? "" :
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" 
                                    data-icon="arrow-down" className="svg-inline--fa fa-arrow-down fa-w-14" role="img" 
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="#FF9090" d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
                                    </svg>}                            
                                </button>
                            </div>

                        </div>

                    </div>

                    <div id="chart">
                        {this.state.onBreak 
                        ? <Chart 
                            options={chartBreak.options} 
                            series={chartOptions.series} 
                            type="radialBar" 
                            height={300} />
                        : <Chart 
                            options={chartOptions.options} 
                            series={chartOptions.series} 
                            type="radialBar" 
                            height={300} />}
                    </div>

                    <div id="roundAndPlay">
                        <div id="numberOfSessions">
                            Round {this.state.totalSessions}
                        </div>   

                        <div id="playPause">
                            <button
                            id="playButton"
                            onClick={this.startTimer}>
                                {this.state.timerOn
                                ?
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pause" className="svg-inline--fa fa-pause fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#F63846" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path></svg>
                                :
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" className="svg-inline--fa fa-play fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#F63846" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
                                }
                            
                            </button>
                        </div>         
                    </div>            
                    
                </div>

                <div id="footbar">
                    <div id="footbarItems">
                        <button
                        id="resetButton"
                        onClick={this.resetState}>
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" 
                            data-icon="sync-alt" className="svg-inline--fa fa-sync-alt fa-w-16" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="#C2C2C2" 
                                d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"></path>
                            </svg>
                            Reset                        
                        </button>

                        <button
                        id="uselessButton"
                        ></button>
                    </div>
                </div>


            </div>
        )
    }
}

export default Pomodoro