const cityResultEl = document.querySelector('#city-result');
const tempResultEl = document.querySelector('#temp-result');
const windResultEl = document.querySelector('#wind-result');
const humidityResultEl = document.querySelector('#humidity-result');
const weatherIconEl = document.querySelector('#weather-icon');

function createHistoryCard() {
    const taskCard = $('<aside>').addClass('card historyCard my-3')
}

function renderSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (!searchHistory) searchHistory = [];

    const historyList = $('#historyCards');
    historyList.empty();

}

function displayWeather(result) {
     
    
    console.log("==============================");
    console.log(result);
    const { icon } = result.list[0].weather[0];

    weatherIconEl.src = `https://openweathermap.org/img/wn/${icon}.png`;
    cityResultEl.textContent = result.city.name;
    tempResultEl.textContent = result.list[0].main.temp;
    windResultEl.textContent = result.list[0].wind.speed;
    humidityResultEl.textContent = result.list[0].main.humidity;
}

function getLocation(name) {
    const apiKey = 'b1afece79c45b5ecc68a8d199c4aa2b7';
    let locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${apiKey}`;
    
    fetch(locationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (location)  {
            let weatherURL = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${location[0].lat}&lon=${location[0].lon}&appid=${apiKey}`;
            
            fetch(weatherURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (weather) {                
                displayWeather(weather);
            });
        });

    
}

function handleFormSubmit() {
    let formValue = document.querySelector('#cityInput').value;
    
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if(!searchHistory) searchHistory = [];

    searchHistory.push(formValue);

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    console.log(formValue);
    console.log(searchHistory);
    getLocation(formValue);
 }

const citySearch = document.querySelector('#searchBtn');
citySearch.addEventListener('click', handleFormSubmit);