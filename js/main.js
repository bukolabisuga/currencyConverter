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
                return ty.complete;
            }).then(() => {
                console.log('Added exchange rate to conversion');
            });

        })

}

class MainController {
    static registerServiceWorker() {
        if (!navigator.serviceWorker) return;
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            if (!navigator.serviceWorker.controller) {
                return;
            }

            if (registration.waiting) {
                MainController.updateReady(registration.waiting);
                return;
            }

            if (registration.installing) {
                MainController.trackInstalling(registration.installing);
                return;
            }

            registration.addEventListener('updatefound', () => {
                MainController.trackInstalling(registration.installing);
            });

            let refreshing;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                window.location.reload();
                refreshing = true;
            });
        });
    }

    static trackInstalling(worker) {
        worker.addEventListener('statechange', () => {
            if (worker.state === 'installed') {
                MainController.updateReady(worker);
            }
        });
    }

    static updateReady(worker) {
        MainController.showAlert('New version available');

        refreshButton = document.getElementById('refresh');
        dismissButton = document.getElementById('dismiss');

        refreshButton.addEventListener('click', () => worker.postMessage({ action: 'skipWaiting' }));
        dismissButton.addEventListener('click', () => alert.style.display = 'none');
    }

    // update-only notification alert
    static showAlert(message) {
        alert.style.display = 'flex';
        const alertMessage = document.getElementById('alert-message');
        alertMessage.innerText = message;
    }
}
