if (autoModerator !== undefined)
  autoModerator.close()

String.prototype.equalsIgnoreCase     = function(other)    { return typeof other !== 'string' ? false : this.toLowerCase() === other.toLowerCase(); };
var autoModeratorModel = require('app/base/Class').extend({
	version: "1.0.5",
	bannedWords: [
		'huehue',
		'hu3hu3',
		'raise your donger',
                'skip this',
                'fan',
                'mute',
                'f4n',
                'sk1p',
                '5k1p',
                'kkkkkkkkk',
                'fa n',
                'skip?',
                'fan4fan',
                'fan4fan?',
                'fan me please',
                'fan me pls',
                'f4n me',
                'f4n m3',
                'f an',
                'f a n',
                'f a n m e',
                's k i p',
                'sk ip',
                's kip',
                'ski p',
                's k ip',
                'gibe mi moni plox',
                'heil spoder',
                'skyp',
                'skop',
                'sklp',
                'skiip',
                'skip this crap',
                'skip this shit',
                'overplayed',
                'skiiip',
                'brbr',
                'brbrbr',
                'HUE HUE',
                'H U E',
                'H U E H U E',
                'B R A Z I L'
        ],
	mutedUsers: [],
	init: function() {
		this.proxy = {
			chat:        $.proxy(this.onChat,          this),
			chatCommand: $.proxy(this.onChatCommand,   this),
		}
		API.on(API.CHAT,          this.proxy.chat);
		API.on(API.CHAT_COMMAND,  this.proxy.chatCommand);
		console.log('AutoModerator version ' + this.version + ' now running!')
		API.sendChat('AutoModerator version ' + this.version + ' now running!')
	},
	close: function() {
		API.off(API.CHAT,          this.proxy.onChat);
		API.off(API.CHAT_COMMAND,  this.proxy.onChatCommand);
		console.log('AutoModerator version ' + this.version + ' now stopped!')
	},
	onChat:function(data) {
		for (var i in this.bannedWords) {
			var message = data.message.toLowerCase();
			if (message.indexOf(this.bannedWords[i].toLowerCase()) > -1)
				API.moderateDeleteChat(data.chatID)
		};
		if (this.mutedUsers.indexOf(data.fromID) > -1)
			API.moderateDeleteChat(data.chatID);
	},
	onChatCommand: function(value) {
		if (value.indexOf('/banword') === 0) {
			var a = value.substr(8)
			if (this.bannedWords.indexOf(a) < 0) {
				this.bannedWords.push(a)
				API.chatLog(a + ' added to banned words')
			} else {
				this.bannedWords.splice(this.bannedWords.indexOf(a),1)
				API.chatLog(a + ' removed from banned words')
			}
		}
		if (value.indexOf('/mute') === 0) {
			var user = this.getUserID(value.substr(5))
			if (user === null) API.chatLog('user not found!')
			else {
				this.mutedUsers.push(user.id)
				API.chatLog(user.username + ' added to muted users list')
			}
		}
		if (value.indexOf('/unmute') === 0) {
			var user = this.getUserID(value.substr(7))
			if (user === null) API.chatLog('user not found!')
			else if (this.mutedUsers.indexOf(user.id) > -1) {
				this.mutedUsers.splice(this.mutedUsers.indexOf(user.id), 1);
				API.chatLog(user.username + ' removed from muted users list')
			}
		}
	},
	getUserID: function(data) {
    	data = data.trim();
        if (data.substr(0,1) === '@')
            data = data.substr(1);
            var users = API.getUsers();
            for (var i in users) {
                if (users[i].username.equalsIgnoreCase(data) || users[i].id.equalsIgnoreCase(data))
                    return users[i];
            }
            return null;
        }
});
var autoModerator = new autoModeratorModel();
