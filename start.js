const conn = require('./conn');
var parseString = require('xml2js').parseString;
const axios = require('axios').default;

conn.connect();
const persistUtils = require('./persist_utils')(conn);

const baseURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const utilParams = '/elink.fcgi?dbfrom=pubmed&linkname=pubmed_pubmed_citedin'

const concatId = (before, current) => `${before}&id=${current}`;

const pubmedUtil = axios.create({
  baseURL,
  responseType: 'text',
  timeout: 1000,
})

persistUtils.fetchArticles(articles => {
  console.log(articles);
  pubmedUtil.get(
      utilParams + articles.reduce(concatId, '&id=')
    )
    .then( response => {
      parseString(response.data, function (err, result) {
        console.dir(result.eLinkResult.LinkSet.length);
      });
    });
});





conn.end();
// const articlesThaCiteTheGivenArticle;