// Initialize express app
//----------------------------------------
var express = require('express');
var cluster = (require('cluster'));

if(cluster.isMaster){
    var cpuCount = require('os').cpus().length;
    for(var i = 0; i < cpuCount; i += 1){
        cluster.fork();
    }
    cluster.on('exit', function(worker){
        console.log('Worker' + worker.id + ' died.');
        cluster.fork();
    });
}
else{
    var app = express();

    // Middleware
    //----------------------------------------
    // Static file serving
    app.use('/', express.static(__dirname+'/../public'));

    // Application config
    //----------------------------------------
    var config  = require('./config.js')

    // Routing
    //----------------------------------------
    require('./routes.js')(app, config);

    // Listen (start app with: node server.js)
    //----------------------------------------
    var server = app.listen(3000, function() {
        console.log('Listening on port %d', server.address().port);
    });

}


