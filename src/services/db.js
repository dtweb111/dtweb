const mysql = require('mysql');
const path = require('path');
var config = require(path.join(__dirname, '/../../config/config'));

var db = {};

/**
 * @param sql sql语句
 * @param arg 传递到sql语句中的参数，可以不写
 * @param callback 回调函数，可以不写
 */
db.exec = function (sql, arg, callback) {
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
};

module.exports = db;
