(function ($) {
Drupal.gmapEditFields = [];

Drupal.behaviors.gmapfield = {
    attach: function(context, settings) {
        for (var i in settings.gmapfields) {
            var delta = settings.gmapfields[i];
            Drupal.gmapEditFields.push(new Drupal.GMapField(delta));
        }
        for (var i in settings.gmapfieldViews) {
            Drupal.GMapField.gmapfieldView(i, settings.gmapfieldViews[i]);
        }
    }
};

Drupal.GMapField = function(delta) {
    var self = this;
    this.fieldset = $('#gmapfield-edit-'+delta);
    this.fieldset.find('.fieldset-title').click(function(event){
        self.fieldset.unbind(event);
        self.initMap();
    });
};

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
    this.map = new google.maps.Map(canvas, options);
    var marker = new google.maps.Marker({
            position: latlng,
            draggable: true,
    });
    marker.setMap(this.map);

    var handler = function(event) {
        var latlng = event.latLng;
        marker.setPosition(latlng);
        latInput.val(latlng.lat());
        lngInput.val(latlng.lng());
        zoomInput.val(this.map.getZoom());
    };

    google.maps.event.addListener(this.map, 'click', handler);
    google.maps.event.addListener(marker, 'dragend', handler);

    if (!Drupal.GMapField.searchLoaded) {
        Drupal.GMapField.loadLocalSearch();
        Drupal.GMapField.searchLoaded = true;
    }
};

Drupal.GMapField.prototype.initMapSearch = function() {
    var searchDiv = this.fieldset.find('.gmapfield-map-search');
    var searchInput = searchDiv.find('input');
    var searchButton = searchDiv.find('button');
    var self = this;

    this.localSearch = new google.search.LocalSearch();
    this.localSearch.setCenterPoint(this.map.getCenter());
    this.localSearch.setSearchCompleteCallback(this, Drupal.GMapField.searchCompleteHandler);

    searchButton.click(function() {
        self.localSearch.execute(searchInput.val());
        return false;
    });
    searchInput.keydown(function(event) {
        if (event.keyCode == 13) {
            self.localSearch.execute(searchInput.val());
            return false;
        }
    });
};

Drupal.GMapField.searchCompleteHandler = function() {
    var first = this.localSearch.results[0];
    this.map.setCenter(new google.maps.LatLng(first.lat, first.lng));
};

//
//  static functions
//

Drupal.GMapField.loadLocalSearch = function() {
    google.load('search', '1', {'callback': Drupal.GMapField.onSearchLoad});
}

Drupal.GMapField.onSearchLoad = function() {
    for (var i in Drupal.gmapEditFields) {
        Drupal.gmapEditFields[i].initMapSearch();
    }
}

Drupal.GMapField.gmapfieldView = function(eid, options) {
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
