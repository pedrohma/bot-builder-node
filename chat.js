var uspsTracking = require('./usps.js');

module.exports = function (server, builder, connector) {

    // Listen for messages from users 
    server.post('/api/messages', connector.listen());

    var inMemoryStorage = new builder.MemoryBotStorage();

    // Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
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
        // Step 1
        function (session) {
            builder.Prompts.text(session, 'Can you please provide me your tracking number?');
        },
        // Step 2
        function (session, results) {
            session.send("Thank you... Please wait while I'm processing your request...");
            session.sendTyping();
            var tracking = results.response;
            var data = uspsTracking(tracking);

            console.log(data);
            session.send(data);
            session.endDialog();
            console.log('finished');
        }
    ]);
}

