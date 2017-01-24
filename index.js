(function(){
	'use strict';

	var config = require('./config.json'),
		BugBot = require('./lib/bugbot'),
		bodyParser = require('body-parser'),
		express = require('express'),
		app = express();

	var bugbot;

	var report = function(req, res){

		if(!req.body
			|| !req.body.person
			|| !req.body.comment) {
			return res.status(400)
			.json({
				status: 400,
				message: "Bad Request"
			});
		}


		bugbot.report(req.body);
		
		return res
		.header('Access-Control-Allow-Origin', '*')
		.json({
			status: 200,
			message: "OK"
		});
	};

	app.use( bodyParser.json() );       // to support JSON-encoded bodies
	app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
		extended: true
	}) );

	app.get('/', function (req, res) {
		res.send('BugBot kicks you!');
	});

	app.post('/report', report);

	app.listen(config.port, function () {
		bugbot = new BugBot(config);
		console.log(`BugBot listening on port ${config.port}!`);
	});

})();