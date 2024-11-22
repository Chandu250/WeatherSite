let long;
let lat;
const temperatureDescription = document.querySelector(".temperature-description");
const temperatureDegree = document.querySelector(".temperature-degree");
const locationTimezone = document.querySelector(".location-timezone");
const setIcon = document.querySelector(".icon");
const maxTemperature = document.querySelector(".maxTemp");
const minTemperature = document.querySelector(".minTemp");
const windSpeed = document.querySelector(".windSpeed");
const weather = document.querySelector("#weather");

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        const data = await getWeatherdata(lat, long);

        // Initialize the map centered on India
        const map = L.map('map').setView([20.9716, 80.5946], 5);

        // Adding a tile layer to the map
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=OdpemAaV0raJvYO6cUSS', {
            attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        }).addTo(map);

        // Add marker for the current location
        const marker = L.marker([lat, long]).addTo(map);
        marker.bindPopup(data.name).openPopup();

        // Add event listener for clicks on the map
        map.on('click', async function(e) {
            console.log(`Lat, Lon: ${e.latlng.lat}, ${e.latlng.lng}`);
            const data = await getWeatherdata(e.latlng.lat, e.latlng.lng);

            // Update marker position and popup with city name
            marker.setLatLng([e.latlng.lat, e.latlng.lng]);
            marker.bindPopup(data.name).openPopup();
        });
    });
}

async function getWeatherdata(lat, long) {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=ddfaba4398b491fa4ef3e29a5e934c6e`;

    const response = await fetch(api);
    const data = await response.json();

    weatherDataHandler(data);
    return data;
}

function weatherDataHandler(data) {
    const { temp, temp_max, temp_min } = data.main;
    const { description, icon } = data.weather[0];
    const { speed } = data.wind;

    temperatureDegree.textContent = `${temp}° C`;
    temperatureDescription.textContent = description;
    locationTimezone.textContent = data.name;
    maxTemperature.textContent = `Max: ${temp_max}° C`;
    minTemperature.textContent = `Min: ${temp_min}° C`;
    windSpeed.textContent = `Wind Speed: ${speed} m/s`;
    setIcon.style.backgroundImage = `url(${setIconFunction(icon)})`;
}

function setIconFunction(icon) {
    const icons = {
        "01d": "./animated/day.svg",
        "02d": "./animated/cloudy-day-1.svg",
        "03d": "./animated/cloudy-day-2.svg",
        "04d": "./animated/cloudy-day-3.svg",
        "09d": "./animated/rainy-1.svg",
        "10d": "./animated/rainy-2.svg",
        "11d": "./animated/rainy-3.svg",
        "13d": "./animated/snowy-6.svg",
        "50d": "./animated/mist.svg",
        "01n": "./animated/night.svg",
        "02n": "./animated/cloudy-night-1.svg",
        "03n": "./animated/cloudy-night-2.svg",
        "04n": "./animated/cloudy-night-3.svg",
        "09n": "./animated/rainy-1.svg",
        "10n": "./animated/rainy-2.svg",
        "11n": "./animated/rainy-3.svg",
        "13n": "./animated/snowy-6.svg",
        "50n": "./animated/mist.svg"
    };

    return icons[icon] || "./animated/default-icon.svg"; // Provide a default icon if no match
}
