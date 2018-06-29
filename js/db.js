const dbPromise = idb.open('cc-db', 1, upgradeDb => {
    console.log('making a new object store');
    let converterStore = upgradeDb.createObjectStore('converter', { keyPath: 'id' });
});

const apiUrl = 'https://free.currencyconverterapi.com/api/v5/currencies';
fetch(apiUrl)
    .then(response =>
        response.json()
    )
    .then(data => {
        dbPromise.then(db => {

            if (!db) return;

            currencies = [data.results];

            const transaction = db.transaction('converter', 'readwrite');
            const converterStore = transaction.objectStore('converter');

            currencies.forEach(currency => {
                for (let value in currency) {
                    converterStore.put(currency[value]);
                }
            });

            return transaction.complete;

        });

    });