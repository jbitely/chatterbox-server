var messages = []; // message storage

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-type": "application/JSON"
};

var sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200; // default status to 200
  response.writeHead(statusCode, headers); // set headers
  response.end(JSON.stringify(data)); // send back JSON stringified data
}

// load data chunks and return callback with JSON parsed data
var getData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });

  request.on('end', function(){
    callback(JSON.parse(data));
  });
};

exports.requestHandler = function(request, response) {
  console.log("REQUEST HANDLER CALLED");
  // Do some basic logging.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // store some stuff
  var method = request.method;
  var url = request.url;
  var statusCode = null;

  // Check url
  if(url.substring(0,8) === "/classes" || url === "/classes/chatterbox"){
    // Handle POST
    if(method === "POST"){
      getData(request, function(message){
        console.log(message);
        messages.push(message);
        console.log("Messages ", messages);
        sendResponse(response, null, 201)
      });
    }
    // Handle GET
    if(method === "GET"){
      console.log(messages);
      sendResponse(response, {results: messages}, 200);
    }
    // Handle OPTIONS
    if(method === "OPTIONS"){
      sendResponse(response, null, 200);
    }
  } else {
    console.log("Bad URL request");
    sendResponse(response, "Not found.", 404);
  }
};


