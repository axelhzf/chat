var App = App || {};

App.InputView = Backbone.View.extend({

    initialize : function (options) {
        this.$input = this.$el.find('input');
    },

    events : {
        "keypress" : "keypress"
    },

    focus : function () {
        this.$input.focus();
    },

    keypress : function (e) {
        if (e.which === 13) {
            var val = this.$input.val();

            var msg = new App.Message({msg : val});
            if(msg.isValid()){
                this.$input.val('');
                this.trigger("newMessage", msg);
            }
        }
    }
});