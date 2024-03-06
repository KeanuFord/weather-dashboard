

function createHistoryCard() {
    const taskCard = $('<aside>').addClass('card historyCard my-3')
}

function renderSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (!searchHistory) searchHistory = [];

    const historyList = $('#historyCards');
    historyList.empty();

}

function displayWeather(weather) {
    console.log("==============================");
    console.log("City: " + weather.city.name);
    for(let i = 0; i < 5; i++) {
        console.log("==============================");
        console.log("Day " + (i+1));
        console.log("Temp: " + weather.list[i].main.temp);
        console.log("Wind: " + weather.list[i].wind.speed);
        console.log("Humidity: " + weather.list[i].main.humidity);
    }
    
}

function getLocation(name) {
    const apiKey = 'b1afece79c45b5ecc68a8d199c4aa2b7';
    let locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${apiKey}`;
    
    fetch(locationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (location)  {
            let weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${location[0].lat}&lon=${location[0].lon}&appid=${apiKey}`;
            
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