// Variables and jQuery to set dates
let m = moment().format('dddd, MMMM Do YYYY');
let forecast1 = moment().add(1,'d').format('l');
let forecast2 = moment().add(2,'d').format('l');
let forecast3 = moment().add(3,'d').format('l');
let forecast4 = moment().add(4,'d').format('l');
let forecast5 = moment().add(5,'d').format('l');

$('#currentDate').text(m);
$('#nextDay1').text(forecast1);
$('#nextDay2').text(forecast2);
$('#nextDay3').text(forecast3);
$('#nextDay4').text(forecast4);
$('#nextDay5').text(forecast5);




const searchedCitiesArray = [];

function searchedCities() {
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




$("#searchButton").on('click', function(){
    
    

    // const cityName = "Denver";
    const cityName = $('#searchBar').val();
    console.log(cityName);
    getAJAX(cityName);
    $("#searchBar").val('');


    //Adding the city from the searchbar to our array
    searchedCitiesArray.push(cityName);

    //Calling the searchedCities function which handles the processing of our searchedCitiesArray array lol
    searchedCities();
});


function getAJAX(someCity){
    $('#cityName').empty();
    $('#cityTemp').empty();
    $('#cityHumidity').empty();
    $('#cityWind').empty();

    // AJAX call to open weather api. Contains another AJAX call for the UVI
    $.ajax({
        url:"https://api.openweathermap.org/data/2.5/weather?q=" + someCity + "&units=imperial&appid=dd0390e9886af8c80bbda292ef25a74c",
        method: "GET"
    }).then(function(res){
        console.log(res);
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
            // method: "GET"
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

            $('#icon1').empty();
            $('#icon2').empty();
            $('#icon3').empty();
            $('#icon4').empty();
            $('#icon5').empty();
            $('#cardTemp1').empty();
            $('#cardTemp2').empty();
            $('#cardTemp3').empty();
            $('#cardTemp4').empty();
            $('#cardTemp5').empty();
            $('#cardHumidity1').empty();
            $('#cardHumidity2').empty();
            $('#cardHumidity3').empty();
            $('#cardHumidity4').empty();
            $('#cardHumidity5').empty();

            // for (let i = 0; i < res.list.length; i++) {
            //     if (res.list[i].dt_txt.indexOf("12:00") !== -1){
            //         const cardIcon1 = res.list[i].weather[0].icon;
            //         const icon1URL = "http://openweathermap.org/img/wn/"+cardIcon1+"@2x.png"
            
            //         $('#icon0').append("<img src="+icon1URL+">");
            //         $('#cardTemp0').append(res.list[i].main.temp + '°');
            //         $('#cardHumidity0').append(res.list[i].main.humidity + '%');
            //     }
                
            // }

            // Everytime it loops, create a new car with class "card-body", etc..., then append the card to the row




            // Card 1
            const cardIcon1 = res.list[0].weather[0].icon;
            const icon1URL = "http://openweathermap.org/img/wn/"+cardIcon1+"@2x.png"
            
            $('#icon1').append("<img src="+icon1URL+">");
            $('#cardTemp1').append(res.list[0].main.temp + '°');
            $('#cardHumidity1').append(res.list[0].main.humidity + '%');


            // Card 2
            const cardIcon2 = res.list[8].weather[0].icon;
            const icon2URL = "http://openweathermap.org/img/wn/"+cardIcon2 +"@2x.png"
    
            $('#icon2').append("<img src="+icon2URL+">");
            $('#cardTemp2').append(res.list[8].main.temp + '°');
            $('#cardHumidity2').append(res.list[8].main.humidity + '%');


            // Card 3
            const cardIcon3 = res.list[16].weather[0].icon;
            const icon3URL = "http://openweathermap.org/img/wn/"+cardIcon3+"@2x.png"
    
            $('#icon3').append("<img src="+icon3URL+">");
            $('#cardTemp3').append(res.list[16].main.temp + '°');
            $('#cardHumidity3').append(res.list[16].main.humidity + '%');


             // Card 4
             const cardIcon4 = res.list[24].weather[0].icon;
             const icon4URL = "http://openweathermap.org/img/wn/"+cardIcon4+"@2x.png"
     
             $('#icon4').append("<img src="+icon4URL+">");
             $('#cardTemp4').append(res.list[24].main.temp + '°');
             $('#cardHumidity4').append(res.list[24].main.humidity + '%');


             // Card 5
             const cardIcon5 = res.list[36].weather[0].icon;
             const icon5URL = "http://openweathermap.org/img/wn/"+cardIcon5+"@2x.png"
     
             $('#icon5').append("<img src="+icon5URL+">");
             $('#cardTemp5').append(res.list[36].main.temp + '°');
             $('#cardHumidity5').append(res.list[36].main.humidity + '%');


        })
    })
}




//This is where the click listener should activate the search when a dropdown-item is clicked on....I'm on the right trail, but I don't think this is it. 
$(document).on('click', ".dropdown-item", function(){

    console.log($(this).text());
    const cityName = $(this).text();
    getAJAX(cityName);
});

// searchedCities();