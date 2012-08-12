root = exports ? this
root.App = root.App || {}

class App.Message extends Backbone.Model
  validate : (attributes) ->
    "el mensaje debe tener contenido" if (_.isUndefined(attributes.msg) || attributes.msg.length == 0)
