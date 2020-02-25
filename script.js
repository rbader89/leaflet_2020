function init() {

    var center = [47.1611615, 19.5057541]

    var mymap = L.map('mapid', {
        center: center,
        zoom: 7
    });

    mymap.addEventListener('click', function(event) {
        
        var latLonContainer = document.getElementById('latLongBox');
        console.log(event)
        var latLonStr = `Lat: ${event.latlng.lat}, Lon: ${event.latlng.lng}`;
        console.log(latLonStr)

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

    var marker = L.marker(center).addTo(mymap);

}