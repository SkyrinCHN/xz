const express = require('express');
//路由器是express下的一个功能
const router = express.Router();
//引入连接池
var pool = require('../pool.js');
//1.登录路由
router.post("/login", (req, res) => {
  var $uname = req.body.uname;
  var $upwd = req.body.upwd;
  if (!$uname) {
    res.send("用户名没传过来");
    return;
  }
  if (!$upwd) {
    res.send("密码没传过来");
    return;
  }
  var sql = "select * from xz_user where uname = ? and upwd = ?";
  pool.query(sql, [$uname, $upwd], (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result.length > 0) {
      res.send("1");
      console.log("1");
    } else {
      res.send("0");
    }
  })
})
//2.查询用户表,并响应给前端
router.get("/list", (req, res) => {
  var sql = "select * from xz_user";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send(0);
    }

  })
})
//3.删除用户
router.post("/deleteUser", (req, res) => {
  var $uid = req.body.uid;
  if (!$uid) {
    res.send("前端uid没传过来");
    return;
  }
  var sql = "delete from xz_user where uid = ?"
  pool.query(sql, [$uid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send("1");
    } else {
      res.send("0");
    }
  })
})
//4.用户检索 userquery
router.get("/userquery", (req, res) => {
  var $uid = req.query.uid;
  if (!$uid) {
    res.send("前端uid没传过来");
    return;
  }
  var sql = "select * from xz_user where uid =?";
  pool.query(sql, [$uid], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send(result);
    }
  })
})
//5.修改用户信息
router.post("/updateUser", (req, res) => {
  var $email = req.body.email,
    $phone = req.body.phone,
    $uname = req.body.uname,
    $user_name = req.body.user_name,
    $gender = req.body.gender,
    $uid = req.body.uid;
  var sql = "update xz_user set email=?, phone = ?, user_name=? ,gender = ? where uid = ?";
  pool.query(sql, [$email, $phone, $user_name, $gender, $uid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send("修改成功");
    } else {
      res.send("修改失败");
    }
  })
})
//6.注册用户
router.post("/reg", (req, res) => {
  var $uname = req.body.uname;
  var $upwd = req.body.upwd;
  var $phone = req.body.phone;
  var $user_name = req.body.user_name;
  var $gender = req.body.gender;
  var $email = req.body.email;
  if (!$uname) {
    res.send("用户名不能为空");
    return;
  }
  if (!$upwd) {
    res.send("密码不能为空");
    return;
  }
  if (!$phone) {
    res.send("联系方式不能为空");
    return;
  }
  if (!$user_name) {
    res.send("真实姓名不能为空");
    return;
  }
  var sql = "insert into xz_user values(NULL,?,?,?,?,NULL,?,?)";
  pool.query(sql, [$uname, $upwd, $email, $phone,$user_name, $gender], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
       res.send("注册成功")
     }
  })
})
//7.用户名检测
router.get("/checkUname", (req, res) => {
  var $uname = req.query.uname;
  if (!$uname) {
    res.send("用户名是空的,前台搞什么鬼");
    return;
  }
  var sql = "select * from xz_user where uname=?"
  pool.query(sql, [$uname], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send("0");
    } else if (result.length == 0) {
      res.send("1");
    } else {
      res.send("2");
    }
  })
})
//8.手机号检测
router.get("/checkPhone", (req, res) => {
  var $phone = req.query.phone;
  if (!$phone) {
    res.send("手机号没接收到")
  }
  var sql = "select * from xz_user where phone=?";
  pool.query(sql, [$phone], (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      res.send("1");
    } else if (result.length > 0) {
      res.send("0");
    } else {
      res.send("2");
    }
  })
})
//9.邮箱验证
router.get("/checkEmail",(req, res)=> {
  var $email = req.query.email;
  if (!$email) {
    res.send("前端邮箱没传过来")
  }
  var sql = "select * from xz_user where email=?";
  pool.query(sql, [$email], (err, result) =>{
    if (err) throw err;
    if (result.length > 0) {
      res.send("1")
    } else {
      res.send("0");
    }
    
  })
})

//导出路由
module.exports = router;