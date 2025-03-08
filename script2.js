const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

// Fetch weather data on page load for user location
$(document).ready(() => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                weatherFn('', latitude, longitude);
            },
            () => weatherFn('Pune') // Default city if location is denied
        );
    } else {
        weatherFn('Pune');
    }
});

async function weatherFn(cName, lat = null, lon = null) {
    let tempUrl;

    if (lat && lon) {
        tempUrl = `${url}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        tempUrl = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
    }

    try {
        const res = await fetch(tempUrl);
        const data = await res.json();

        if (res.ok) {
            weatherShowFn(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Unable to fetch weather data. Please try again later.');
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    
    $('#weather-info').fadeIn();
}