var mysql = require('mysql');

var env       = 'dev',
    db_config = require('./db_config')[env],
    host      = db_config.host     ? db_config.host     : null,
    user      = db_config.user     ? db_config.user     : null,
    password  = db_config.password ? db_config.password : null,
    database  = db_config.database ? db_config.database : null;

var connection = mysql.createConnection(
    {
        host               : host,
        user               : user,
        password           : password,
        database           : database,
        multipleStatements : true
    }
);

exports.db = connection;