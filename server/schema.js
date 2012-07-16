var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'tcp://postgres:axel@localhost/postgres'
  , client
  , query;

pg.connect(connectionString, function (err, client) {
	query = client.query('DROP TABLE IF EXISTS messages');
	query = client.query('CREATE TABLE messages (username varchar(50), msg varchar(100), timestamp bigint)');
	query.on('end', function () { client.end() });
});

