const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//Initially Variables
let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //Search form vaadu container is invisible , to aene visible karo bhai
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            //Pehla Search vaada tab par hata have your weather visible karvanu
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //Your weather tab ma aai gaya to have weather display karva maate local storage check karvi padse for coordinates agar aapde save karya hase to tya
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //Agar coordinates na padya hoy to 
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates); //JSON String ne JSON Object ma convert kare
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //Make GrantAccess Invisible
    grantAccessContainer.classList.remove("active");
    //Make Loader Visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        //HW
    }
}

function renderWeatherInfo(weatherInfo){
    //Firstle we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const decs = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //Fetch values from weatherInfo Object n put it in UI Element
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    decs.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        //HW - Show alert for no geolocation support available
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" ,getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",e => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        
    }
}

// console.log("MS Dhoni");

// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

//     document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails(){

//     try {
//         let city = "goa"
        //API Call
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        // const data = await response.json();
        // console.log("Weather Data -> ",data);

        // let newPara = document.createElement('p');
        // newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

        // document.body.appendChild(newPara);
    //     renderWeatherInfo(data);
    // } catch (error) {
        //Handle Error
    // }
    //https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
    
// }

// async function getCustomWeatherDetails(){
//     try {
//         let lat = 15.6333;
//         let lon = 18.3333;

//         let result = await fetch(`https://api.openweathemap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
//         let data = await result.json();
//         console.log(data);
//     } catch (error) {
//         console.log("Error Found" , error);
//     }
// }

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }else{
//         console.log("GeoLocation not supported");
//     }
// }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let lon = position.coords.longitude;
//     console.log(lat);
//     console.log(lon);
// }