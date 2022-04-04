// Map setup 

let map = L.map('map').setView([25.56, 1.05], 2.5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 5,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoia3d4emEiLCJhIjoiY2wxaTFoYnh3MDd0dzNwbTFtZjNlb3dxZyJ9.lcsHEY3mof1sAfVvofK5zA'
}).addTo(map);



const cities = {};

// Get city data with jQuery ajax call
$(function() {
    $.getJSON("http://localhost:3000/weather/cities", function(cityData) {

        cityData.cities.forEach(city => {
            getCityWeather(city);
        });


    });
});

async function getCityWeather(city) {
    $.getJSON(`http://localhost:3000/weather/${city}`, function(weatherData) {
                cities[city] = weatherData;

                const popupTemplate = `
                    <h6><strong>${city}</strong></h6>
                    <h6>${cities[city].weather.description}</h6>
                    <h6>Feels like ${cities[city].weather.feelsLike}</h6>

                `;

                const tooltipTemplate = `
                    <h6>${city}</h6>
                    <h4><img src="${cities[city].weather.iconUrl}">${cities[city].weather.temp}</h4> 
                    <h6>Feels like ${cities[city].weather.feelsLike}</h6>
                    <h6>Weather: ${cities[city].weather.description}</h6>
                `;

                //add layer to map with pin and popup with info
                cities[city].marker = L.marker([cities[city].coordinates.lat, cities[city].coordinates.lon])
                .addTo(map)
                .bindPopup(popupTemplate)
                .bindTooltip(tooltipTemplate)
                .openTooltip();

            });
}