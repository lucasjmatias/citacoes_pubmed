
module.exports = (conn) => {
  return {
    fetchArticles,
    insertCites,
    markAsDone
  }

  async function fetchArticles() {
    const query = 'SELECT id FROM artigos where incluido = 0 limit 300;';
    const rows = await conn.query( query );
    const rs = JSON.parse(JSON.stringify(rows));
    return rs.map(r => r.id);
  }

  async function markAsDone(articleIds) {
    const query = 'UPDATE artigos SET incluido = 1 WHERE id in (?);';
    const rows = await conn.query( query, [articleIds] );
  }

  async function insertCites(articleCitedAndCitesPair) {
    const query = 'INSERT INTO citacoes (id_artigo_citado, id_artigo_citante) VALUES ?;';
    const rows = await conn.query( query, [articleCitedAndCitesPair] );
  }
};