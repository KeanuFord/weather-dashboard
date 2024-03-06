const cityResultEl = document.querySelector('#city-result');
const tempResultEl = document.querySelector('#temp-result');
const windResultEl = document.querySelector('#wind-result');
const humidityResultEl = document.querySelector('#humidity-result');
const weatherIconEl = document.querySelector('#weather-icon');
const forecastCardsEl = document.querySelector('#forecastCards');

function renderSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (!searchHistory) searchHistory = [];

    const historyList = document.querySelector('#divWrap');
    if(historyList) historyList.remove();

    let divWrap = document.createElement('div');
    divWrap.setAttribute('id', 'divWrap');
    document.querySelector('#historyCards').append(divWrap);

    for(let i=0; i < searchHistory.length; i++) {
        let historyCard = document.createElement('section');
        historyCard.setAttribute('class', `center-align history search${i+1}`);

        let searchIndex = document.createElement('h3');
        searchIndex.textContent = `${searchHistory[i]}`;

        divWrap.append(historyCard);
        document.querySelector(`.search${i+1}`).append(searchIndex);
    }
}

function displayWeather(result) {
    console.log(result);
    
    // Current Weather Banner
    const { icon } = result.list[0].weather[0];
    weatherIconEl.src = `https://openweathermap.org/img/wn/${icon}.png`;
    
    cityResultEl.textContent = result.city.name;
    tempResultEl.textContent = result.list[0].main.temp;
    windResultEl.textContent = result.list[0].wind.speed;
    humidityResultEl.textContent = result.list[0].main.humidity;

    // 5 Day Forecast Cards

    let divWrap = document.createElement('div');
    divWrap.setAttribute('id', 'divWrap');
    document.querySelector('#forecastCards').append(divWrap);

    for(let i=0; i < 5; i++) {
        let index = (4+(8*i));
        let forecastCard = document.createElement('section');
        forecastCard.setAttribute('class', ` center-align forecast day${i+1}`);

        let forecastDate = document.createElement('h3');
        forecastDate.textContent = `${result.list[index].dt_txt}`;

        let forecastIcon = document.createElement('IMG');
        let { icon } = result.list[index].weather[0];
        forecastIcon.src = `https://openweathermap.org/img/wn/${icon}.png`;
        forecastIcon.setAttribute('class', 'imgCss');

        let cardBody = document.createElement('div');
        cardBody.setAttribute('id', 'cardBody');

        let forecastTemp = document.createElement('p');
        forecastTemp.textContent = `Temp: ${result.list[index].main.temp} F`;

        let forecastWind = document.createElement('p');
        forecastWind.textContent = `Wind: ${result.list[index].wind.speed} MPH`;

        let forecastHum = document.createElement('p');
        forecastHum.textContent = `Humidity: ${result.list[index].main.humidity}%`;


        divWrap.append(forecastCard);
        cardBody.append(forecastTemp, forecastWind, forecastHum);
        document.querySelector(`.day${i+1}`).append(forecastDate, forecastIcon, cardBody);
    }
    renderSearchHistory();
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

    if(searchHistory.length >= 9) {
        searchHistory.splice(0, 1);
    }
    searchHistory.push(formValue);

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    console.log(formValue);
    console.log(searchHistory);
    getLocation(formValue);
 }

const citySearch = document.querySelector('#searchBtn');
citySearch.addEventListener('click', handleFormSubmit);
renderSearchHistory();