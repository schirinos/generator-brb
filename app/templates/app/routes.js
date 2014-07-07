module.exports = function (app, config) {

    app.get('/', function(req, res){
        res.send("hello");
    });
};
