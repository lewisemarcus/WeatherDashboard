const userInput = document.querySelector('input');
const searchBtn = document.querySelector('button');


function searchWeather() {
    const city = userInput.value.substring(0, userInput.value.indexOf(','));
    const state = userInput.value.substring(userInput.value.indexOf(',') +2);
    const requestUrl = 'api.openweathermap.org/data/2.5/weather?q='+city+','+state+'&appid=d02fa9172dbf15e41731eb3c85cf0882';
      

    console.log(city);
    console.log(state);
    fetch(requestUrl)
    .then(function (response) {
        console.log(response);
    });
}
userInput.setAttribute("autocomplete", "on");
searchBtn.addEventListener("click", searchWeather);