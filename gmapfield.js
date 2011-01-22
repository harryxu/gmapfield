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
        var lngInput = $('#gmapfield-'+delta+'-lng');
        var zoomInput = $('#gmapfield-'+delta+'-zoom');
        var lat = Number(latInput.val());
        var lng = Number(lngInput.val());
        var latlng = new google.maps.LatLng(lat, lng);
        var options = {
            zoom: Number(zoomInput.val()),
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var canvasId = "gmapfield-"+delta+"-canvas";
        var map = new google.maps.Map($('#'+canvasId).get(0), options);
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
    }
};

})(jQuery);
