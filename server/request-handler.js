/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messages = []; // message storage

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = function(request, response) {
  // Do some basic logging.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // store some stuff
  var method = request.method;
  var url = request.url;
  var statusCode = null;
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  // Tell the client we are sending them JSON
  headers['Content-Type'] = "application/JSON";

  // Handle POST
  if(method === "POST"){
    messages.push(parsePost(request)); // store the message
    console.log(messages);
    statusCode = 201;
    response.writeHead(statusCode, headers);
    response.end(); // end the response
  }
  // Handle GET
  if(method === "GET"){
    // figure out what they want
    // send it to them
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({results: messages})); // send back all the messages in a strinfigied object
  }
  // Handle OPTIONS
  if(method === "OPTIONS"){
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  }
};



var parsePost = function(req){
  console.log("CALLED parsePost");
  var body = '';
  var parsed = {};
  req.setEncoding('utf8');

  req.on('data', function(chunk){
    body += chunk;
  });

  req.on('end', function(){
    try{
      parsed = JSON.parse(body)
      console.log("RETURNING", parsed);
    } catch (err){
      // do some error stuff
    }
  });
  return parsed;
};
