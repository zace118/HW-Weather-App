// ------Geolocation stuff------
    
function getLocation(){
    if (navigator.geolocation){
        const currentPosition = navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){

    // console.log(position);

    const geoLat = position.coords.latitude; 
    const geoLon = position.coords.longitude;
    // console.log(geoLat);
    // console.log(geoLon);

    $.ajax({
        url:'https://api.openweathermap.org/data/2.5/uvi?appid=dd0390e9886af8c80bbda292ef25a74c&lat=' + geoLat + '&lon=' + geoLon,
        method: "GET"
    }).then(function(response){
        // console.log(response);
    })
    
    $.ajax({
        url:'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + geoLat + ',' + geoLon + '&key=AIzaSyBpZZdD3TjpeQHhp9EV63t1sE4PIPTqo58',
        method: 'GET'
    }).then(function(res){
        console.log(res);
        console.log(res.results[6].formatted_address);
        const geoCityName = res.results[6].formatted_address;
        getAJAX(geoCityName);
        searchedCitiesArray.push(geoCityName);
        searchedCities(geoCityName);
    })
}   

getLocation()




//------Dropdown menu stuff----------

const searchedCitiesArray = [];

function searchedCities(getButton) {
    // Deleting the cities prior to adding new cities
    // (this is necessary otherwise you WILL have repeat cities)
    $('#dropdown').empty();

    // Looping through the array of movies
    for (let i = 0; i < searchedCitiesArray.length; i++) {
        
        // Then dynaically generating <a>'s for the dropdown for each searched city
        const a = $("<a>");
        // Adding a class of "dropdown-item" to our <a> tag
        a.addClass("dropdown-item");
        // Adding the initial dropdown item text
        a.text(searchedCitiesArray[i]);
        // Adding the dropdown item to the dropdown div
        $('#dropdown').prepend(a);
    }
}


// ------Main onclick function that sets all the info up------

$("#searchButton").on('click', function(){
    
    const cityName = $('#searchBar').val();
    // console.log(cityName);
    getAJAX(cityName);
    $("#searchBar").val('');

    //Adding the city from the searchbar to our array
    searchedCitiesArray.push(cityName);

    //Calling the searchedCities function which handles the processing of our searchedCitiesArray array lol
    searchedCities();
});


// ------Main function that puts all the info on the page------

function getAJAX(someCity){

//--------Emptying the cards between searches!!!!!!-----------
    const a = $("#cardSlot").children();
    a.remove();
    $('#cityName').empty();
    $('#cityTemp').empty();
    $('#cityHumidity').empty();
    $('#cityWind').empty();

    // AJAX call to open weather api. Contains another AJAX call for the UVI
    $.ajax({
        url:"https://api.openweathermap.org/data/2.5/weather?q=" + someCity + "&units=imperial&appid=dd0390e9886af8c80bbda292ef25a74c",
        method: "GET"
    }).then(function(res){
        // console.log(res);
        $('#cityName').text(res.name);
    

        // Pulling and setting the icons
        const currentIcon = res.weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/"+currentIcon+"@2x.png"
        $('#cityName').append("<img src="+iconURL+">");


        // Temperature variables and such
        $('#cityTemp').append(res.main.temp + '°')
    
        // Pulling and setting humidity
        $('#cityHumidity').append(res.main.humidity + '%');

        // Pulling and setting windspeed
        $('#cityWind').append(res.wind.speed + ' mph');


        //Setting variables for latitude and longitude to be used in the next AJAX call
        const lat = res.coord.lat;
        const lon = res.coord.lon;
        // This is the AJAX call to pull and set the UVI
        $.ajax({
            url:'https://api.openweathermap.org/data/2.5/uvi?appid=dd0390e9886af8c80bbda292ef25a74c&lat=' + lat + '&lon=' + lon,
            method: "GET"
        }).then(function(response){
            $("#cityUVI").text(response.value)
        })

        const cityID = res.id;
        
        // This is the AJAX call that will help set the cards
        $.ajax({
            url:"https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial&appid=dd0390e9886af8c80bbda292ef25a74c",
            method: "GET"
        }).then(function(res){
                console.log(res);
                console.log((res.list[0].dt_txt).slice(5,10));

            //This is the for loop that 
            for (let i = 0; i < res.list.length; i++) {
                if (res.list[i].dt_txt.indexOf("12:00") !== -1){  

                    // $(".card").remove();

                    $('#icon' + i).empty();
                    // // $('#icon1').empty();

                    $('#cardTemp' + i).empty();
                    // // $('#cardTemp1').empty();

                    $('#cardHum' + i).empty();
                    // $('#cardHumidity1').empty();


                    const cardIcon = res.list[i].weather[0].icon;
                    // console.log(cardIcon);
                    const iconURL = "http://openweathermap.org/img/wn/"+cardIcon+"@2x.png"
                    // console.log(iconURL);


                    //Generates the div tg to begin creating the cards.
                    const parentDiv = $("<div>");
                    //Adds class and ID to parentDiv
                    parentDiv.addClass("card").attr('id', 'day' + i).attr('style', 'width:13rem;');


                    //Generates the div tag for the cards
                    const childDiv= $("<div>");
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
                    const humTag =$("<b>Humidity: </b>");
                    //Adds id to the b tag
                    humTag.attr("id", "cardHum" +i);

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
                    let m = moment().format('dddd, MMMM Do YYYY');
                    //Using the procided date, sliced out of the data_text within the JSON
                    let forecast = ((res.list[i].dt_txt).slice(5,10));
                        // console.log(forecast);


                    // Pasting all the info onto the cards, dynamically
                    $('#currentDate').text(m);
                    $('#nextDay' + i).text(forecast);
                    $('#icon' + i).append("<img src="+iconURL+">");
                    $('#cardTemp' + i).append(res.list[i].main.temp + '°');        $('#cardHum' + i).append(res.list[i].main.humidity + '%');

                    
                    


                } 
            }
        })
    })
}




//This function activates a re-search of the button's titled city in the dropdown menu. 
$(document).on('click', ".dropdown-item", function(){
    console.log($(this).text());
    const cityName = $(this).text();
    getAJAX(cityName);
});



//LocalStorage stuff
// ------------------------------------------------------------

// This is where localStorage will do it's thang. The only thing is that I don't know where to go from here. I don't know what to save as the key and the value. I know I need the buttons to save to localStorage. I just don't know how to do that based on a key and a value?
// const buttonName = $('.dropdown-item').val();
// console.log(buttonName);
// const stuff = 2;
// localStorage.setItem(buttonName, stuff)