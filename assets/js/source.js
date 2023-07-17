document.addEventListener("DOMContentLoaded", function () {
  // Define variables
  const apiKey = "e025ee669ee507198d45b48468ba6f83";
  const searchBtnEl = document.querySelector("#search-btn");
  const searchInputEl = document.querySelector("#search-input");
  const searchHistoryEl = document.querySelector("#search-history");
  const currentWeatherEl = document.querySelector("#current-weather");
  const forecastEl = document.querySelector("#forecast");

  let cities = ['Detroit', 'Las Vegas', 'New York', 'Miami', 'Tulsa', 'San Francisco', 'Austin', 'Seattle'];

  // Add event listener for form submit
  document.querySelector('.search').addEventListener('submit', handleSearch);

  // Add event listener for search history buttons
  searchHistoryEl.addEventListener('click', handleHistorySearch);

  function init() {
    // Add `search-results` element to the DOM
    var searchResultsEl = document.createElement("div");
    searchResultsEl.id = "search-results";
    currentWeatherEl.parentNode.insertBefore(searchResultsEl, currentWeatherEl);

    // Call loadSearchHistory() function to load search history from local storage
    loadSearchHistory();
  }

  // Handle form submit
  function handleSearch(event) {
    event.preventDefault();
    var cityName = searchInputEl.value;
    if (cityName === "") {
      alert("Please enter a city name");
      return;
    }
    getWeatherData(cityName);
    addCityToSearchHistory(cityName);
  }

  // Handle search history button click
function handleHistorySearch(event) {
  var cityName = event.target.getAttribute("data-city");
  if (cityName) {
    event.preventDefault(); // Prevent form submission
    getWeatherData(cityName);
  }
}

// Display current weather data
function displayCurrentWeather(data) {
  var cityName = data.name;
  var currentDate = new Date().toLocaleDateString();
  var iconUrl = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
  var temperature = data.main.temp;
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;

  // Create a wrapper element for the current weather
  var currentWeatherWrapper = document.createElement("div");
  currentWeatherWrapper.classList.add("current-weather-wrapper");

  // Create elements for each weather information
  var cityInfo = document.createElement("div");
  cityInfo.innerHTML = `
    <h2>${cityName}</h2>
    <p>${currentDate}</p>
  `;

  var weatherInfo = document.createElement("div");
  weatherInfo.innerHTML = `
    <img src="${iconUrl}" class="weather-icon">
    <p>Temperature: ${temperature} &#8457;</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} MPH</p>
  `;

  // Append the elements to the wrapper
  currentWeatherWrapper.appendChild(cityInfo);
  currentWeatherWrapper.appendChild(weatherInfo);

  // Clear the current weather element
  currentWeatherEl.innerHTML = "";
  // Append the wrapper to the current weather element
  currentWeatherEl.appendChild(currentWeatherWrapper);
}

  // Display 5-day forecast data
  function displayForecast(data) {
    var forecast = data.list;
    var forecastHtml = "";

    for (var i = 0; i < forecast.length; i++) {
      // Get date and time for forecast item
      var forecastDateTime = forecast[i].dt_txt;
      var forecastDate = forecastDateTime.split(" ")[0];
      var forecastTime = forecastDateTime.split(" ")[1];

      // Only display forecast items for 3:00 PM
      if (forecastTime === "15:00:00") {
        // Get weather data for forecast item
        var iconUrl = "https://openweathermap.org/img/wn/" + forecast[i].weather[0].icon + ".png";
        var temperature = forecast[i].main.temp;
        var humidity = forecast[i].main.humidity;

        // Add forecast item HTML to forecastHtml variable
        forecastHtml += `
          <div class="card">
            <h3>${forecastDate}</h3>
            <img src="${iconUrl}">
            <p>Temperature: ${temperature} &#8457;</p>
            <p>Humidity: ${humidity}%</p>
          </div>
        `;
      }
    }

    // Update forecast element
    forecastEl.innerHTML = forecastHtml;
  }

  function getWeatherData(city) {
    // Current weather URL
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";

    // 5-day forecast URL
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

    // Get current weather data
    fetch(currentWeatherUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayCurrentWeather(data);
      })
      .catch(function (error) {
        console.log("Error getting current weather data:", error);
      });

    // Get forecast data
    fetch(forecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayForecast(data);
      })
      .catch(function (error) {
        console.log("Error getting forecast data:", error);
      });
  }

  function addCityToSearchHistory(city) {
    // Create button element for the city
    var buttonEl = document.createElement("button");
    buttonEl.textContent = city;
    buttonEl.setAttribute("data-city", city);

    // Append the button to the search history element
    searchHistoryEl.appendChild(buttonEl);
  }

  function loadSearchHistory() {
    // Load search history from local storage and add buttons to the search history element
    cities.forEach(function (city) {
      addCityToSearchHistory(city);
    });
  }

  // Call init() function
  init();
});