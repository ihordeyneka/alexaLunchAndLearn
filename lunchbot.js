var WebClient = require('@slack/client').WebClient;
var _ = require('lodash');
// An access token (from your Slack app or custom integration - usually xoxb)
const token =   'xxx'; //process.env.SLACK_TOKEN;

let web = new WebClient(token);

function sendGenericToAll(message, toPerson) {
        web.users.list().then((data) =>{
            let userIds = [];
            if(!data.members || data.members.length == 0)
                return;
            for(var u in data.members) {
                let username = data.members[u].name;
                let realname = data.members[u].real_name;
                let userId = data.members[u].id;
                if(username === 'slackbot') continue;
                if(toPerson.toLowerCase() == 'everyone') {
                    userIds.push({ id: userId, name: username});
                    continue;
                }
                if(_.includes(realname.toLowerCase().split(' '), toPerson.toLowerCase())) {
                    userIds.push({ id: userId, name: username});
                }
            }
            for(var i in userIds)
            {
                console.log(i);
                web.chat.postMessage({text: message, channel: userIds[i].id});

            }
        });

    };

module.exports = sendGenericToAll;

//sendGenericToAll("hello to you todd.", 'todd');
