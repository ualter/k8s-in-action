const http = require('http');
const os = require('os');

console.log("Kubia server starting... (Healthy)");

var requestCount = 0;

var handler = function(request, response) {
    var ip = request.headers['x-forwarded-for'] || 
             request.connection.remoteAddress || 
             request.socket.remoteAddress ||
             (request.connection.socket ? request.connection.socket.remoteAddress : null);

    requestCount++;
    console.log("Receive request " + requestCount + " from " + ip);
    response.writeHead(200);
    response.end("You've hit Hostname:" + os.hostname() + ", IP:" + ip + " [" + requestCount + "] " + "\n");
    console.log("Result: HTTP 200");
};

var www = http.createServer(handler);
www.listen(9191);