const cityName = "Austin";
// const cityName = $('#citySearch').val();

console.log(cityName);

$.ajax({
    url:"api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=4f1be33da289be12850fc4f1ffb442c2",
    method: "GET"
}).then(function(res){
    console.log(res);
})