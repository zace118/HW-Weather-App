const cityName = "Austin";
// const cityName = $('#citySearch').val();

console.log(cityName);

$.ajax({
    url:"api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=dd0390e9886af8c80bbda292ef25a74c",
    method: "GET"
}).then(function(res){
    console.log(res);
})