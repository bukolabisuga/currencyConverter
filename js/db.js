if ('indexedDB' in window) {
    console.log('YAAAAAAAYYYYY');
}

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
    return db.transaction('conversion').objectStore('conversion').get(currency_pair);
})
.then(objFromIDB => {
	// Returns the Object in the Value column
    // For debugging purposes
    console.log('you are done')
	console.log(`no way ${objFromIDB}`);
})

const apiUrl = 'https://free.currencyconverterapi.com/api/v5/currencies';
fetch(apiUrl)
    .then(response =>
        response.json()
    )
    .then(currency => {
        dbPromise.then(db => {

            if (!db) return;

            currencies = [currency.results];

            const tx = db.transaction('converter', 'readwrite');
            const converterStore = tx.objectStore('converter');

            currencies.forEach(countryCurrency => {
                for (let value in countryCurrency) {
                    converterStore.put(countryCurrency[value]);
                }
            });

            return tx.complete;

        });

    });
