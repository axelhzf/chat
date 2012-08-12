root = exports ? this
root.App = root.App || {}

class App.InputView extends Backbone.View

  initialize: ->
    @input = @$el.find('input')

  events:
    keypress: 'keypress'

  focus: ->
    @input.focus()

  keypress: (e) ->
    if e.which is 13
      val = @input.val()
      msg = new App.Message({msg: val})

      if msg.isValid
        @input.val('')
        @.trigger 'newMessage', msg