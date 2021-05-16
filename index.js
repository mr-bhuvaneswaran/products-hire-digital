const http = require('http');
const helper = require('./helper');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

http.createServer(function (req, res) {

    const parsed = url.parse(req.url);
    const query  = querystring.parse(parsed.query);
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && parsed.pathname === '/list') {
        
        
        res.end(JSON.stringify(helper.getProductList(query.page, query.limit)));


    } else if(req.method === 'POST' && parsed.pathname === "/create") {

        let body = '';

        req.on('data', function(data) { body += data; });

        req.on('end', function() { 
            data = JSON.parse(body);
            res.end(JSON.stringify(helper.createProduct(data)));
        }); 

    } else if(req.method === 'PUT' && parsed.pathname === "/update") {

        let body = '';
        
        req.on('data', function(data) { body += data; });

        req.on('end', function() { 
            data = JSON.parse(body);
            res.end(JSON.stringify(helper.updateProduct(data)));
        });

    } else {
        if(parsed.pathname === "/home.html") {
            fs.readFile('.' + parsed.pathname, function (err, html) {
                res.writeHeader(200, {"Content-Type": "text/html"});  
                res.write(html);  
                res.end();
            });
        } else if (parsed.pathname === 'favicon.ico'){ 
            res.status(204).end()
        }
        else {
            res.end(JSON.stringify({message: 'No matching routes found'}));
        }

    }

}).listen(8080);