const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

let tabURL = [];

async function scrapeJSONData(searchTerm, canton) {

    // Effectuer la requête API de local.ch
    const url = `https://www.local.ch/_next/data/8L8I1bmkv24nfxVIkLIDl/fr/q/${encodeURIComponent(canton)}/${searchTerm}.json?search=q&searchQuery=${encodeURIComponent(canton)}searchQuery=${searchTerm}`;
    try {
        const response = await axios.get(url);
        let establishments = response.data.pageProps.data.search.entries

        for (const establishment of establishments) {
            let contact = establishment.entry.contacts
            for (const c of contact) {
                if (c.__typename == "URLContact") {
                    tabURL.push(c.value)
                }
            }
        }

    } catch (error) {
        console.error('Une erreur est survenue lors du scraping JSON :', error);
    }

    const tabURLWithoutDuplicates = tabURL.filter((element, index) => tabURL.indexOf(element) === index);
    console.log(tabURLWithoutDuplicates);

}

/* ---------------------------------------------------------------
    PAS DE MAJUSCULES ET PAS D'ACCENTS DANS LES PARAMÈTRES
    Par exemple: Ergothérapie, Neuchâtel devient ergotherapie,neuchatel
--------------------------------------------------------------- */

scrapeJSONData('ergotherapie', 'geneve');

