const express = require('express');
//路由器是express下的一个功能
const router = express.Router();
//引入连接池
var pool = require('../pool.js');
//1,添加用户 路由
router.post('/register', (req, res) => {
    var obj = req.body;
    //获取用户名,判断是否为空
    var $uname = obj.uname,
        $upwd = obj.upwd,
        $phone = obj.phone,
        $email = obj.email;
    if (!$uname) { //响应用户名为空
        res.send({
            code: 401,
            msg: '用户名不能为空'
        });
        return;
    } else if (!$upwd) {
        res.send({
            code: 402,
            msg: '密码不能为空'
        });
        return;
    } else if (!$phone) {
        res.send({
            code: 403,
            msg: '手机号码不能为空'
        });
        return;
    } else if (!$email) {
        res.send({
            code: 404,
            msg: '邮箱不能为空'
        });
        return;
    }
    //验证通过后,开始插入数据
    pool.query('insert into xz_user values(NULL,?,?,?,?,NULL,NULL,NULL)',
        [$uname, $upwd, $email, $phone], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.send({
                    code: 200,
                    msg: 'reg success!!'
                });
            } else {
                res.send({
                    code: 201,
                    msg: 'reg failed!!'
                });
            }
        })


})
//2,登录账号 路由
router.post('/login', (req, res, next) => {
    var obj = req.body;
    console.log(obj);
    var $uname = obj.uname,
        $upwd = obj.upwd;
    if (!$uname) {
        res.send({
            code: 501,
            msg: '用户名不能为空'
        });
        return;
    } else if (!$upwd) {
        res.send({
            code: 502,
            msg: '密码不能为空'
        });
        return;
    } else {
        //用户登录
        pool.query('select uname,upwd from xz_user where uname = ? && upwd = ?', [$uname, $upwd],
            (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(result.length);
                }
                //查询结果是数组,如果数组的元素个数大于0,说明登录成功;否则登录失败
                if (result.length > 0) {
                    res.send(obj.uname + '欢迎你')
                } else {
                    res.send('账号或者密码错误');
                }
            })

    }
})
//3,修改密码 路由 /pwdupdate post 根据账号密码
router.post('/pwdupdate', (req, res) => {
    var obj = req.body;
    var $uname = obj.uname,
        $upwd = obj.upwd,
        $newPwd = obj.newPwd;
    if (!$uname) {
        res.send('用户名不能为空');
        return;
    }
    if (!$upwd) {
        res.send('密码不能为空');
        return;
    }
    if (!$newPwd) {
        res.send('新密码不能为空');
    }
    //查询数据库,对比账号密码是否正确
    pool.query('select uname,upwd from xz_user where uname = ? && upwd = ?', [$uname, $upwd], (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result == ' ') {
            res.send('账号或者密码错误');
        } else {
            pool.query('update xz_user set upwd = ? where uname = ?', [$newPwd, $uname], (err, result) => {
                if (err) throw err;
                if (result.affectedRows > 0) {
                    res.send('密码修改成功');
                } else {
                    res.send('密码修改失败');
                }
            })
        }
    })
})
//4,删除用户 路由 /drop post 根据账号密码
router.post('/drop', (req, res) => {
    var obj = req.body,
        $uname = obj.uname,
        $upwd = obj.upwd;
    if (!$uname) {
        res.send('用户名不能为空')
        return;
    }
    if (!$upwd) {
        res.send('密码不能为空');
        return;
    }
    pool.query('select uname,upwd from xz_user where uname = ? && upwd = ?', [$uname, $upwd], (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
            res.send('账号或者密码错误');
        } else {
            pool.query('delete  from  xz_user where uname =? ', [obj.uname], (err, result) => {
                if (err) throw err;
                if (result.affectedRows > 0) {
                    res.send('删除用户成功');
                } else {
                    res.send('删除用户失败');
                }
            })
        }
    })

})
//5,删除用户 路由 /delete get 根据uid
router.get('/delete', (req, res) => {
    var obj = req.query;
    var $uid = obj.uid;
    if (!$uid) {
        res.send('用户编号不能为空');
        return;
    } else {
        pool.query('delete from xz_user where uid = ?', [$uid], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.send(`编号为${$uid},删除成功`);
            } else {
                res.send('删除失败');
            }
        })
    }
})
//6,修改路由 /update get 根据uid
router.get('/update', (req, res) => {
    var obj = req.query;
    console.log(obj);
    var $user_name = obj.user_name,
        $uid = obj.uid,
        $phone = obj.phone,
        $gender = obj.gender,
        $email = obj.email,
        i = 400
    for (var k in obj) {
        i += 1
        if (!obj[k]) {
            res.send({
                code: i,
                msg: k + 'is  require'
            });
            return;
        }
    }
    pool.query('update xz_user set user_name = ? ,phone = ?,gender = ?,email = ? where uid = ?',
        [$user_name, $phone, $gender, $email, $uid], (err, result) => {
            if (err) throw err;
            console.log(result);
            if (result.affectedRows > 0) {
                res.send(`编号为${$uid}的用户性信息修改成功`);
            } else {
                res.send('修改失败');
            }
        })
})

//7,检索用户 /detail  post 根据uid
router.post('/detail', (req, res) => {
    var obj = req.body,
        $uid = obj.uid;
    if (!$uid) {
        res.send({
            code: 404,
            rsg: `uid is require`
        });
        return;
    }
    pool.query('select * from xz_user where uid = ?', [$uid], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send(result);
            console.log(result);
        } else {
            res.send({
                code: 404,
                rsg: 'not find'
            })
        }
    })
})

//8,用户列表 /list get 根据每页大小 count 页码pno
router.get('/list', (req, res) => {
    var obj = req.query;
    //如果浏览器传递的页码和数量是字符串,需要转为整型
    var $count = parseInt(obj.count);
    var $pno = parseInt(obj.pno);
    //如果页面或者数量为空 设置默认值
    if (!$pno) $pno = 1;
    if (!$count) $count = 2;
    console.log($count, $pno);
    var $start = ($pno - 1) * $count;
    pool.query('select * from xz_user limit ?,?', [$pno-1, $count ], (err, result) => {
        if (err) throw err;
        //无论结果有多少,直接响应给浏览器,这不是登录之类的验证,这要的是查询结果
        res.send(result);
    })
})

//导出路由
module.exports = router;