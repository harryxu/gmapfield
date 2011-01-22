(function ($) {
Drupal.behaviors.gmapfield = {
    attach: function(context, settings) {
        for (var i in settings.gmapfields) {
            Drupal.gmapfield.initMap(settings.gmapfields[i]);
        }
    },
};

Drupal.gmapfield = {
    initMap: function(delta) {
        var latInput = $('#gmapfield-'+delta+'-lat');
        var lngInput = $('#gmapfield-'+delta+'-long');
        var latlng = new google.maps.LatLng(
            Number(latInput.val()), Number(lngInput.val()));
        var options = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var canvasId = "gmapfield-"+delta+"-canvas";
        var map = new google.maps.Map($('#'+canvasId).get(0), options);
        google.maps.event.addListener(map, 'center_changed', function() {
            var latlng = map.getCenter();
            latInput.val(latlng.lat());
            lngInput.val(latlng.lng());
        });
    }
};

})(jQuery);
