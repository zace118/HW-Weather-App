const cityName = "Austin";
let m =moment().format('dddd, MMMM Do YYYY');

// const cityName = $('#citySearch').val();

$('#currentDate').text(m);




$.ajax({
    url:"https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=dd0390e9886af8c80bbda292ef25a74c",
    method: "GET"
}).then(function(res){
    console.log(res);
    $('#cityName').text(res.name);

    let kelvinTemp = res.main.temp;
    let fahrenheitTemp = (Math.floor(((kelvinTemp - 273.15) * 1.80 + 32))); 
    $('#cityTemp').text(fahrenheitTemp + '°')

    $('#cityHumidity').text(res.main.humidity + '%');

    $('#cityWind').text(res.wind.speed + ' mph');

    const lat = res.coord.lat;
    const lon = res.coord.lon;

    $.ajax({
        url:'https://api.openweathermap.org/data/2.5/uvi?appid=dd0390e9886af8c80bbda292ef25a74c&lat=' + lat + '&lon=' + lon,
        method: "GET"
    }).then(function(response){
        console.log(response);
        $("#cityUVI").text(response.value)
    })
})