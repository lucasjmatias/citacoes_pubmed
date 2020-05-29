
module.exports = (conn) => {
  return {
    fetchArticles
  }

  function fetchArticles(callback) {

    const query = 'SELECT id FROM artigos where incluido = 0 limit 30;';
    conn.query(
      query, 
      (err, results, fields) => {
        const rs = JSON.parse(JSON.stringify(results));
        callback(rs.map(r => r.id));
      }
    );
  }
};