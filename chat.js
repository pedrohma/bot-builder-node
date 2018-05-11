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
        // Step 1
        function (session) {
            builder.Prompts.text(session, 'Hi! What is your name?');
        },
        // Step 2
        function (session, results) {
            session.send("Hello %s", results.response);
            builder.Prompts.choice(session, "Which is your favorite color?", ["red", "green", "blue"], { listStyle: builder.ListStyle.button });
        }
        // Step 3
        , function (session, results) {
            session.endDialog(`Your favorite color is ${results.response.entity}!`);
        }
    ]);
}

