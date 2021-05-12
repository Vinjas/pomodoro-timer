function secondsToPercent(base) { // add second argument
    var resultMultiples = [] 

    for(let i = 0; i <= 1; i = i + 0.01) {
            resultMultiples.push(Math.floor(base * i))
    }
  
    return resultMultiples;
    
}

//console.log(secondsToPercent(60))

export default secondsToPercent
