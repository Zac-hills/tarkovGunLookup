const cheerio = require("cheerio");
const axios = require("axios");

const pages = new Set();

const fetchData = async(siteUrl) => {
    try {
        const result = await axios.get(siteUrl);
        return cheerio.load(result.data);
    }
    catch {
        console.log('Error fetching data from ' + siteUrl);
        return cheerio.load("");
    }
};

const initListOfPagesToCrawl = async() => {
    const $ = await fetchData("https://escapefromtarkov.gamepedia.com/Weapon_mods");
    $('.wikitable > tbody > tr > td > a').each((index, element) => {
        pages.add($(element).attr('href'));
    });
}

const crawlPage = async(pageUrl) =>
{
    const children = new Set();
    const parents = new Set();

    const $ = await fetchData("https://escapefromtarkov.gamepedia.com" + pageUrl);
    
    //console.log($('.tabbertab[title=Compatibility] > p > a').attr('href'));
    $('.tabbertab[title=Compatibility] > p > a').each((index, element) => {
        let p = $(element).attr('href');
        parents.add(p);
        pages.add(p);
    });

    $('.tabbertab[title!=Compatibility][title!="Conflicting Items"] > p > a').each((index, element) => {
        let c = $(element).attr('href');
        children.add(c);
        pages.add(c);
    });

    let img = $('td[class="va-infobox-icon"] > a > img').attr('src');
    if(!img)
    {
        img = $('td[class|="va-infobox"] > a > img').attr('src');
    }
    let ind = img.indexOf("?version");
    if(ind > -1)
    {
        img = img.substr(0, ind);
    }

    return {
        key: pageUrl,
        parents: [...parents].sort(),
        children: [...children].sort(),
        image: img
    };
}

const getResults = async() => {
    console.log("Beginning scrape of wiki.")

    const results = new Set();

    console.log("Initializing crawl list from https://escapefromtarkov.gamepedia.com/Weapon_mods");
    await initListOfPagesToCrawl();
    for(let i = 0; i < pages.size; i++)
    {
        try {
            let url = [...pages][i];
            console.log("Crawling " + url + " (Page " + i + " of " + pages.size + ")");
            const obj = await crawlPage(url);
            results.add(obj);
        }
        catch {
            console.log('error');
        }
    }

    // try{
    //     const obj = await crawlPage("/SilencerCo_choke_adapter_for_12ga_shotguns");
    //     console.log(JSON.stringify(obj, null, "\t"));
    // }
    // catch{
    //     console.log('error');
    // }

    console.log("Done scraping.")

    return [...results].sort(function(a, b) {
        var keyA = a.key.toUpperCase();
        var keyB = b.key.toUpperCase();
        
        if(keyA < keyB)
        {
            return -1;
        }
        if(keyA > keyB)
        {
            return 1;
        }

        return 0;
    });
}

module.exports = getResults;