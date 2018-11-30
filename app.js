const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var app = express();
//引入路由器
const userRouter = require('./routers/user.js');
const productRouter = require('./routers/product.js');
const pro = require("./routers/pro.js")
//监听端口
app.listen(3000);
//托管静态文件
app.use(express.static('./public'));
app.use(express.static('./myPro'));
app.use(express.static('./H5'));
//使用Body-parser中间件来将post中间件来将post请求的数据解析为对象
//设置必须放在路由之前,只有设置好了,才能使用req.body
app.use(bodyParser.urlencoded({
    extended: false //不使用qs,使用Nodejs原生 querystring 模块来解析对象
}));


//使用路由器来管理路由,把用户路由器挂载到/user下 访问形式  /user/..
app.use('/user', userRouter);
app.use('/pro', pro);
//挂载商品路由器到/product下  访问形式/product/...
app.use('/product', productRouter);