(function ($) {
Drupal.behaviors.gmapfield = {
    attach: function(context, settings) {
        for (var i in settings.gmapfields) {
            var delta = settings.gmapfields[i];
            new Drupal.GMapField(delta);
        }
        for (var i in settings.gmapfieldViews) {
            Drupal.gmapfieldView(i, settings.gmapfieldViews[i]);
        }
    },
};

Drupal.GMapField = function(delta) {
    var self = this;
    this.fieldset = $('#gmapfield-edit-'+delta);
    this.fieldset.find('.fieldset-title').click(function(event){
        self.fieldset.unbind(event);
        self.initMap();
    });
}

Drupal.GMapField.prototype.initMap = function() {
    var latInput = this.fieldset.find('.gmapfield-lat');
    var lngInput = this.fieldset.find('.gmapfield-lng');
    var zoomInput = this.fieldset.find('.gmapfield-zoom');
    var canvas = this.fieldset.find('.gmapfield-map-canvas').width(500).height(400).get(0);
    var lat = Number(latInput.val());
    var lng = Number(lngInput.val());
    var latlng = new google.maps.LatLng(lat, lng);
    var options = {
        zoom: Number(zoomInput.val()),
        center: latlng,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(canvas, options);
    var marker = new google.maps.Marker({
            position: latlng,
            draggable: true,
    });
    marker.setMap(map);

    var handler = function(event) {
        var latlng = event.latLng;
        marker.setPosition(latlng);
        latInput.val(latlng.lat());
        lngInput.val(latlng.lng());
        zoomInput.val(map.getZoom());
    };

    google.maps.event.addListener(map, 'click', handler);
    google.maps.event.addListener(marker, 'dragend', handler);
};

Drupal.gmapfieldView = function(eid, options) {
    var canvas = $('#'+eid).width(300).height(200).get(0);
    var latlng = new google.maps.LatLng(Number(options.lat), Number(options.lng));
    var mapOptions = {
        zoom: Number(options.zoom),
        center: latlng,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(canvas, mapOptions);
    var marker = new google.maps.Marker({
            position: latlng,
    });
    marker.setMap(map);
};

})(jQuery);
