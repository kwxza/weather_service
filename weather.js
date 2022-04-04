const axios = require('axios').default;

class Weather {
    
    //instance properties
    #cityWeatherList = {"cityNames": []};

    constructor() {

        this.#cityWeatherList.cityNames = [
            "Toronto",
            "Manhattan",
            "Rio de Janeiro",
            "Montevideo",
            "Paris",
            "Berlin",
            "Rome",
            "Cairo",
            "Seoul",
            "Shanghai",
            "Tokyo"   
        ];

        this.#cityWeatherList.cityNames.forEach(city => {
            this.#cityWeatherList[city] = {"fetched": false, "weather": {}};
        });

        this.updateAllCities();
        
    }

    // returns cities array
    getCityList() {
        return this.#cityWeatherList.cityNames;
    };

    // returns weather data for given city as a promise to allow for loading
    getCityWeather(city) { 

        // adds city to list if not present
        if(this.#cityWeatherList[city] == undefined) {
            this.#cityWeatherList.cityNames.push(city);
            this.#cityWeatherList[city] = {"fetched": false, "weather": {}};
            this.#updateCityWeather(city);
        }

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.#cityWeatherList[city]);
            }, 3000)
        });
    }

    // calls OpenWeatherMap api for a city and returns data as a promise
    async #fetchWeatherData(city) {
        const APIKEY = "3fd9ee6cdbbe676ef9c75c97ef54bdd8";

        // Set fetch status to false
        let weatherData = {"fetched": false};

        // return promise based on api call using axios library
        return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKEY}`)
            .then(response => {

                // Collect necessary response values
                weatherData["fetched"] = true;
                weatherData["coordinates"] = response.data.coord;
                weatherData["weather"] = {
                    "weather": response.data.weather[0].main,
                    "description": response.data.weather[0].description,
                    "iconUrl": `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`,
                    "temp": `${Math.round(response.data.main.temp)} °C`,
                    "feelsLike": `${Math.round(response.data.main.feels_like)} °C`
                };

            })
            .catch(error => {
                console.log("The request failed");
            })
            .then(() => {
                // Return weatherData, regardless if request failed or not
                return weatherData;
            });
    };

    // updates city's weather in #cityWeatherList
    async #updateCityWeather(city) {

        let data = await this.#fetchWeatherData(city);

        if (data.fetched) {
            this.#cityWeatherList[city] = data;
            // return true;
        }
        else {
            this.#cityWeatherList[city].fetched = false;
            // return false;
        }
        
    };

    // Get city data when creating instance of weather object
    async updateAllCities() {

        for (let i = 0; i < this.#cityWeatherList.cityNames.length; i++) {

            let city = this.#cityWeatherList.cityNames[i];

            await this.#updateCityWeather(city)

        }

    };

}

module.exports = Weather;
