const CurrentWeatherApiKey = '409c10534073849c07b714b37131a911';
const CurrentWeatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
window.onload = function() {
    document.getElementById('komenda').focus();
};
document.addEventListener('click', function() {
    document.getElementById('komenda').focus();
});
document.getElementById('komenda')
    .addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const komenda = document.getElementById('komenda').value;
            if (komenda.toLowerCase() === 'help') {
                console.log('help');
                GetHelp();
            }
            else if (komenda.toLowerCase() === 'clear') {
                GetClear();
            }
            
            else if (komenda.includes('pogoda')) {
                const miasto = komenda.split(' ')[1];
                GetWeather(miasto);
            }
            else {
                appendError('Nieznana komenda - wpisz "help" aby uzyskać pomoc');
            }
            clearInput();
        }
    }
);
const parentElement = document.getElementById('output');

function GetWeather(miasto) {
    const url = `${CurrentWeatherApiUrl}?q=${miasto}&appid=${CurrentWeatherApiKey}&units=metric&lang=pl`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${miasto}&appid=${CurrentWeatherApiKey}&units=metric&lang=pl`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            appendBreak();
            appendParagraph('Aktualna pogoda:');
            appendBreak();
            appendBreak();
            appendParagraph(`   Miasto . . . . : ${data.name}`);
            appendParagraph(`   Temperatura. . : ${data.main.temp}°C`);
            appendParagraph(`   Odczuwalna . . . : ${data.main.feels_like}°C`)
            appendParagraph(`   Wiatr . . . . . : ${data.wind.speed}m/s`);
            appendParagraph(`   Wilgotność . . : ${data.main.humidity}%`);
            appendParagraph(`   Opis . . . . . : ${data.weather[0].description}`);
        }).catch(error => {
            console.error(error);
            appendBreak();
            appendError('Błąd podczas pobierania danych, miasta nie znaleziono');
        });
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            appendBreak();
            appendParagraph('Prognoza pogody na przyszłe dni:');
            appendBreak();
            appendBreak();
            let temperaturesPerDay = {};

for (let i = 0; i < data.list.length; i++) {
    const forecast = data.list[i];
    const date = forecast.dt_txt.split(' ')[0]; // Get the date part of the datetime string
    

    if (!temperaturesPerDay[date]) {
        temperaturesPerDay[date] = [];
    }

    temperaturesPerDay[date].push(forecast.main.temp);
}

for (let date in temperaturesPerDay) {
    let temperatures = temperaturesPerDay[date];
    let averageTemperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    let roundedTemperature = Math.round(averageTemperature);
    let dateObject = new Date(date);
    let options = { weekday: 'long' };
    let dayName = dateObject.toLocaleDateString('pl-PL', options);
    appendParagraph(`   ${date} - ${dayName} - ${roundedTemperature}°C`);
}
        }).catch(error => {
            console.error(error);});
}
function GetHelp() {
    appendBreak();
    appendParagraph('Dostępne komendy:');
    appendBreak();
    appendBreak();
    appendParagraph('   pogoda [miasto] - sprawdzenie pogody w danym mieście');
    appendParagraph('   clear - wyczyszczenie ekranu');
}
function GetClear() {
    document.getElementsByClassName('output')[0].innerHTML = '';
    document.getElementsByClassName('intro')[0].innerHTML = '';
}
function clearInput() {
    document.getElementById('komenda').value = '';
}
function appendParagraph(text) {
    let paragraph = document.createElement('p');
    paragraph.textContent = text;
    parentElement.appendChild(paragraph);
}
function appendBreak() {
    parentElement.appendChild(document.createElement('br'));
}
function appendError(text) {
    let paragraph = document.createElement('p');
    paragraph.style.color = 'red';
    paragraph.textContent = text;
    parentElement.appendChild(paragraph);
}