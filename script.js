const fs = require('fs')
const axios = require('axios')
// const puppeteer = require('puppeteer');

let tabURL = []
let nbEstablishments

async function scrapeJSONData(searchTerm, city, token) {

    /* ---------------------------------------------------------------
        Effectuer la requête API de local.ch
        (PROGRAMME TESTÉ SUR MAX 52 RÉPONSES)
    --------------------------------------------------------------- */

    const urls = [
        `https://www.local.ch/_next/data/${token}/fr/q/${encodeURIComponent(city)}/${searchTerm}.json?search=q&searchQuery=${encodeURIComponent(city)}searchQuery=${searchTerm}`,
        `https://www.local.ch/_next/data/${token}/fr/s/${encodeURIComponent(city)}/${searchTerm}.json?rid=2193ff&search=s&searchQuery=${encodeURIComponent(city)}&searchQuery=${searchTerm}`,
        `https://www.local.ch/_next/data/${token}/fr/s/${encodeURIComponent(city)}/${searchTerm}.json?rid=2193ff&search=s&page=2&searchQuery=${encodeURIComponent(city)}&searchQuery=${searchTerm}`,
        `https://www.local.ch/_next/data/${token}/fr/s/${encodeURIComponent(city)}/${searchTerm}.json?rid=2193ff&search=s&page=3&searchQuery=${encodeURIComponent(city)}&searchQuery=${searchTerm}`,
    ]

    try {
        const responses = await axios.all(urls.map(url => axios.get(url)))
        for (const response of responses) {
            if (response.data.pageProps.data !== undefined) {
                getEstablishments(response)
            }
        }

    } catch (error) {
        console.error('Une erreur est survenue lors du scraping JSON :', error)
    }

    const tabURLWithoutDuplicates = tabURL.filter((element, index) => tabURL.indexOf(element) === index)
    console.log("Nombre d'établissements : ", nbEstablishments)
    console.log(tabURLWithoutDuplicates.length === 0 ? "Pas de site web" : tabURLWithoutDuplicates)
}

function getEstablishments(response) {
    let establishments = response.data.pageProps.data.search.entries
    nbEstablishments = response.data.pageProps.data.search.total
    for (const establishment of establishments) {
        let contact = establishment.entry.contacts
        for (const c of contact) {
            if (c.__typename == "URLContact") {
                tabURL.push(c.value)
            }
        }
    }
    return
}

/* ---------------------------------------------------------------
    MAJUSCULES ET ACCENTS POSSIBLES DANS LES PARAMÈTRES
    AJOUTER (CATON) POUR AVOIR DIRECTEMENT PAR CANTON : Neuchâtel(canton)
    RÉCUPÉRER LE "TOKEN" MANUELLEMENT
--------------------------------------------------------------- */

scrapeJSONData('Ergothérapie', 'Neuchâtel(canton)', 'nL6VPFs1Mhnq2NkrSdTtY')

