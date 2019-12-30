// Variables and jQuery to set dates
let m = moment().format('dddd, MMMM Do YYYY');
let forecast1 =moment().add(1,'d').format('l');
let forecast2 =moment().add(2,'d').format('l');
let forecast3 =moment().add(3,'d').format('l');
let forecast4 =moment().add(4,'d').format('l');
let forecast5 =moment().add(5,'d').format('l');

$('#currentDate').text(m);
$('#nextDay1').text(forecast1);
$('#nextDay2').text(forecast2);
$('#nextDay3').text(forecast3);
$('#nextDay4').text(forecast4);
$('#nextDay5').text(forecast5);

$("#searchButton").on('click', function(){
    console.log($('#searchBar').val());
    // const cityName = "Denver";
    const cityName = $('#searchBar').val();


    // AJAX call to open weather api. Contains another AJAX call for the UVI
    $.ajax({
        url:"https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=dd0390e9886af8c80bbda292ef25a74c",
        method: "GET"
    }).then(function(res){
        console.log(res);
        $('#cityName').text(res.name);
    

        // Pulling and setting the icons
        const currentIcon = res.weather[0].icon;
        // console.log(currentIcon);
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
            
        })

    })

    
});