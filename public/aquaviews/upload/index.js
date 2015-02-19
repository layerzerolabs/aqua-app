/* global app:true, Backbone, _, $, document */


(function() {
  'use strict';

  app = app || {};

  app.Reading = Backbone.Model.extend({
    url: '/upload',
    defaults: {
      errors: [],
      errfor: []
    }
  });

  app.DirectUploadView = Backbone.View.extend({
    el: '#directUpload',
    template: _.template( $('#tmpl-directUpload').html() ),
    events: {
      'submit form': 'uploadReading',
    },
    initialize: function() {
      this.model = new app.Reading();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      this.$('[name="reading_time"]').datepicker({
        clearBtn: true,
        autoclose: true,
        endDate: '+0h'
      });
    },
    uploadReading: function(e) {
      e.preventDefault();
      var json = _($('form').serializeArray()).reduce(function(obj, field) {
        obj[field.name] = field.value;
        return obj;
      }, {});
      console.log(json);
      this.model.save(json);
    }
  });

  $(document).ready(function() {
      app.directUploadView = new app.DirectUploadView();
  });
}());
