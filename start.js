const conn = require('./conn');
var xml2js = require('xml2js');
const axios = require('axios').default;

const persistUtils = require('./persist_utils')(conn);

const baseURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const utilParams = '/elink.fcgi?dbfrom=pubmed&linkname=pubmed_pubmed_citedin'

const concatId = (before, current) => `${before}&id=${current}`;

const pubmedUtil = axios.create({
  baseURL,
  responseType: 'text',
  timeout: 1000,
});

(async() => {

  const articles = await persistUtils.fetchArticles();
  const response = await pubmedUtil.get( utilParams + articles.reduce(concatId, '&id=') );
  const result = await xml2js.parseStringPromise( response.data );
  console.log( result.eLinkResult.LinkSet );

  conn.close();
})();
// const articlesThaCiteTheGivenArticle;