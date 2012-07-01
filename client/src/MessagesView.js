var App = App || {};
App.MessagesView = Backbone.View.extend({

    msgTemplate : Handlebars.compile($('#msgTmpl').html()),

    initialize : function (options) {
        this.config = options.config;
        _.bindAll(this, "appendMsg", "render");
    },

    render : function () {
        var self = this;
        this.collection.each(function(message) {
            self.appendMsg(message);
        });
    },

    scrollBottom : function () {
        this.$el.scrollTop(this.$el.prop('scrollHeight'));
    },

    appendMsg : function (msg) {
        var context = msg.toJSON();
        context.color = context.username === this.config.get('username') ? "me" : "other";

        this.$el.append(this.msgTemplate(context));
        this.scrollBottom();
    }
});