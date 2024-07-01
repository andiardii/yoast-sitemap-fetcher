const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs');

const sitemapUrl = 'https://belajar-it.org/post-sitemap.xml';

axios.get(sitemapUrl)
    .then(response => {
        xml2js.parseString(response.data, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }

            const urls = result.urlset.url.map(entry => entry.loc[0]);
            const fileContent = urls.join('\n');
            
            fs.writeFile('sitemap_urls.txt', fileContent, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    return;
                }
                console.log('URLs saved to sitemap_urls.txt');
            });
        });
    })
    .catch(error => {
        console.error('Error fetching sitemap:', error);
    });