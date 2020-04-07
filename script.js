var mymap;
var clickLat;
var clickLon;
var markerLayer = new L.LayerGroup();
var gpsLayer = new L.LayerGroup();
var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var positionByGps = false;
var gpsCoords;

function init() {

    var center = [47.1611615, 19.5057541]

    mymap = L.map('mapid', {
        center: center,
        zoom: 7
    });

    mymap.addEventListener('click', function(event) {
        
        var latLonContainer = document.getElementById('latLongBox');
        var latLonStr = `Lat: ${event.latlng.lat}, Lon: ${event.latlng.lng}`;

        clickLat = event.latlng.lat;
        clickLon = event.latlng.lng;

        latLonContainer.innerHTML = latLonStr;
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(mymap);

    L.tileLayer.wms("http://localhost:8080/geoserver/gis_orai/wms", {
        layers: 'gis_orai:admin_level_polygon',
        format: 'image/png',
        transparent: true,
        attribution: "Saját polygon réteg",
        opacity: 0.5
    }).addTo(mymap);

    L.tileLayer.wms("http://localhost:8080/geoserver/gis_orai/wms", {
        layers: 'gis_orai:admin_level_line',
        format: 'image/png',
        transparent: true,
        attribution: "Saját vonalas réteg"
    }).addTo(mymap);

    L.tileLayer.wms("http://localhost:8080/geoserver/gis_orai/wms", {
        layers: 'gis_orai:admin_level_point',
        format: 'image/png',
        transparent: true,
        attribution: "Saját pont réteg"
    }).addTo(mymap);

    markerLayer.addTo(mymap);
    gpsLayer.addTo(mymap);

    getAllPois();

    mymap.locate();

    mymap.on('locationfound', locationFound);

    setInterval(() => {
        mymap.locate();
    }, 1000);

}

function getAllPois() {

    $.ajax({
        url: "http://localhost:5000/pois",
        dataType: "json",
        success: function(data) {

            markerLayer.clearLayers();
            
            for (i = 0; i < data.length; i++) {

                popupContent = `
                    <div>
                        <p>Név: ${data[i].name}</p>
                        <p>Típus: ${data[i].type}</p>
                        <p>Állapot: ${data[i].condition}</p>
                        <p>Aktív: ${data[i].active ? 'Igen' : 'Nem'}</p>
                    </div>
                `

                popup = L.popup().setLatLng([[data[i].y, data[i].x]]).setContent(popupContent)

                marker = L.marker([data[i].y, data[i].x], {
                    clickable: true
                }).bindPopup(popup);

                markerLayer.addLayer(marker);

            }

        }
    })

}

function createPoi() {

    lon = clickLon;
    lat = clickLat;

    if (positionByGps == true) {

        lat = gpsCoords[0];
        lon = gpsCoords[1];

    }

    var poi = {   
        name: document.getElementById("name").value,
        type: document.getElementById("type").value,
        condition: document.getElementById("condition").value,
        active: document.getElementById("active").checked,
        x_coord: lon,
        y_coord: lat
    }

    console.log(poi)

    $.ajax({
        url: `http://localhost:5000/create?name=${poi.name}&type=${poi.type}&condition=${poi.condition}&active=${poi.active}&x_coord=${poi.x_coord}&y_coord=${poi.y_coord}`,
        dataType: 'json',
        method: 'POST',
        success: function(data) {
            getAllPois();
        }
    })

}

function locationFound(e) {
    
    gpsLayer.clearLayers();

    gpsMarker = L.marker([e.latitude, e.longitude], {icon: greenIcon});

    gpsLayer.addLayer(gpsMarker);

    gpsCoords = [e.latitude, e.longitude];

    document.getElementById("gps").disabled = false;

}

function positionByGPSChanged() {

    value = document.getElementById("gps").checked;

    positionByGps = value;
    console.log(positionByGps);

}