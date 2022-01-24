const userInput = document.querySelector('input');
const searchBtn = document.querySelector('button');

const rainyWeather = 'https://wallpapercave.com/wp/EVszeFH.jpg';
const searchCol = document.getElementById('searchCol');

function searchWeather() {
    if (searchCol.chi)
    const city = userInput.value.substring(0, userInput.value.indexOf(','));
    const state = userInput.value.substring(userInput.value.indexOf(',') + 1).replace(/\s/g, '');
    const requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + state + ',us&units=imperial&appid=d02fa9172dbf15e41731eb3c85cf0882';

    fetch(requestUrl)
        .then(function (response) {
            console.log(response)
            return response.json()
                .then(function (data) {
                    if (data.ok) {
                        console.log(data)
                    }
                    else {
                        console.log("INVALID ENTRY")
                        const error = document.createElement('p')
                        error.textContent = "INVALID ENTRY!"
                        searchCol.append(error)
                    }
                })
        });
}

userInput.setAttribute("autocomplete", "on")
searchBtn.addEventListener("click", searchWeather)