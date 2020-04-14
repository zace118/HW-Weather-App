const openWeatherKey = config.openWeatherKey;
const googleMapsKey = config.googleMapsKey;


//Geolocation stuff
function getLocation() {
    if (navigator.geolocation) {
        const currentPosition = navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    console.log(position);

    //Getting the latitude and longitude from the geolocation that is determined above using geolocation.
    const geoLat = position.coords.latitude;
    const geoLon = position.coords.longitude;
    // console.log(geoLat);
    // console.log(geoLon);


    // Using google, I reverse geolocate to get the town name. This isn't perfect yet as sometimes it returns "Arizona, USA"
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + geoLat + "," + geoLon + "&key=" + googleMapsKey,
        method: "GET"
    }).then(function (res) {
        // console.log(res);

        // This variable slices the results array backwards, then I take the zeroeth index from that new array, and access that address. This has proved most successful. 
        const geoCityName = res.results.slice(-4)[0].formatted_address;
        console.log(geoCityName);
        getAJAX(geoCityName);
        searchedCitiesArray.push(geoCityName);
        searchedCities(geoCityName);
    });
}

getLocation();

// This is the searchedCitiesArray. Initially will start as an empty array, but upon reload, will PULL the searchedCitiesHistory that I set on line 223 from localStorage.
const searchedCitiesArray = JSON.parse(localStorage.getItem("searchedCitiesHistory")) || [];

//This function creates the buttons within the dropdown menu
function searchedCities(getButton) {
    // Deleting the cities prior to adding new cities
    // (this is necessary otherwise you WILL have repeat cities)
    $("#dropdown").empty();

    // Looping through the array of movies
    for (let i = 0; i < searchedCitiesArray.length; i++) {
        // Then dynamically generating <a>'s for the dropdown for each searched city
        const a = $("<a>");
        // Adding a class of "dropdown-item" to our <a> tag
        a.addClass("dropdown-item");
        // Adding the initial dropdown item text
        a.text(searchedCitiesArray[i]);
        // Adding the dropdown item to the dropdown div
        $("#dropdown").prepend(a);
    }
}

// Main onclick function that sets all the info up
$("#searchButton").on("click", function () {
    const cityName = $("#searchBar").val();
    // console.log(cityName);
    getAJAX(cityName);
    $("#searchBar").val("");

    //if statement that looks for if cityName doesn't exist in the searchedCitiesArray, push the cityName. Both of these statements do the same thing, one utilizes indexOf and one utilizes includes.

    // if (searchedCitiesArray.indexOf(cityName) === -1) {
    //     // Add the city from the searchbar to our array
    //     searchedCitiesArray.push(cityName);
    // }

    if (!searchedCitiesArray.includes(cityName)) {
        //Add the city from the searchbar to our array
        searchedCitiesArray.push(cityName);
    }

    //Calling the searchedCities function which handles the processing of our searchedCitiesArray array
    searchedCities();
});

