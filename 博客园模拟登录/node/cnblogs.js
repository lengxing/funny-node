var superagent = require('superagent')
  , myCookie, VerificationTokenValue, input1, input2;

// start
getEncryptData(goToLogin);

// 获取 username&password 加密后的数据
function getEncryptData(cb) {
  superagent
    .get('http://localhost/jsencrypt/a.txt')
    .end(function (err, sres) { // callback

      var data = JSON.parse(sres.text);
      
      input1 = data.username;
      input2 = data.password;

      cb(goToLogin);
    });
}


// go to 登录页面
function goToLogin(cb) {      
  superagent
    .get('http://passport.cnblogs.com/user/signin?ReturnUrl=http://passport.cnblogs.com/')
    .end(function (err, sres) { // callback

      // 正则匹配获取 VerificationToken 的值
      var str = sres.text;

      var pattern = /'VerificationToken': '(.*)'/
           , tmpArr = str.match(pattern);

      VerificationTokenValue = tmpArr[1]; 

      // 模拟登录
      cb(login);
    });
}


function login() {
  superagent
    // 登录 url
    .post('http://passport.cnblogs.com/user/signin')
    // post 用户名 & 密码
    .send({"input1": input1})
    .send({"input2": input2})
    .send({"remember": "false"})
    .set("Content-Type", "application/json; charset=UTF-8")
    .set("VerificationToken", VerificationTokenValue)
    .set("Cookie", "AspxAutoDetectCookieSupport=1;")
    .set("X-Requested-With", "XMLHttpRequest")
    .end(function(err, sres) {

      var str = sres.header['set-cookie'][0];

      var pos = str.indexOf(';');

      // 后续操作所需要的 cookie
      myCookie = str.substr(0, pos);

      // 后续操作
      // ...
      // http://www.cnblogs.com/zichi/p/5331426.html 回帖
      superagent
        .post('http://www.cnblogs.com/mvc/PostComment/Add.aspx')
        .set("Cookie", myCookie)
        .send({"blogApp": "zichi"})
        .send({"body": "好文要顶！"})
        .send({"postId": 5331426})
        .end(function (err, sres) { // callback
        });
    });
}