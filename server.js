const express = require('express')
const app = express()
const myArgs = require('minimist')(process.argv.slice(2))
myArgs['port']
var HTTP_PORT = myArgs.port || 5000

// Start an app server
const server = app.listen(HTTP_PORT, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',HTTP_PORT))
});


/** Simple coin flip
 * 
 * Write a function that accepts no parameters but returns either heads or tails at random.
 * 
 * @param {*}
 * @returns {string} 
 * 
 * example: coinFlip()
 * returns: heads
 * 
 */

 function coinFlip() {
    return (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
  }
  
  /** Multiple coin flips
   * 
   * Write a function that accepts one parameter (number of flips) and returns an array of 
   * resulting "heads" or "tails".
   * 
   * @param {number} flips 
   * @returns {string[]} results
   * 
   * example: coinFlips(10)
   * returns:
   *  [
        'heads', 'heads',
        'heads', 'tails',
        'heads', 'tails',
        'tails', 'heads',
        'tails', 'heads'
      ]
   */
  
  function coinFlips(flips) {
    const amt = [];
    for (let i = 0; i < flips; i++) {
      amt[i] = coinFlip();
    }
    return amt;
  }
  
  /** Count multiple flips
   * 
   * Write a function that accepts an array consisting of "heads" or "tails" 
   * (e.g. the results of your `coinFlips()` function) and counts each, returning 
   * an object containing the number of each.
   * 
   * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
   * { tails: 5, heads: 5 }
   * 
   * @param {string[]} array 
   * @returns {{ heads: number, tails: number }}
   */
  
  function countFlips(array) {
    let numHeads = 0;
    let numTails = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] == "heads") {
        numHeads++;
      } else {
        numTails++;
      }
    }
    return { heads: numHeads, tails: numTails }
  
  }
  
  /** Flip a coin!
   * 
   * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
   * 
   * @param {string} call 
   * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
   * 
   * example: flipACoin('tails')
   * returns: { call: 'tails', flip: 'heads', result: 'lose' }
   */
  
  function flipACoin(call) {
    var flip = coinFlip();
    if (call == flip) {
      //return "{ call: '" + call + "', flip: '" + flip + "', result: 'win' }"
      return { call: call, flip: flip , result: "win" }
    } else {
      //return "{ call: '" + call + "', flip: '" + flip + "', result: 'lose' }"
      return { call: call, flip: flip , result: "lose" }
    }
  }
  
  
  /** Export 
   * 
   * Export all of your named functions
  */
  //export {coinFlip, coinFlips, countFlips, flipACoin}

app.get('/app/flip/', (req, res) => {
    res.json({'flip':coinFlip()});
});

app.get('/app/flips/:number', (req, res) => {
    const flips = coinFlips(req.params.number);
    res.json({'raw':flips, 'summary':countFlips(flips)});
})

app.get('/app/flip/call/heads', (req, res) => {
    res.json(flipACoin('heads'));
})

app.get('/app/flip/call/tails', (req, res) => {
    res.json(flipACoin('tails'));
})

app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
    });

    // Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});