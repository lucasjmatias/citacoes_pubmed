const conn = require('./conn');
const xml2js = require('xml2js');
const axios = require('axios').default;
const { unnest } = require('ramda');
const prompt = require('prompt');

const persistUtils = require('./persist_utils')(conn);

const baseURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const utilParams = '/elink.fcgi?dbfrom=pubmed&linkname=pubmed_pubmed_citedin';

const concatId = (before, current) => `${before}&id=${current}`;

const pubmedUtil = axios.create({
  baseURL,
  responseType: 'text',
  timeout: 1000,
});

(async() => {
  let letMeGo = false;
  prompt.start();
  prompt.get({ description: 'Type anything to exit', require: true}, function (err, result) {
    console.log("I'll let you go");
    letMeGo = true;
  });
  let nArticles = 0;
  do {
    
    const articles = await persistUtils.fetchArticles();
    console.log(articles);
    // nArticles = articles.length;
    // if (nArticles === 0) { break; }
    await conn.beginTransaction();
    try {
      const response = await pubmedUtil.get( utilParams + articles.reduce(concatId, '&id=') );
      const result = await xml2js.parseStringPromise( response.data );
      const foundArticles = result.eLinkResult.LinkSet;
      const mappedIds = unnest(foundArticles
        .map(
          art => {
            const idArticle = art.IdList[0].Id[0];
            return art.LinkSetDb 
                    ? art.LinkSetDb[0].Link
                        .map( link => [idArticle, link.Id[0]] )
                    : [];
          } 
      ));
      // console.log(mappedIds);
      await persistUtils.insertCites(mappedIds)
      await persistUtils.markAsDone(articles);
      await conn.commit();
      console.log(`Requested: ${articles.length}, Found: ${foundArticles.length}`)
    } catch (error) {
      console.error(error);
      await conn.rollback();
    }
  } while (nArticles > 0 && !letMeGo);
  

  conn.close();
})();
// const articlesThaCiteTheGivenArticle;