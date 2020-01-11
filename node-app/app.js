const http = require('http');
const os = require('os');

console.log("kubia server starting...");

var handler = function(request, response) {
    var ip = request.headers['x-forwarded-for'] || 
             request.connection.remoteAddress || 
             request.socket.remoteAddress ||
             (request.connection.socket ? request.connection.socket.remoteAddress : null);

    console.log("Receive request from " + ip);
    response.writeHead(200);
    response.end("You've hit Hostname:" + os.hostname() + ", IP:" + ip + "\n");
};

var www = http.createServer(handler);
www.listen(9191);