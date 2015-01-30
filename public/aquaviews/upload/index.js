/* global app:true, Backbone, _, $, document */

(function() {
  'use strict';

  app = app || {};

  app.DirectUpload = Backbone.Model.extend({
    url: '/directUpload/',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      name: '',
      email: '',
      message: ''
    }
  });

  app.DirectUploadView = Backbone.View.extend({
    el: '#directUpload',
    template: _.template( $('#tmpl-directUpload').html() ),
    events: {
      'submit form': 'preventSubmit',
      'click .btn-directUpload': 'directUpload'
    },
    initialize: function() {
      this.model = new app.DirectUpload();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      this.$el.find('[name="field"]').focus();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    contact: function() {
      this.$el.find('.btn-directUpload').attr('disabled', true);

      this.model.save({
        name: this.$el.find('[name="field"]').val(),
        email: this.$el.find('[name="value"]').val(),
      });
    }
  });

  $(document).ready(function() {
    app.directUploadView = new app.DirectUploadView();
  });
}());
