// Code crafted by Chirrenthen
// PixlQR Javascript 

const API_KEY = '82005d27a116c2880c8f0fcb866998a0';

// Element references
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const loaderOverlay = document.getElementById('loaderOverlay');
const initialState = document.getElementById('initialState');
const weatherData = document.getElementById('weatherData');

// Weather data elements
const locName = document.getElementById('locName');
const dateTime = document.getElementById('dateTime');
const weatherIcon = document.getElementById('weatherIcon');
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('desc');
const feelsEl = document.getElementById('feels');
const humEl = document.getElementById('hum');
const windEl = document.getElementById('wind');
const sunriseEl = document.getElementById('sunrise');
const sunsetEl = document.getElementById('sunset');
const latEl = document.getElementById('lat');
const lonEl = document.getElementById('lon');
const pressEl = document.getElementById('press');
const visiEl = document.getElementById('visi');
const cloudEl = document.getElementById('cloud');
const dirEl = document.getElementById('dir');

// Initialize map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker;

// Show loader
function showLoader() {
  loaderOverlay.classList.remove('hidden');
}

// Hide loader and show weather data
function hideLoader() {
  loaderOverlay.classList.add('hidden');
}

// Convert wind degrees to direction
function toCardinal(deg) {
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  return directions[Math.round(deg / 45) % 8];
}

// Fetch weather data
function fetchWeather(url) {
  showLoader();
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        updateUI(data);
        initialState.classList.add('hidden');
        weatherData.classList.remove('hidden');
      } else {
        alert(data.message);
      }
      hideLoader();
    })
    .catch(error => {
      console.error('Error:', error);
      hideLoader();
      alert('Failed to fetch weather data');
    });
}

// Update UI with weather data
function updateUI(data) {
  // Location info
  locName.textContent = `${data.name}, ${data.sys.country}`;
  
  // Date and time
  const localTs = (data.dt + data.timezone) * 1000;
  const dt = new Date(localTs);
  dateTime.textContent = dt.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Weather icon and temp
  const id = data.weather[0].id;
  // Use custom icons based on weather condition
  if (id === 800) {
    weatherIcon.src = "icons/clear.svg";
  } else if (id >= 200 && id <= 232) {
    weatherIcon.src = "icons/storm.svg";
  } else if (id >= 600 && id <= 622) {
    weatherIcon.src = "icons/snow.svg";
  } else if (id >= 701 && id <= 781) {
    weatherIcon.src = "icons/haze.svg";
  } else if (id >= 801 && id <= 804) {
    weatherIcon.src = "icons/cloud.svg";
  } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
    weatherIcon.src = "icons/rain.svg";
  } else {
    // fallback to OpenWeatherMap icon if no custom icon matches
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  }
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  descEl.textContent = data.weather[0].description;

  // Stats
  feelsEl.textContent = `${Math.round(data.main.feels_like)}°C`;
  humEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  
  // Sunrise and sunset
  sunriseEl.textContent = new Date((data.sys.sunrise + data.timezone) * 1000)
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  sunsetEl.textContent = new Date((data.sys.sunset + data.timezone) * 1000)
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Map coordinates
  const lat = data.coord.lat;
  const lon = data.coord.lon;
  latEl.textContent = `Latitude: ${lat.toFixed(4)}`;
  lonEl.textContent = `Longitude: ${lon.toFixed(4)}`;
  
  // Update map
  if (marker) {
    marker.setLatLng([lat, lon]);
  } else {
    marker = L.marker([lat, lon]).addTo(map);
  }
  map.setView([lat, lon], 10);

  // Bottom stats
  pressEl.textContent = `${data.main.pressure} hPa`;
  visiEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  cloudEl.textContent = `${data.clouds.all}%`;
  dirEl.textContent = toCardinal(data.wind.deg);
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
  }
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`);
      },
      error => {
        alert('Unable to retrieve your location. Please enable location services or search manually.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser. Please search manually.');
  }
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

// Smooth scrolling for nav links
document.querySelectorAll('header nav a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth'
    });
    
    // Update active nav link
    document.querySelectorAll('header nav a').forEach(link => {
      link.classList.remove('active');
    });
    a.classList.add('active');
  });
});

// Dashboard button click handler
document.querySelector('.btn.primary').addEventListener('click', function() {
  document.querySelector('#weather').scrollIntoView({
    behavior: 'smooth'
  });
  
  // Update active nav link
  document.querySelectorAll('header nav a').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector('header nav a[href="#weather"]').classList.add('active');
});

// API button click handler
document.querySelector('.btn.secondary').addEventListener('click', function() {
  alert('API documentation would open here');
});

// Initial load - try to get user's location
window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`);
      },
      () => {
        hideLoader();
      }
    );
  } else {
    hideLoader();
  }
});