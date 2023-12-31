
let city = "";
// variable declaration
let searchCity = $("#search-city");
let searchButton = $("#search-button");
let clearButton = $("#clear-history");
let currentCity = $("#current-city");
let currentTemperature = $("#temperature");
let currentHumidty = $("#humidity");
let currentWSpeed = $("#wind-speed");
let sCity = [];
// searches the city from storage
function find(c) {
  for (var i = 0; i < sCity.length; i++) {
    if (c.toUpperCase() === sCity[i]) {
      return -1;
    }
  }
  return 1;
}
//API key
let APIKey = "87f8820036e4c195bd05fb8a61b95a5f";
function displayWeather(event) {
  event.preventDefault();
  if (searchCity.val().trim() !== "") {
    city = searchCity.val().trim();
    currentWeather(city);
  }
}
// AJAX call
function currentWeather(city) {
  const queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    console.log(response);
    const weathericon = response.weather[0].icon;
    const iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
    const date = new Date(response.dt * 1000).toLocaleDateString();
    $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");
    const tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
    $(currentHumidty).html(response.main.humidity + "%");
    const ws = response.wind.speed;
    const windsmph = (ws * 2.237).toFixed(1);
    $(currentWSpeed).html(windsmph + "MPH");
    forecast(response.id);
    if (response.cod == 200) {
      sCity = JSON.parse(localStorage.getItem("cityname"));
      console.log(sCity);
      if (sCity == null) {
        sCity = [];
        sCity.push(city.toUpperCase()
        );
        localStorage.setItem("cityname", JSON.stringify(sCity));
        addToList(city);
      }
      else {
        if (find(city) > 0) {
          sCity.push(city.toUpperCase());
          localStorage.setItem("cityname", JSON.stringify(sCity));
          addToList(city);
        }
      }
    }

  });
}

// display the 5 days forecast for the current city.
function forecast(cityid) {
  const dayover = false;
  const queryforcastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
  $.ajax({
    url: queryforcastURL,
    method: "GET"
  }).then(function (response) {

    for (i = 0; i < 5; i++) {
      const date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
      const iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
      const iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
      const tempK = response.list[((i + 1) * 8) - 1].main.temp;
      const tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
      const humidity = response.list[((i + 1) * 8) - 1].main.humidity;

      $("#fDate" + i).html(date);
      $("#fTemp" + i).html(tempF + "&#8457");
      $("#fHumidity" + i).html(humidity + "%");
    }

  });
}

//Daynamically add the passed city on the search history
function addToList(c) {
  const listEl = $("<li>" + c.toUpperCase() + "</li>");
  $(listEl).attr("class", "list-group-item");
  $(listEl).attr("data-value", c.toUpperCase());
  $(".list-group").append(listEl);
}
// display the past search again when the list group item is clicked in search history
function invokePastSearch(event) {
  const liEl = event.target;
  if (event.target.matches("li")) {
    city = liEl.textContent.trim();
    currentWeather(city);
  }

}

function loadlastCity() {
  $("ul").empty();
  const sCity = JSON.parse(localStorage.getItem("cityname"));
  if (sCity !== null) {
    sCity = JSON.parse(localStorage.getItem("cityname"));
    for (i = 0; i < sCity.length; i++) {
      addToList(sCity[i]);
    }
    city = sCity[i - 1];
    currentWeather(city);
  }

}
//Clear the search history 
function clearHistory(event) {
  event.preventDefault();
  sCity = [];
  localStorage.removeItem("cityname");
  document.location.reload();

}
//Click Handlers
$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);
