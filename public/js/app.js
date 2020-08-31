// chat.html includes the Diffusion library on line 46.
 var globalSession;
 var roomTopic;

 // get query params from url
 var name = getQueryVariable("name") || 'Anonymous';
 var room = getQueryVariable("room") || 'No Room Selected';
 // update room title on the chat.html page
 $(".room-title").text(room);
 // time to connect to your Diffusion service, or leave this values and connect to our sandbox
 // sign up to Diffusion Cloud and get your service up a runing in a minute.
 diffusion.connect({
    host : 'diffusionchatapp.eu.diffusion.cloud',
    port : 443,
    secure : true,
    principal : 'admin',
    credentials : 'password'
 }).then(function(session) {
    // now we have a session open to our Diffusion service.
    console.log("Connected to Diffusion Server!");
    console.log(name + " wants to join  " + room);
    globalSession = session;
    // lets create a Diffusion Topic called Chat and as many subtopics as rooms we have.
    roomTopic = "Chat/" + room;
    // we are going to have a JSON topic type, but it can be binary, string, ...
    session.topics.add(roomTopic, diffusion.topics.TopicType.JSON);
    // we have stablished a session to the service,
    // lets create and set a value to our first topic, or basically the first massage on this chat room.
    session.topicUpdate.set(roomTopic, diffusion.datatypes.json(), { text: name + ' has joined', name: "System", timestamp: moment().valueOf() });
    // lets also subscribe to the topic chatroom to get all updates when new messages are sent.
    session.select(roomTopic);
    var roomStream = session.addStream(roomTopic, diffusion.datatypes.json());
    roomStream.on('value', function(topic, specification, newValue, oldValue) {
    
      if(newValue.get().name === name) {
        // only display messages from other users
        return;
      }

      // insert messages in container
      var $messages = $(".messages");
      var $message = $('<li class = "list-group-item"></li>');
      var momentTimestamp = moment.utc(newValue.get().timestamp).local().format("h:mm a");

      $message.append("<strong>" + momentTimestamp + " " + newValue.get().name + "</strong>");
      $message.append("<p>" + newValue.get().text + "</p>");
      $messages.append($message);

      // manage autoscroll
      var obj = $("ul.messages.list-group");
      var offset = obj.offset();
      var scrollLength = obj[0].scrollHeight;
      $("ul.messages.list-group").animate({
        scrollTop: scrollLength - offset.top
      });
    });
  });
 
 // lets check for page visibility api
 var hidden, visibilityChange;
 if (typeof document.hidden !== "undefined") {
   hidden = "hidden";
   visibilityChange = "visibilitychange";
 } else if (typeof document.mozHidden !== "undefined") {
   hidden = "mozHidden";
   visibilityChange = "mozvisibilitychange";
 } else if (typeof document.msHidden !== "undefined") {
   hidden = "msHidden";
   visibilityChange = "msvisibilitychange";
 } else if (typeof document.webkitHidden !== "undefined") {
   hidden = "webkitHidden";
   visibilityChange = "webkitvisibilitychange";
 }

 // lets handles submitting of new message
 var $form = $("#messageForm");
 var $message1 = $form.find('input[name=message]');

 $form.on("submit", function(event) {
   event.preventDefault();
   var msg = $message1.val();
   //lets prevent js injection attack
   msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
   if (msg === "") return -1; //empty messages cannot be sent

   globalSession.topicUpdate.set(roomTopic, diffusion.datatypes.json(), { text: msg, name: name, timestamp: moment().valueOf() });

   // show user messageForm
   var $messages = $(".messages");
   var $message = $('<li class = "list-group-item"></li>');
   var momentTimestamp = moment().format("h:mm a");

   $message.append("<strong>" + momentTimestamp + " " + name + "</strong>");
   $message.append($("<p>", {
     class: "mymessages",
     text: $message1.val()
   }));
   $messages.append($message);
   $message1.val('');
   
   // manage autoscroll
   var obj = $("ul.messages.list-group");
   var offset = obj.offset();
   var scrollLength = obj[0].scrollHeight;
   $("ul.messages.list-group").animate({
     scrollTop: scrollLength - offset.top
   });
 });
