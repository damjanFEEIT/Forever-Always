const https = require('https');
const fs = require('fs');

const options = {
    headers: { 'User-Agent': 'AntigravityBot/1.0' }
};

const searchUrl = 'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=kiss%20sound%20filetype:audio&utf8=&format=json';

https.get(searchUrl, options, (res) => {
    let data = '';
    res.on('data', (d) => data += d);
    res.on('end', () => {
        let json = JSON.parse(data);
        let title = json.query.search[0].title;

        // Get file URL
        let urlUrl = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url&format=json';
        https.get(urlUrl, options, (res2) => {
            let data2 = '';
            res2.on('data', (d) => data2 += d);
            res2.on('end', () => {
                let json2 = JSON.parse(data2);
                let pages = json2.query.pages;
                let pageId = Object.keys(pages)[0];
                let fileUrl = pages[pageId].imageinfo[0].url;

                console.log("Downloading from: " + fileUrl);
                https.get(fileUrl, options, (res3) => {
                    let extension = fileUrl.split('.').pop().toLowerCase();
                    const file = fs.createWriteStream('./public/kiss-sound.' + extension);
                    res3.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        console.log("DONE");
                        fs.writeFileSync('./kiss_extension.txt', extension);
                    });
                });
            });
        });
    });
}).on('error', (e) => {
    console.error(e);
});
