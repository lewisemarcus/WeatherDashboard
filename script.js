//TODO: keep old searches in local storage
let userInput = document.querySelector('input')
const searchBtn = document.querySelector('button')
const cityEl = document.querySelector('#city')
const largeCard = document.querySelector('#large-weather')
const cards = document.querySelector('#cards')
const searchCol = document.getElementById('searchCol')
const error = document.createElement('p')
error.classList.add("error")

const api = 'd02fa9172dbf15e41731eb3c85cf0882'

function searchWeather() {
    //Removes error message if already present on page.
    if (searchCol.children[0].matches('.error')) {
        searchCol.children[0].remove()
    }
    if (userInput.value == "") {
        error.textContent = "Please enter a city..."
        searchCol.prepend(error)
    }
    else {
        const requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + userInput.value + ',us&units=imperial&appid=' + api
        //First fetch request to get lat and lon, One Call API takes lat lon only(no city entry).
        fetch(requestUrl)
            .then(function (response) {
                //Checks if response is valid.
                if (response.status == "404") {
                    console.log("INVALID ENTRY")
                    error.textContent = "INVALID ENTRY! Please enter a city..."
                    searchCol.prepend(error)
                }
                else {
                    return response.json()
                    .then(function (data) {
                        const lat = data.coord.lat
                        const lon = data.coord.lon
                        const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + api
                        const recentSearch = data.name
                        const newSearchBtn = document.createElement('button')
                        newSearchBtn.textContent = recentSearch
                        newSearchBtn.classList.add("btn", "newBtn", "btn-outline-secondary")
                        newSearchBtn.setAttribute("id", "new-search")
                        searchCol.append(newSearchBtn)
                        
                        //Removal of repeat entries, create an empty list to append true values for each new button.
                        const seenIDs = [];
                        for (let each = 0; each < document.getElementsByClassName('newBtn').length; each++) {
                            button = document.getElementsByClassName('newBtn')[each]
                            localStorage.setItem("new-button "+each, JSON.stringify(button))
                            //Checks to see if the textContent exists per button, and removes the old search.
                            if (seenIDs[button.textContent]) {
                                button.remove()
                            }
                            else {
                                //TODO: Create a localstorage item for the new button appended.
                                searchCol.append(newSearchBtn)
                                seenIDs[button.textContent] = true
                            }
                        }
                        localStorage.setItem("buttons", document.getElementsByClassName('newBtn').length)
                        //Recursive call of searchWeather if old searches are clicked.
                        newSearchBtn.addEventListener("click", function () {
                            userInput.value = recentSearch
                            searchWeather()
                        })
                        userInput.value = ""
                        //Fetch request to get UV Index and humidity from One Call API.
                        fetch(oneCallUrl)
                            .then(function (response) {
                                return response.json()
                            })
                            .then(function (data) {
                                document.querySelector('#city-date').textContent = moment().tz(data.timezone).format('L')
                                //Checks if there are news headlines in 'data', displays if existing
                                if (data.alerts != undefined) {
                                    document.querySelector('#card-headline').textContent = data.alerts[0].description.substring(3, 150) + '...'
                                }
                                else {
                                    document.querySelector('#card-headline').textContent = ""    
                                }
                                //Appending current day weather information to large card.                              
                                largeCard.children[0].textContent = "Temp: " + data.current.temp + " °F"
                                largeCard.children[1].textContent = "Wind Speed: " + data.current.wind_speed + " mph"
                                largeCard.children[2].textContent = "Humidity Level: " + data.current.humidity + "%"
                                largeCard.children[3].textContent = "UV Index: " + data.current.uvi
                                //Forecast loop which appends weather details to weather cards.
                                for (let each = 0; each < cards.children.length; each++) {
                                    const forecastUrl = 'https://openweathermap.org/img/wn/' + data.daily[each + 1].weather[0].icon + '.png'
                                    cards.children[each].children[0].children[1].innerHTML = ' <img src =' + forecastUrl + ' alt = "Image of day\'s weather icon">'
                                    cards.children[each].children[1].children[0].textContent = "Temp: " + data.daily[each + 1].temp.max + " °F"
                                    cards.children[each].children[1].children[1].textContent = "Wind Speed: " + data.daily[each + 1].wind_speed + " mph"
                                    cards.children[each].children[1].children[2].textContent = "Humidity Level: " + data.daily[each + 1].humidity + "%"
                                }
                            })
                        //Sets icon for large card.
                        iconURL = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
                        cityEl.innerHTML = data.name + ' <img src =' + iconURL + ' alt = "Image of weather icon">'

                    })
                }
            })
    }
}
userInput.setAttribute("autocomplete", "on")
searchBtn.addEventListener("click", searchWeather)

window.onload = function () {
    for (let each = 0; each < localStorage.getItem('buttons'); each++) {
        localStorage.getItem('new-button'+each)
    }
}