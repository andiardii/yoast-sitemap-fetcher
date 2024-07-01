const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs');

const sitemapIndexUrl = 'https://belajar-it.org/sitemap_index.xml';

axios.get(sitemapIndexUrl)
    .then(response => {
        xml2js.parseString(response.data, (err, result) => {
            if (err) {
                console.error('Error parsing sitemap index XML:', err);
                return;
            }

            const sitemapUrls = result.sitemapindex.sitemap.map(entry => entry.loc[0]);

            const fetchSitemap = (url) => {
                return axios.get(url).then(response => {
                    return new Promise((resolve, reject) => {
                        xml2js.parseString(response.data, (err, result) => {
                            if (err) {
                                return reject('Error parsing sitemap XML: ' + err);
                            }
                            const urls = result.urlset.url.map(entry => entry.loc[0]);
                            resolve(urls);
                        });
                    });
                });
            };

            const sitemapPromises = sitemapUrls.map(fetchSitemap);

            Promise.all(sitemapPromises)
                .then(results => {
                    const allUrls = [].concat(...results);
                    const fileContent = allUrls.join('\n');
                    
                    fs.writeFile('sitemap_urls_all.txt', fileContent, (err) => {
                        if (err) {
                            console.error('Error writing to file:', err);
                            return;
                        }
                        console.log('All URLs saved to all_sitemap_urls.txt');
                    });
                })
                .catch(error => {
                    console.error('Error fetching sitemaps:', error);
                });
        });
    })
    .catch(error => {
        console.error('Error fetching sitemap index:', error);
    });
