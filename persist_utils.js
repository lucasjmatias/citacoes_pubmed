
module.exports = (conn) => {
  return {
    fetchArticles
  }

  async function fetchArticles() {
    const query = 'SELECT id FROM artigos where incluido = 0 limit 30;';
    const rows = await conn.query( query );
    const rs = JSON.parse(JSON.stringify(rows));
    return rs.map(r => r.id);
  }
};