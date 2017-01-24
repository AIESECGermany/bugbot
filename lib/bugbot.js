(function(){

	'use strict';

	var util = require('util');
	var path = require('path');
	var fs = require('fs');
	var low = require('lowdb');
	var Bot = require('slackbots');

	/**
	 * BugBot class
	 * @param {Object} settings containing definition
	 * @param {string} settings.token the API Token
	 * @param {string} [settings.name = bugbot] the bot name
	 * @param {string} [settings.dbPath = projectDir/data/bugbot.db] Path to the db file
	 */
	class BugBot extends Bot{

		constructor(settings) {
			super(settings);
			this.settings = settings;
			this.name = this.settings.name || 'bugbot';
			this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'bugbot.db');

			this.db = null;
			this.id = null;
			
			this.on('start', this._onStart);
			this.on('message', this._onMessage);
			
		}

		_onStart() {
		    this._connectDb();
		}

		_connectDb() {
		    this.db = low(this.dbPath);

		    if(!this.db.has('channels').value()) this.db.set('channels', []).value();
		}

		_firstRunCheck() {
		    var lastrun = this.db.get('info.lastrun').value();
			var currentTime = (new Date()).toJSON();

	        // this is a first run
	        if (!lastrun) {
	            this._welcomeMessage();
	        }

	        // updates with new last running time
	        return this.db.set('info.lastrun', currentTime).value();
	    }

		_onMessage(event){
			switch(event.subtype) {
				case 'group_join':
				case 'channel_join':
					this._join(event);
					break;
				default:
					break;
			}
		}

		_join(event) {
			if(this.self.id == event.user){
				this.db.get('channels').push(event.channel).value();
				this._welcomeMessage(event.channel);
			}
		}

		_welcomeMessage(channel) {
		    this.postMessage(channel,`Allah uhbugbot, killing the unworthy eastern bugruser.`,
		        {as_user: true});
		}

		report(ticket) {
			var channels = this.db.get('channels').value();
			for(var i in channels){
				this.postMessage(channels[i], `${ticket.person} has a problem in ${ticket.server}:
${ticket.comment}

If you think you can, please try to help :stuck_out_tongue_winking_eye:`,
					{as_user: true});
			}
		}
		
	}	

	module.exports = BugBot;

})();