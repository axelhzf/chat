var App = App || {};

App.Message = Backbone.Model.extend({
    validate : function (attributes) {
        if (_.isUndefined(attributes.msg) || attributes.msg.length === 0) {
            return "el mensaje debe tener contenido";
        }
    }
});