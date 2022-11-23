const fetch = require('node-fetch');
const cheerio = require('cheerio');



async function getSession(){
        return new Promise(function(resolve, reject){
            fetch('https://celebian.com/', {
                method: "GET",
                headers: {
                    'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language' : 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                }
                }).then(ress => {
                    const celebianSession = ress.headers.raw()['set-cookie'];
                    resolve(celebianSession);
                }).catch(err => reject(err))
        })
}


async function getTokenCsrf(session){
    return new Promise(function(resolve, reject){
        fetch(`https://celebian.com/checkout/likes`, {
                method: "GET",
                headers: {
                    'Cookie' : session,
                    'Accept' : '*/*',
                    'Accept-Language' : 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0',
                    
                }
                })
                .then(ress => ress.text())
                .then(async result => {
                    const $ = await cheerio.load(result);
                    const tokenCsrf = $('body > script:nth-child(9)').text();
                    resolve(tokenCsrf);
                })
    })
}


async function getAllDataUser(username,session,csrf){
    return new Promise(function(resolve, reject){
        fetch(`https://celebian.com/checkout/@${username}/media`, {
                method: "POST",
                headers: {
                    'Cookie' : session,
                    'Accept' : '*/*',
                    'Accept-Language' : 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0',
                    'Referer' : 'https://celebian.com/checkout/likes?package=100',
                   'Content-Type': 'application/json'
                    
                },
                body: `{"_token":"${csrf}","type":"","product":"likes"}`
                })
                .then(ress => ress.json()).then(result => {
                    resolve(result);
                })
    })
}


module.exports = {
    getSession, getTokenCsrf, getAllDataUser, fetch
};

