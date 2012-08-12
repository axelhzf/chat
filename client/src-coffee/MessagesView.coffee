root = exports ? this
root.App = root.App || {}

class App.MessagesView extends Backbone.View

  msgTemplate : Handlebars.compile $('#msgTmpl').html()

  initialize : (options) ->
    @config = options.config

  render : =>
    @collection.each (message) =>
      @appendMsg message

  scrollBottom : ->
    @$el.scrollTop @$el.prop('scrollHeight')

  getHtmlMsg : (msg) ->
    smiles = [":)", ":'(", ":P", ";)", ":*", ":D", ":@", "¬¬", "8|"]
    codes = ["85", "358", "348", "344", "363", "86", "361", "353", "352"]

    result = msg
    for smile, i in smiles
      code = codes[i]
      result = result.replace(smile, "<i class='icon-#{code}'></i>")

    return result

  appendMsg : (msg) =>
    currentUsername = @config.get "username"

    context = msg.toJSON()
    context.htmlMsg = @getHtmlMsg Handlebars.Utils.escapeExpression(context.msg)
    context.color = if context.username is currentUsername then "me" else "other"

    @$el.append @msgTemplate(context)
    @scrollBottom()
