// Grabbing elements 
const cityResultEl = document.querySelector('#city-result');
const tempResultEl = document.querySelector('#temp-result');
const windResultEl = document.querySelector('#wind-result');
const humidityResultEl = document.querySelector('#humidity-result');
const weatherIconEl = document.querySelector('#weather-icon');
const forecastCardsEl = document.querySelector('#forecastCards');

function renderSearchHistory() {
    // Pull array of searches from local storage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (!searchHistory) searchHistory = [];

    // Clear current cards on the page
    const historyList = document.querySelector('#histWrap');
    if(historyList) historyList.remove();

    // Create a wrapping div to store the cards
    let histWrap = document.createElement('div');
    histWrap.setAttribute('id', 'histWrap');
    document.querySelector('#historyCards').append(histWrap);

    // Loop through and create a card for the last 10 searches
    // Each card is an invisible button that calls handleHistoryClick
    // Passes its id as a string to the search query
    for(let i=0; i < searchHistory.length; i++) {
        let historyCard = document.createElement('button');
        historyCard.setAttribute('class', `btn history search${i+1} `);
        historyCard.setAttribute('id', `${searchHistory[i]}`);
        historyCard.setAttribute('onclick', "handleHistoryClick(id)");

        let searchIndex = document.createElement('h3');
        searchIndex.textContent = `${searchHistory[i]}`;

        // Card is added to query selector here
        histWrap.append(historyCard);
        document.querySelector(`.search${i+1}`).append(searchIndex);
    }
}

function displayWeather(result) {
    // Current Weather Banner
    const { icon } = result.list[0].weather[0];
    weatherIconEl.src = `https://openweathermap.org/img/wn/${icon}.png`;
    
    cityResultEl.textContent = result.city.name;
    tempResultEl.textContent = result.list[0].main.temp;
    windResultEl.textContent = result.list[0].wind.speed;
    humidityResultEl.textContent = result.list[0].main.humidity;

    // 5 Day Forecast Cards

    // Clear previous cards
    let previousCards = document.querySelector('#divWrap');
    if (previousCards) previousCards.remove();

    // Create containing div for the cards
    let divWrap = document.createElement('div');
    divWrap.setAttribute('id', 'divWrap');
    document.querySelector('#forecastCards').append(divWrap);

    // Loops to create a card for each of the next 5 days
    for(let i=0; i < 5; i++) {
        
        // Containing array has 40 entries sorted by time instead of date
        // This conversion lands on midnight of the next 5 days
        let index = (4+(8*i)); 
        
        // Create card
        let forecastCard = document.createElement('section');
        forecastCard.setAttribute('class', ` forecast day${i+1}`);

        // Card Date Header
        let forecastDate = document.createElement('h3');
        forecastDate.textContent = `${result.list[index].dt_txt.slice(0, 10)}`;

        // Card Weathe Icon
        let forecastIcon = document.createElement('IMG');
        let { icon } = result.list[index].weather[0];
        forecastIcon.src = `https://openweathermap.org/img/wn/${icon}.png`;
        forecastIcon.setAttribute('class', 'imgCss');

        // Card Body
        let cardBody = document.createElement('div');
        cardBody.setAttribute('id', 'cardBody');

        // Temperature
        let forecastTemp = document.createElement('p');
        forecastTemp.textContent = `Temp: ${result.list[index].main.temp} F`;

        // Wind Speed
        let forecastWind = document.createElement('p');
        forecastWind.textContent = `Wind: ${result.list[index].wind.speed} MPH`;

        // Humidity
        let forecastHum = document.createElement('p');
        forecastHum.textContent = `Humidity: ${result.list[index].main.humidity}%`;

        // Append all cards to the query selector
        divWrap.append(forecastCard);
        cardBody.append(forecastTemp, forecastWind, forecastHum);
        document.querySelector(`.day${i+1}`).append(forecastDate, forecastIcon, cardBody);
    }
    // Reprint search history with new entry
    renderSearchHistory();
}

function getLocation(name) {
    const apiKey = 'b1afece79c45b5ecc68a8d199c4aa2b7';
    
    // Grab name of city and convert to latitude and longitude cordinates
    let locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${apiKey}`;
    
    fetch(locationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (location)  {
            
            // Nested API call to use the latitude and longitude to grab weather data
            let weatherURL = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${location[0].lat}&lon=${location[0].lon}&appid=${apiKey}`;
            
            fetch(weatherURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (weather) {                
                // Data is process and card is created here
                displayWeather(weather);
            });
        }); 
}

// Handles the submit search to store it in history, and grab weather data
function handleFormSubmit() {
    let formValue = document.querySelector('#cityInput').value;
    
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if(!searchHistory) searchHistory = [];

    if(searchHistory.length >= 10) {
        searchHistory.splice(0, 1);
    }
    searchHistory.push(formValue);

    // Stores search into history
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
    // Parse location from API, get weather data, and create cards
    getLocation(formValue);
 }

// Same functionality as handleFormSubmit but takes a parameter instead of a search input
function handleHistoryClick(query) { 
    let formValue = query;
    
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if(!searchHistory) searchHistory = [];

    if(searchHistory.length >= 9) {
        searchHistory.splice(0, 1);
    }
    searchHistory.push(formValue);

    // Stores search into history
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Parse location from API, get weather data, and create cards
    getLocation(formValue);
 }



const citySearch = document.querySelector('#searchBtn');
citySearch.addEventListener('click', handleFormSubmit);
renderSearchHistory();
