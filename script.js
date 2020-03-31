var mymap;
var clickLat;
var clickLon;
var markerLayer = new L.LayerGroup();

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

    getAllPois();

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

    var poi = {   
        name: document.getElementById("name").value,
        type: document.getElementById("type").value,
        condition: document.getElementById("condition").value,
        active: document.getElementById("active").checked,
        x_coord: clickLon,
        y_coord: clickLat
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