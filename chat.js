var uspsTracking = require('./model/usps');
const usps = require('./model/usps');

module.exports = function (server, builder, connector) {
    
    server.post('/api/messages', connector.listen());

    var inMemoryStorage = new builder.MemoryBotStorage();

    
    var bot = new builder.UniversalBot(connector, [
        function (session) {
            session.beginDialog('greetings', session.userData.profile);
        }
    ]).set('storage', inMemoryStorage);

    bot.dialog('greetings', [

        function (session) {
            session.sendTyping();
            setTimeout(function () {
                builder.Prompts.text(session, 'Hello! What is your name?');
            }, 1500);

        },

        function (session, results) {
            session.sendTyping();
            setTimeout(function () {
                session.send("Hello %s!", results.response);
                session.beginDialog('choices', session.userData.profile);
            }, 1500);
        }

    ]).reloadAction('startOver', 'Ok, starting over.', {
        matches: /^start over$/i,
        dialogArgs: {
            isReloaded: true
        }
    });

    bot.dialog('choices', [
        function (session) {
            builder.Prompts.choice(session, "How can I help you today?", ["Track a package", "Calculate shipping cost"], { listStyle: builder.ListStyle.button });
        }
        , function (session, results) {
            switch (results.response.entity) {
                case "Track a package":
                    session.beginDialog('track_a_package', session.userData.profile);
                    break;
                case "Calculate shipping cost":
                    session.send("I'm still learning how to calculate shipping cost... Try again.");
                    session.replaceDialog('choices', { reprompt: true });
                    break;
            }
        }
    ]);

    bot.dialog('track_a_package', [
        
        function (session) {
            builder.Prompts.text(session, 'Can you please provide me your tracking number?');
        },
        
        async function (session, results) {
            session.send("Thank you... Please wait while I'm processing your request...");
            session.sendTyping();
            var tracking = results.response;
            var data = await usps.getShippingInfo(tracking);
            
            try{
                setTimeout(function (){
                    if(data == null){
                        session.send('nothing returned');
                        session.endDialog();
                    }
                    else{
                        console.log(data);
                        // if(data.TrackResponse.TrackInfo.Error != null){
                        //     console.log(data.TrackResponse.TrackInfo.Error.Description);
                        //     session.send(data.TrackResponse.TrackInfo.Error.Description);
                        // }
                        // else if(data.TrackResponse.TrackInfo.TrackSummary != null){
                        //     console.log(data.TrackResponse.TrackInfo.TrackSummary);
                        //     session.send(data.TrackResponse.TrackInfo.TrackSummary);
                        // }
                        // else if(data.TrackResponse.TrackInfo.TrackDetail != null){
                        //     var msgs = data.TrackResponse.TrackInfo.TrackDetail;
                        //     console.log(msgs);
                        //     session.send(msgs[0]);
                        // }
                        // else{
                        //     session.send('error');
                        //     session.endDialog();
                        // }
                        session.send(data);
                        session.endDialog();
                    }
                        console.log('finished');
                }, 7000); 
            }
            catch(error){
                console.log('there was en exception');
                console.log(error);
            }
                       
        }
    ]);
}

async function GetUSPSTrackingData(tracking){
    var xml = await uspsTracking(tracking);
    var json = parser.toJson(xml);
     var obj = JSON.parse(json);
     //console.log(obj.TrackResponse.TrackInfo);
    return obj;
}