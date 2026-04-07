function getNavbar() {
    return document.querySelector('.navbar') || document.getElementsByTagName('navbar')[0];
}

function getMenuToggle() {
    return document.getElementById('menu-toggle');
}

var travelRates = null;

function updateMenuToggleState() {
    var navbar = getNavbar();
    var button = getMenuToggle();
    if (!navbar || !button) {
        return;
    }

    var isOpen = navbar.classList.contains('mobile');
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    button.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    button.textContent = '\u22EE';
}

function mobileMenu() {
    var navbar = getNavbar();
    if (!navbar) {
        return;
    }

    navbar.classList.toggle('mobile');
    updateMenuToggleState();
}

function getWeatherLabel(code) {
    var labels = {
        0: 'Ясно',
        1: 'Преимущественно ясно',
        2: 'Переменная облачность',
        3: 'Пасмурно',
        45: 'Туман',
        48: 'Туман с изморозью',
        51: 'Слабая морось',
        53: 'Умеренная морось',
        55: 'Сильная морось',
        61: 'Небольшой дождь',
        63: 'Дождь',
        65: 'Сильный дождь',
        71: 'Небольшой снег',
        73: 'Снег',
        75: 'Сильный снег',
        80: 'Ливень',
        95: 'Гроза'
    };

    return labels[code] || 'Погодные условия';
}

function initWeatherWidget() {
    var weatherMain = document.getElementById('weather-main');
    var weatherDetails = document.getElementById('weather-details');
    if (!weatherMain || !weatherDetails) {
        return;
    }

    fetch('https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,wind_speed_10m,weather_code&timezone=Europe%2FIstanbul')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('weather_error');
            }
            return response.json();
        })
        .then(function (data) {
            if (!data.current) {
                throw new Error('weather_data_error');
            }

            var temp = Math.round(data.current.temperature_2m);
            var wind = Math.round(data.current.wind_speed_10m);
            var label = getWeatherLabel(data.current.weather_code);

            weatherMain.textContent = temp + '°C';
            weatherDetails.textContent = label + '. Ветер: ' + wind + ' км/ч.';
        })
        .catch(function () {
            weatherMain.textContent = 'Нет данных';
            weatherDetails.textContent = 'Не удалось загрузить погоду. Проверьте интернет-соединение.';
        });
}

function initCurrencyWidget() {
    var currencyMain = document.getElementById('currency-main');
    var currencyDetails = document.getElementById('currency-details');
    if (!currencyMain || !currencyDetails) {
        return;
    }

    fetch('https://api.frankfurter.app/latest?from=TRY&to=USD,EUR')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('currency_error');
            }
            return response.json();
        })
        .then(function (data) {
            if (!data.rates || !data.rates.USD || !data.rates.EUR) {
                throw new Error('currency_data_error');
            }

            travelRates = data.rates;
            var usd = data.rates.USD.toFixed(4);
            var eur = data.rates.EUR.toFixed(4);

            currencyMain.textContent = '1 TRY = ' + usd + ' USD / ' + eur + ' EUR';
            currencyDetails.textContent = 'Обновлено по данным Frankfurter: ' + data.date + '.';
        })
        .catch(function () {
            currencyMain.textContent = 'Нет данных';
            currencyDetails.textContent = 'Не удалось загрузить курсы валют. Попробуйте позже.';
        });
}

function formatTry(amount) {
    return amount.toLocaleString('ru-RU') + ' TRY';
}

function initBudgetCalculator() {
    var btn = document.getElementById('budget-calc-btn');
    var result = document.getElementById('budget-result');
    if (!btn || !result) {
        return;
    }

    btn.addEventListener('click', function () {
        var days = parseFloat(document.getElementById('budget-days').value) || 0;
        var hotel = parseFloat(document.getElementById('budget-hotel').value) || 0;
        var food = parseFloat(document.getElementById('budget-food').value) || 0;
        var transport = parseFloat(document.getElementById('budget-transport').value) || 0;
        var activities = parseFloat(document.getElementById('budget-activities').value) || 0;

        if (days <= 0) {
            result.textContent = 'Укажите количество дней больше 0.';
            return;
        }

        var totalTry = Math.round(days * (hotel + food + transport + activities));
        var output = 'Примерный бюджет: ' + formatTry(totalTry) + '.';

        if (travelRates && travelRates.USD && travelRates.EUR) {
            var totalUsd = (totalTry * travelRates.USD).toFixed(0);
            var totalEur = (totalTry * travelRates.EUR).toFixed(0);
            output += ' Это примерно ' + totalUsd + ' USD или ' + totalEur + ' EUR.';
        }

        result.textContent = output;
    });
}

function initContactForm() {
    var form = document.querySelector('.cform');
    var result = document.getElementById('contact-result');
    if (!form || !result) {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        result.textContent = 'Спасибо! Запрос отправлен. Мы свяжемся с вами по email.';
        result.classList.add('contact-success');
        form.reset();
    });
}

function initFooterYear() {
    var yearElements = document.querySelectorAll('.footer-year');
    if (!yearElements.length) {
        return;
    }

    var year = new Date().getFullYear();
    for (var i = 0; i < yearElements.length; i++) {
        yearElements[i].textContent = year;
    }
}

function initScrollTopButton() {
    var button = document.getElementById('scroll-top-btn');
    if (!button) {
        button = document.createElement('button');
        button.id = 'scroll-top-btn';
        button.type = 'button';
        button.textContent = 'Наверх';
        button.setAttribute('aria-label', 'Прокрутить наверх');
        document.body.appendChild(button);
    }

    function toggleButton() {
        if (window.scrollY > 280) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    }

    button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleButton);
    toggleButton();
}

document.addEventListener('DOMContentLoaded', function () {
    var navbar = getNavbar();
    var menuToggle = getMenuToggle();
    if (!navbar) {
        initScrollTopButton();
        initFooterYear();
        return;
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', mobileMenu);
    }

    var links = navbar.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            if (window.innerWidth <= 800) {
                navbar.classList.remove('mobile');
                updateMenuToggleState();
            }
        });
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth > 800) {
            navbar.classList.remove('mobile');
        }
        updateMenuToggleState();
    });

    initWeatherWidget();
    initCurrencyWidget();
    initBudgetCalculator();
    initContactForm();
    initFooterYear();
    initScrollTopButton();
    updateMenuToggleState();
});
