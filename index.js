let express = require('express');
let app = express();
let http = require('http');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



let swaggerTools = require('swagger-tools');

// swaggerRouter configuration
let swaggerOptions = {
    controllers: './controllers',
};


let swaggerDoc = require('./api/swagger.json');

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests params
    app.use(middleware.swaggerValidator());

    // Route requests to  controller
    app.use(middleware.swaggerRouter(swaggerOptions));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    // Start the server
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Node app isdddd running on port', app.get('port'));
    });
});

