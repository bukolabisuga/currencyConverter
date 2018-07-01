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
            // console.log(currencies);
            populateOptions(currencies);
        });
    console.log(`Hello ALC!!!`)
}
getCurrencies();

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
// Where did you define dbPromise?
function getConversion(amount, from, to, cb) {
    from = fromCurrencyInput.value.split('').splice(0, 3).join('');
    to = toCurrencyInput.value.split('').splice(0, 3).join('');
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

            document.getElementById('convertedCurrency').value = Math.round(parseFloat(amount) * rate);

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

retrieveRate();
console.log(retrieveRate('USD_NGN'));

function retrieveRate(ex_rate) {
    if ('indexedDB' in window) {
        console.log('YAAAAAAAYYYYY');
    }
    // here?
    const dbPromise = idb.open('cc-db2', 4, upgradeDb => {
        switch (upgradeDb.oldVersion) {
            case 0:
                console.log('making a new object store');
                let converterStore = upgradeDb.createObjectStore('converter', { keyPath: 'id' });
            case 1:
                console.log('making second object store');
                let conversionStore = upgradeDb.createObjectStore('conversion', { keyPath: 'pair' });
        }
    
    });
     dbPromise.then(db => {
         let currency_pair = ex_rate;
         console.log(currency_pair);
        return db.transaction('conversion').objectStore('conversion').get(currency_pair);
    })
    .then(objFromIDB => {
       
        console.log('you are done')
        console.log(`no way ${objFromIDB}`);
    })
}
