root = exports ? this
root.App = root.App || {}

class App.UsersView extends Backbone.View
  template : Handlebars.compile($('#usersTmpl').html())

  render : =>
    context = users : @collection.toJSON()
    @$el.html @template(context)