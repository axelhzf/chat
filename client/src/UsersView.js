var App = App || {};

App.UsersView = Backbone.View.extend({

	initialize : function () {
		_.bindAll(this, "render")
	},

    template : Handlebars.compile($('#usersTmpl').html()),

    render : function () {
        var context = {
            users : this.collection.toJSON()
        };
        this.$el.html(this.template(context));
    }

});