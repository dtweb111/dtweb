const path = require('path');
const mysql = require('mysql');

var io = require('./io');
var config = require(path.join(__dirname, '/../../config/config'));

var db = {};
var pool = mysql.createPool({
    connectionLimit: 10,
    host: config.db.host,
    port: config.db.port,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database
});


/**
 * @param sql sql statement that will be executed
 * @param arg optional array parameter containing all values that will replace placeholders in sql statement
 * @param callback callback function after the sql statement is executed
 */
db.exec = function (sql, arg, callback) {
    // Get a connection from pool
    pool.getConnection(function(err, connection){
        if (err) {
            io.logFile('db', 'Failed to get connection from pool with error {' + err.message + '}');
        }
        // Use the connection
        connection.query(sql, arg, function(err, data, fields){
            connection.release();   // Return the connection back to pool
            if (err) {
                io.logFile('db', 'Failed to execute sql statement {' + sql + '}');
                throw err;
            }
            return callback && callback(err, data);
        });
    });



    /*
    //1.创建连接(根据自己的数据库配置)
    let connection = mysql.createConnection({
        host: config.db.host, //数据库的地址
        user: config.db.username, //数据库用户名
        password: config.db.password, //数据库密码
        port: config.db.port, //mysql数据库的端口号
        database: config.db.database //使用那个数据库
    });
    //2.开始连接数据库
    connection.connect(function(err){
        if (err) {
            console.log('Code: ', err.code, 'Message: ', err.message);
        }
    });
    //3.对数据库的增删改查操作
    connection.query(sql, arg, function(err, data){
        if (err) {
            throw err;
        }
        return callback && callback(err, data);
    })
    //4.关闭数据库
    connection.end();
    */
};

module.exports = db;