// Main function that puts all the info on the page
function getAJAX(someCity) {
    //Emptying the cards between searches
    const a = $("#cardSlot").children();
    a.remove();

    //Emptying the jumbotron between searches
    $("#cityName").empty();
    $("#cityTemp").empty();
    $("#cityHumidity").empty();
    $("#cityWind").empty();

    // AJAX call to open weather api. Contains another AJAX call for the UVI
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + someCity + "&units=imperial&appid=" + openWeatherKey,
        method: "GET"
    }).then(function (res) {
        // console.log(res);
        $("#cityName").text(res.name);

        // Pulling and setting the icons
        const currentIcon = res.weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png";
        $("#cityName").append("<img src=" + iconURL + ">");

        // Temperature variables and such
        $("#cityTemp").append(res.main.temp + "°");

        // Pulling and setting humidity
        $("#cityHumidity").append(res.main.humidity + "%");

        // Pulling and setting windspeed
        $("#cityWind").append(res.wind.speed + " mph");

        //Setting variables for latitude and longitude to be used in the next AJAX call
        const lat = res.coord.lat;
        const lon = res.coord.lon;

        // This is the AJAX call to pull and set the UVI
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + openWeatherKey + "&lat=" + lat + "&lon=" + lon,
            method: "GET"
        }).then(function (response) {
            $("#cityUVI").text(response.value);
        });

        const cityID = res.id;

        // This is the AJAX call that will help set the cards
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial&appid=" + openWeatherKey,
            method: "GET"
        }).then(function (res) {
            console.log(res);
            console.log(res.list[0].dt_txt);
            console.log(res.list[0].dt_txt.slice(5, 10));
            //This loops through the response we get for any of the 3 hour increments that don't match "12:00", and takes all the information, posts it to a new card
            for (let i = 0; i < res.list.length; i++) {
                if (res.list[i].dt_txt.indexOf("12:00") !== -1) {
                    $("#icon" + i).empty();
                    $("#cardTemp" + i).empty();
                    $("#cardHum" + i).empty();

                    const cardIcon = res.list[i].weather[0].icon;
                    // console.log(cardIcon);

                    const iconURL =
                        "http://openweathermap.org/img/wn/" + cardIcon + "@2x.png";
                    // console.log(iconURL);

                    //Generates the div tag to begin creating the cards.
                    const parentDiv = $("<div>");
                    //Adds class and ID to parentDiv
                    parentDiv
                        .addClass("card")
                        .attr("id", "day" + i)
                        .attr("style", "width:13rem;");

                    //Generates the div tag for the cards
                    const childDiv = $("<div>");

                    //Adds class to childDiv1
                    childDiv.addClass("card-body");

                    // Generates the h5 tag for the cards
                    const hFive = $("<h5>");

                    //Adds class and ID to h5
                    hFive.addClass("card-title").attr("id", "nextDay" + i);

                    // Generates the h6 tag for the cards
                    const hSix = $("<h6>");

                    //Adds ID to h6
                    hSix.attr("id", "icon" + i);

                    //Generates the b tag for Temp for the cards
                    const tempTag = $("<b>Temp: </b>");

                    //Adds id to the b tag
                    tempTag.attr("id", "cardTemp" + i);

                    //Generates the b tag for the Humidity for the cards
                    const humTag = $("<b>Humidity: </b>");

                    //Adds id to the b tag
                    humTag.attr("id", "cardHum" + i);

                    // Creating the cards, dynamically
                    $(parentDiv).append(childDiv);
                    $(childDiv).append(hFive);
                    $(childDiv).append(hSix);
                    $(childDiv).append(tempTag);
                    $(childDiv).append($("<br>"));
                    $(childDiv).append(humTag);

                    // Appending the cards to the cardSlot ID in the aside in the HTML
                    $("#cardSlot").append(parentDiv);

                    // Using moment.js to set today's date
                    let m = moment().format("dddd, MMMM Do YYYY");

                    //Using the provided date, sliced out of the data_text within the JSON
                    let forecast = res.list[i].dt_txt.slice(5, 10);
                    // console.log(forecast);

                    // Pasting all the info onto the cards, dynamically
                    $("#currentDate").text(m);
                    $("#nextDay" + i).text(forecast);
                    $("#icon" + i).append("<img src=" + iconURL + ">");
                    $("#cardTemp" + i).append(res.list[i].main.temp + "°");
                    $("#cardHum" + i).append(res.list[i].main.humidity + "%");
                }
            }
        });
    });

    localStorage.setItem("searchedCitiesHistory", JSON.stringify(searchedCitiesArray));
    JSON.parse(localStorage.getItem("searchedCitiesHistory"));
}

//This function activates a re-search of the button's titled city in the dropdown menu.
$(document).on("click", ".dropdown-item", function () {
    console.log($(this).text());
    const cityName = $(this).text();
    getAJAX(cityName);
});