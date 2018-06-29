let fromCurrencyInput = document.getElementById('inputFromCurrency'),
    toCurrencyInput = document.getElementById('inputToCurrency'),
    amountInput = document.getElementById('inputAmount');

function getCurrencies() {
    fetch('https://free.currencyconverterapi.com/api/v5/currencies')
        .then(response => {
            return response.json();
        })
        .then(function (data) {
            let currencies = data.results;
            // console.log(currencies);
            populateOptions(currencies);
        });
    console.log(`Hello ALC!!!`)
}

function populateOptions(currencies) {
    for (let currency of Object.keys(currencies).sort()) {
        let { currencyName, id } = currencies[currency];
        // console.log(currencyName)
        // console.log(id)
        let optionFrom = document.createElement('option');
        optionFrom.innerText = `${id} ( ${currencyName} )`;
        optionFrom.value = `${id}`;

        let optionTo = document.createElement('option');
        optionTo.innerText = `${id} ( ${currencyName} )`;
        optionTo.value = `${id}`;

        fromCurrencyInput.appendChild(optionFrom);
        toCurrencyInput.appendChild(optionTo);
    }
}

document.getElementById('convert').addEventListener('click', getConversion);

function getConversion(amount, from, to, cb) {
    from = fromCurrencyInput.value.split('').splice(0,3).join('');
    to = toCurrencyInput.value.split('').splice(0,3).join('');
    amount = amountInput.value;
    let query = `${from}_${to}`;
    console.log({query})
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`)
        .then(response =>
            response.json()
        )
        .then(function (data) {
            console.log(data)
            let rate = data[query];
            console.log(data[query]);
            
            document.getElementById('convertedCurrency').value = Math.round(parseFloat(amount) * rate)
        })

}

getCurrencies();

if ('serviceWorker' in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service worker registration succeeded:', registration);
    }).catch(function(error) {
      console.log('Service worker registration failed:', error);
    });
  } else {
    console.log('Service workers are not supported.');
  }
