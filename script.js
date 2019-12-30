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
            // console.log(res);


            // Card 1
            const cardIcon1 = res.list[0].weather[0].icon;
            const icon1URL = "http://openweathermap.org/img/wn/"+cardIcon1+"@2x.png"
            
            $('#nextDay1').append("<img src="+icon1URL+">");
            $('#cardTemp1').append(res.list[0].main.temp + '°');
            $('#cardHumidity1').append(res.list[0].main.humidity + '%');


            // Card 2
            const cardIcon2 = res.list[8].weather[0].icon;
            const icon2URL = "http://openweathermap.org/img/wn/"+cardIcon2+"@2x.png"
    
            $('#nextDay2').append("<img src="+icon2URL+">");
            $('#cardTemp2').append(res.list[8].main.temp + '°');
            $('#cardHumidity2').append(res.list[8].main.humidity + '%');


            // Card 3
            const cardIcon3 = res.list[16].weather[0].icon;
            const icon3URL = "http://openweathermap.org/img/wn/"+cardIcon3+"@2x.png"
    
            $('#nextDay3').append("<img src="+icon3URL+">");
            $('#cardTemp3').append(res.list[16].main.temp + '°');
            $('#cardHumidity3').append(res.list[16].main.humidity + '%');


             // Card 4
             const cardIcon4 = res.list[24].weather[0].icon;
             const icon4URL = "http://openweathermap.org/img/wn/"+cardIcon4+"@2x.png"
     
             $('#nextDay4').append("<img src="+icon3URL+">");
             $('#cardTemp4').append(res.list[24].main.temp + '°');
             $('#cardHumidity4').append(res.list[24].main.humidity + '%');


             // Card 5
             const cardIcon5 = res.list[36].weather[0].icon;
             const icon5URL = "http://openweathermap.org/img/wn/"+cardIcon5+"@2x.png"
     
             $('#nextDay5').append("<img src="+icon3URL+">");
             $('#cardTemp5').append(res.list[36].main.temp + '°');
             $('#cardHumidity5').append(res.list[36].main.humidity + '%');


        })

    })

    
});