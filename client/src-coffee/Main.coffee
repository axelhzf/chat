
Handlebars.registerHelper "fromNow", (date) ->
  moment(date).fromNow()

root = exports ? this
root.App = root.App || {}

#Model
class App.Config extends Backbone.Model

class App.Users extends Backbone.Collection

class App.Messages extends Backbone.Collection
  model : App.Message


#Initialize
App.config = new App.Config
App.users = new App.Users
App.messages = new App.Messages()
App.usersView = new App.UsersView({collection : App.users, el : ".users-inner"})
App.messagesView = new App.MessagesView({collection : App.messages, el : ".conversation", config : App.config})

App.inputView = new App.InputView({el : ".input"})
App.inputView.focus()

#Attach events
App.users.on('reset', App.usersView.render)
App.messages.on('add', App.messagesView.appendMsg)
App.messages.on('reset', App.messagesView.render)


socket = io.connect('http://chat-tlp2k12.herokuapp.com/');

socket.on('connect', () ->
  username = prompt("What's your name?")
  App.config.set('username', username)
  socket.emit('adduser', username)
)

socket.on("initchat", (response) ->
  App.messages.reset response
)

socket.on('updatechat', (message) ->
  App.messages.add message
)

socket.on('updateusers', (data) ->
  users = _.map(_.keys(data), (name) -> {name : name});
  App.users.reset users
)

App.inputView.on("newMessage", (message) ->
  socket.emit('sendchat', message.get('msg'))
)

