var App = App || {};

App.Message = Backbone.Model.extend({

	initialize : function () {
		this.on("change", this.setTimeAgo, this);			
	},

	setTimeAgo : function () {
		this.set('timeAgo', moment(this.get('timestamp').fromNow()), { silent : true });
	}

});