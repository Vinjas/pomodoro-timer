function secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60))

    let divisor_for_minutes = secs % (60 * 60)
    let minutes = Math.floor(divisor_for_minutes / 60) + Math.floor(hours * 60)

    let divisor_for_seconds = divisor_for_minutes % 60
    let seconds = Math.ceil(divisor_for_seconds)

    var obj = {
        "m": minutes,
        "s": seconds,
    }
    
    if(obj.m < 10) {
        obj = {
            "m": "0" + minutes,
            "s": seconds,
        }
        if(obj.s < 10) {
            obj = {
                "m": "0" + minutes,
                "s": "0" + seconds,
            }
        }    
    } else if(obj.s < 10) {
        obj = {
            "m": minutes,
            "s": "0" + seconds,
        }
    }

    return obj
}

function secondsToTimeNoZeroes(secs) {
    let hours = Math.floor(secs / (60 * 60))

    let divisor_for_minutes = secs % (60 * 60)
    let minutes = Math.floor(divisor_for_minutes / 60) + Math.floor(hours * 60)

    let divisor_for_seconds = divisor_for_minutes % 60
    let seconds = Math.ceil(divisor_for_seconds)

    let obj = {
        "m": minutes,
        "s": seconds,
    }

    return obj
}


export {secondsToTime, secondsToTimeNoZeroes}