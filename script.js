function init() {

    var center = [47.1611615, 19.5057541]

    var mymap = L.map('mapid').setView(center, 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(mymap);

    var marker = L.marker(center).addTo(mymap);

}