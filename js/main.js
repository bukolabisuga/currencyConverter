let fromCurrencyInput = document.getElementById('inputFromCurrency'),
    toCurrencyInput = document.getElementById('inputToCurrency'),
    amountInput = document.getElementById('inputAmount');

function getCurrencies() {
    fetch('https://free.currencyconverterapi.com/api/v5/currencies')
        .then(response => {
            return response.json();
        })
        .then(data => {
            let currencies = data.results;
            console.log(currencies);
            populateOptions(currencies);
        });
    console.log(`Hello ALC!!!`)
}
getCurrencies();

function populateOptions(currencies) {
    for (let currency of Object.keys(currencies).sort()) {
        let { currencyName, currencySymbol, id } = currencies[currency];
        // console.log(currencyName)
        // console.log(id)
        if (!currencySymbol) {
            currencySymbol = 'No Symbol';
        }
        let optionFrom = document.createElement('option');
        optionFrom.innerText = `${id} ( ${currencyName}, ${currencySymbol} )`;
        optionFrom.value = `${id}`;

        let optionTo = document.createElement('option');
        optionTo.innerText = `${id} ( ${currencyName}, ${currencySymbol})`;
        optionTo.value = `${id}`;

        fromCurrencyInput.appendChild(optionFrom);
        toCurrencyInput.appendChild(optionTo);

        let optionSymbol = `${currencySymbol}`;
    }
}

document.getElementById('convert').addEventListener('click', getConversion);
// Where did you define dbPromise?
function getConversion(amount, from, to, cb) {
    from = fromCurrencyInput.value.split('').splice(0, 3).join('');
    to = toCurrencyInput.value.split('').splice(0, 3).join('');
    console.log(toCurrencyInput.value);
    amount = amountInput.value;
    let query = `${from}_${to}`;
    console.log({ query })
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`)
        .then(response =>
            response.json()
        )
        .then(data => {
            console.log(data)
            let rate = data[query];
            console.log(data[query]);

            document.getElementById('convertedCurrency').innerText = `${(Math.round(parseFloat(amount) * rate)).toLocaleString('en')} ${to}`;

            document.getElementById('convertedSummary').innerText = `${amount.toLocaleString('en')} ${from} at rate of ${rate.toFixed(2)} ${to}`;

            dbPromise.then(db => {
                const ex_rate = {
                    pair: Object.keys(data)[0],
                    exchange_rate: Object.values(data)[0][0]
                };
                const ty = db.transaction('conversion', 'readwrite');
                ty.objectStore('conversion').put(ex_rate);
                console.log(`yessss ${JSON.stringify(ex_rate)}`);
                return ty.complete;
            }).then(() => {
                
                console.log('Added exchange rate to conversion');
            });
        })
}