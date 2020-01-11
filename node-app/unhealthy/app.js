const http = require('http');
const os = require('os');

console.log("Kubia server starting... (Unhealthy)");

var requestCount = 0;

var handler = function(request, response) {
    var ip = request.headers['x-forwarded-for'] || 
             request.connection.remoteAddress || 
             request.socket.remoteAddress ||
             (request.connection.socket ? request.connection.socket.remoteAddress : null);

    requestCount++;
    console.log("Receive request " + requestCount + " from " + ip);
    if ( requestCount > 5 ) {
        response.writeHead(500);
        response.end("Ops... I need to be restarted!");
        console.log("Result: HTTP 500 (Crash)");
        return;
    }
    response.writeHead(200);
    response.end("You've hit Hostname:" + os.hostname() + ", IP:" + ip + " [" + requestCount + "] " + "\n");
    console.log("Result: HTTP 200");
};

var www = http.createServer(handler);
www.listen(9191);