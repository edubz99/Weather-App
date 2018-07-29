const weatherModule = (() => {
    //SELECTORS
    const displayWeather = document.querySelector('.display-weather-results');
    const autoComplete = document.querySelector('.huge-list');
    ///CITIES ARRAY
    const cities = [];

    const stringCapitalise = (string) => {
        return string
            .toLowerCase()
            .split()
            .map(word => word[0].toUpperCase() + word.substr(1))
            .join(' ');
    }

    //Find all matches that match with the search term
    const findMatches = (wordToMatch, cities) => {
        return cities[0].filter(place => {
            //g = global, i = insensitive case 
            const regex = new RegExp(wordToMatch, 'gi');
                return place.name.match(regex)
            });
    }
    fetch('citylist1.json')
    .then((response) => response.json())
    .then(data => cities.push(data))

    ///Display all cities that match with the search term
    function displayMatches() {
        //findMatches function passing it the search value and cities array
        const matchedArray = findMatches(this.value, cities);

        const mappedArray = matchedArray.map(place => {
            return `<option value="${place.name}, ${place.country}">${place.name}, ${place.country}</option>`
        }).join('');

        const finalResults = mappedArray;

        autoComplete.innerHTML = mappedArray;
    } 
    //Fetch Weather Icon
    function fetchIcon(code) {
        const image = `https://openweathermap.org/img/w/${code}.png`;
        return image;
    } 

    return {
        //Handles Search onsubmit
        handleSearch: function(e){
            e.preventDefault();
            const searchValue = search.value;
            //Call Fetch Method based on SearchValue
            this.handleFetch(searchValue);
            //Reset the text input
            search.value = "";
        },
        //Calls fetch API to get queried url
        handleFetch: async function(searchValue) {
            const dataRequest = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&units=metric&APPID=04ee0d6b874c146c6a71d91941de4dc2`);
            const dataResponse = await dataRequest.json();
            console.log(dataResponse);
            this.renderResults(dataResponse);
        },
         //LOOP THROUGH RESULTS
        renderResults: (data) => {
            const cityName = data.city.name;
            const countryName = data.city.country;
            const weatherDescr = stringCapitalise(data.list[0].weather[0].description);
            //Get weather Icon code
            const weatherIconCode = data.list[0].weather[0].icon;
            //Call fetchIcon
            const getIcon = fetchIcon(weatherIconCode);
            const humidity = data.list[0].main.humidity;
            const temperature = Math.round(data.list[0].main.temp);
            
            const formattedData = `
                <div class="weather-pill">
                    <div><img src="${getIcon}"><span class="temp">${temperature} &#8451;</span></div>
                    <p><span class="weather-location">${cityName}, ${countryName}</span></p>
                    <p><span class="highight">${weatherDescr}</span></p>
                    <p>Humidity: <span class="highight">${humidity}%</span></p>
                </div>
            
            `;
            displayWeather.innerHTML = formattedData;
        }
    }
})();

const search = document.querySelector('.weather-search');
const form = document.querySelector('.search-form').addEventListener('submit',weatherModule.handleSearch.bind(weatherModule));
