const express = require('express');
const router = express.Router();
var pool = require('../pool.js');

//1,商品列表 /list get  根据$start $count 分页打印
router.get('/list', (req, res) => {
    var obj = req.query,
        $pno =parseInt(obj.pno) ,
        $count = parseInt(obj.count) ;
    if (!$pno) {
        $pno = 1;
    }
    if (!$count) {
        $count = 2;
    }
    var $start = ($pno - 1) * $count;
    pool.query('select * from xz_laptop limit ?,?', [$start, $count], (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
//2,商品详情 /detail post 根据lid
router.post('/detail', (req, res) => {
    var obj = req.body;
    var $lid = obj.lid;
    if (!$lid) {
        res.send({code:401,rsg:$details+'is\trequire'})
    }
    pool.query('select * from xz_laptop where lid =?', [$lid], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send(result)
        } else {
            res.send('查找失败')
        }
        
    })
})
//3,商品删除 /delete post 根据lid
router.post('/delete', (req, res) => {
    var obj = req.body;
    var $lid = obj.lid;
    if (!$lid) {
        res.send({
            code: 401,
            rsg: $details + 'is\trequire'
        })
    }
    pool.query('delete from xz_laptop where lid = ?', [$lid], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send('删除成功')
        } else {
            res.send('删除失败')
        }

    })
})
//4,商品添加 /add   post   
router.post('/add', (req, res) => {
    var obj = req.body;
    var $family_id = obj.family_id,
        $title = obj.title,
        $subtitle = obj.subtitle,
        i = 400;
    for (var k in obj) {
        i++;
        if (!obj[k]) {
            res.send({ code: i, msg: k + 'is\trequire' });
            return;
            }
    }
    pool.query('insert into xz_laptop values(NULL,?,?,?,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL) ',
        [$family_id, $title, $subtitle], (err, result) => {
        console.log(result);
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send('插入成功');
        } else {
            res.send('插入失败');
        }
    });

})
//5,修改商品 /update post
router.post('/update', (req, res) => {
    var obj = req.body;
    var $family_id = obj.family_id,
        $title = obj.title,
        $subtitle = obj.subtitle,
        $lid = obj.lid,
        i = 400;
    for (var k in obj) {
        i++
        if (!obj[k]) {
            res.send({ code: i, rsg: k + 'is\trequire' });
            return;
            }
    }
    pool.query('update xz_laptop set family_id=?,title = ?,subtitle=? where lid = ?',
        [$family_id, $title, $subtitle,$lid], (err, result) => {
            if (err) throw err;
            console.log(result);
            if (result.affectedRows > 0) {
                res.send({ code: 201, rsg: 'update success' });
            } else {
                res.send({ code: 400, rsg: 'update failed' });
            }
    })
})
/*
导出路由器
*/ 
module.exports = router;