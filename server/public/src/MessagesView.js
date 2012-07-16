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

    getHtmlMsg : function (msg) {
        var smiles = [":)", ":'(", ":P", ";)", ":*", ":D", ":@", "¬¬", "8|"],
            codes  = ["85", "358", "348", "344", "363", "86", "361", "353", "352"];

        var result = msg;
        for(var i = 0; i < smiles.length; i++){
            var smile = smiles[i];
            var code = codes[i];
            result = result.replace(smile, '<i class="icon-' + code + '"></i>');
        }

        return result;
    },

    appendMsg : function (msg) {
        var context = msg.toJSON();
        context.htmlMsg = this.getHtmlMsg(context.msg);
        context.color = context.username === this.config.get('username') ? "me" : "other";

        this.$el.append(this.msgTemplate(context));
        this.scrollBottom();
    }
});