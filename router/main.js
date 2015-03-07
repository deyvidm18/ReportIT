module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index.html')
    });

	app.get('/api', function(req, res) {
        res.render('api.html');
    });
	
    app.get('/about', function(req, res) {
        res.render('about.html');
    });
}