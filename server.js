const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const database = require('better-sqlite3')

//var md5 = require('md')
const fs = require('fs')

const logdb = require('./database.js')

const args = require('minimist')(process.argv.slice(2))
args['port', 'debug', 'log', 'help']
var port = args.port || process.env.PORT || 5000

// console.log(args)
// Store help text 
const help = (`
server.js [options]
--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help	Return this message and exit.
`)

// If --help or -h, echo help text to STDOUT and exit
if (args.help || args.h) {
  console.log(help)
  process.exit(0)
}

if (args.log == 'false') {
  //throw new Error("access file not created")
  console.log("access file not created")
} else {
  // Use morgan for logging to files
  // Create a write stream to append (flags: 'a') to a file
  const createAccessLog = fs.createWriteStream('access.log', { flags: 'a' })
  // Set up the access logging middleware
  app.use(morgan('combined', { stream: createAccessLog }))
}

app.use((req, res, next) => {
    let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status: res.statusCode,
    referer: req.headers['referer'],
    useragent: req.headers['user-agent']
  }
  console.log(logdata)
    const stmt = logdb.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent)
    next();
})

//const ifDebug = args.debug || false || args.d
if (args.debug || args.d || false) {
  app.get('/app/log/access/', (req, res) => {
    const stmt = logdb.prepare('SELECT * FROM accesslog').all();
    res.status(200).json(stmt)
  })
  app.get('./app/error/', (req, res) => {
    throw new Error("Error test works.");
  })
  }

  // Start an app server
const server = app.listen(port, () => {
  console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

  app.use(function(req, res){
    res.status(404).send("404 NOT FOUND")
    res.type("text/plain")
  });
  
  app.get('/app/flip/', (req, res) => {
      res.status(200).json({'flip':coinFlip()});
  });
  
  app.get('/app/flips/:number', (req, res) => {
      const flips = coinFlips(req.params.number);
      res.status(200).json({'raw':flips, 'summary':countFlips(flips)});
  })
  
  app.get('/app/flip/call/heads', (req, res) => {
      res.status(200).json(flipACoin('heads'));
  })
  
  app.get('/app/flip/call/tails', (req, res) => {
      res.status(200).json(flipACoin('tails'));
  })
  
  app.get('/app/', (req, res) => {
      // Respond with status 200
          res.statusCode = 200;
      // Respond with status message "OK"
          res.statusMessage = 'OK';
          res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
          res.end(res.statusCode+ ' ' +res.statusMessage)
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

      // Default response for any other request