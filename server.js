const fs = require('fs');
const querystring = require('querystring');
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const ejs = require('ejs');

app.use('/css', express.static(__dirname + "/../css/"));
app.use('/jpg', express.static(__dirname + "/../jpg/"));
app.use('/static-js', express.static(__dirname + "/../static-js/"))

app.use(session({
    secret: '!)($^#)$&#(#&^#',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.listen(3017, () => {
    console.log('Server is running...');
});

//Routing
app.get('/', async (req, res) => {
    await res.sendFile(path.resolve(__dirname + '/../html/main.html'));
});

app.get('/login.html', async (req, res) => {
    await res.sendFile(path.resolve(__dirname + '/../html/login.html'));
});

app.get('/register.html', async (req, res) => {
    await res.sendFile(path.resolve(__dirname + '/../html/register.html'));
});

app.get('/timer', async (req, res) => {
    await res.sendFile(path.resolve(__dirname + '/../html/timer.html'));
})

//비밀번호 찾기
app.get('/findpw.html', async (req, res) => {
    await res.sendFile(path.resolve(__dirname + '/../html/findpw.html'));
});

app.get('/askque.html', async (req, res) => {
    await res.sendFile(path.resolve(__dirname + '/../html/askque.html'));
});

app.get('/resetpw.html', async (req, res) => {
    await res.sendFile(path.resolve(__dirname + '/../html/resetpw.html'));
});
app.get('/ranking.html', async (req,res)=>{
    await res.sendFile(path.resolve(__dirname + '/../html/ranking.html'));
})

//logout
app.get('/logout', (req, res) => {
    sess = req.session;
    req.session.destroy((err) => {
        if (err) {
            throw err;
        } else {
            res.send('<script type="text/javascript"> location.href="/"; alert("성공적으로 로그아웃 되었습니다.")</script>')
        }
    })
})

//회원가입 
app.get('/join', (req, res) => {
    var can_register = true;
    var name = req.param('name');
    var id = req.param('id');
    var email = req.param('Email');
    var number = req.param('group');
    var password = req.param('pw');
    var return_password = req.param('return_pw');
    var que = req.param('question');

    number = parseInt(number);
    console.log(isNaN(parseInt(id)));

    var conn = mysql.createConnection({
        host: '15.164.232.202',
        user: 'root',
        password: '0128gksqls',
        port: 3306,
        database: 'shem'
    });


    conn.connect(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('mysql connected.');
        }
    });

    var select = "SELECT id,email FROM pstimer.log_info WHERE id='" + id + "' OR email='" + email + "'";

    conn.query(select, (err, rows, fields) => {
        if (err) {
            console.log('err : ', err);
        } else {
            if (rows[0] == undefined) {
                if (isNaN(name) != true) {
                    res.send('<script lang="javascript"> location.href="/register.html"; alert("이름은 문자여야 합니다.")</script>');
                } else {
                    if (!email.includes("@") || !email.includes(".")) {
                        res.send('<script lang="javascript"> location.href="/register.html"; alert("이메일형식이 잘못되었습니다.")</script>');
                    } else {
                        if (number.toString().length != 4 || typeof (number) !== 'number') {
                            res.send('<script lang="javascript"> location.href="/register.html"; alert("학번형식이 잘못되었습니다.")</script>');
                        } else {
                            if (password != return_password) {
                                res.send('<script lang="javascript"> location.href="/register.html"; alert("비밀번호가 틀립니다. 다시 입력해 주십시오.")</script>');
                            } else {
                                if(!isNaN(parseInt(id))){
                                    res.send('<script lang="javascript"> location.href="/register.html"; alert("숫자로만 아이디를 만들 수 없습니다.")</script>')
                                }else{
                                    var params = [number, name, id, password, email, que];
                                    conn.query("INSERT INTO pstimer.log_info(number,name,id,password,email,question) VALUES(?,?,?,?,?,?)", params, (err, rows, fields) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log('insert success!');
                                            res.send('<script lang="javascript"> location.href="/"; alert("회원가입이 성공적으로 완료되었습니다. 로그인 후 이용해주시기 바랍니다.")</script>');
                                        }
                                    });
                                }
                               
                            }
                        }
                    }
                }

            } else {
                res.send('<script lang="javascript"> location.href="/register.html"; alert("이미 존재하는 아이디입니다.")</script>');
            }
        }
    });

});

//email 유효성 검사 func
function chkEmail(str) {

    var regExp = "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i";

    if (regExp.test(str)) return true;

    else return false;

}


//login
var sessionid;

app.get('/login', (req, res) => {
    var temp;
    var id = req.param('id');
    var password = req.param('pw');
    var sess = req.session;

    var conn = mysql.createConnection({
        host: '15.164.232.202',
        user: 'root',
        password: '0128gksqls',
        port: 3306,
        database: 'shem'
    });

    conn.connect(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('mysql connected.');
        }
    });

    conn.query("SELECT id FROM pstimer.log_info WHERE id='" + id + "'", (err, rows, fields) => {
        if (!err) {
            if (rows[0] == undefined) {
                res.send('<script type="text/javascript"> location.href="/login.html"; alert("존재하지 않는 아이디입니다.")</script>')
            } else {
                conn.query("SELECT password FROM pstimer.log_info WHERE id='" + id + "'", (err, row, fields) => {
                    if (!err) {
                        if (password != row[0]['password']) {
                            res.send('<script type="text/javascript"> location.href="/login.html"; alert("비밀번호가 일치하지 않습니다.")</script>')
                        } else {
                            console.log('로그인 성공!');
                            sess.user = id;
                            sessionid = id;
                            return res.render('../template/main', {
                                name: sess.user
                            });
                            req.session.save(() => {
                                res.redirect('/');
                            });
                        }
                    } else {
                        console.log('err: ', err);
                    }
                });
            }
        } else {
            console.log("err: ", err);
        }
    });
});


//login session



var getId;
app.get('/findid', (req, res) => {
    getId = req.param('name');
    var conn = mysql.createConnection({
        host: '15.164.232.202',
        user: 'root',
        password: '0128gksqls',
        port: 3306,
        database: 'shem'
    });

    conn.connect(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('mysql connected.');
        }
    });

    conn.query("SELECT id FROM pstimer.log_info WHERE id='" + getId + "'", (err, rows, fields) => {
        if (!err) {
            if (rows[0]['id'] != undefined) {
                console.log('-> askque page');
                res.redirect('/askque.html');
            } else {
                res.send('<script type="text/javascript"> location.href="/findpw.html"; alert("존재하지 않는 아이디입니다.")</script>');
            }
        } else {
            
            console.log('Err: ', err);
        }
    });
});



app.get('/askque', (req, res) => {
    var que = req.param('question');

    var conn = mysql.createConnection({
        host: '15.164.232.202',
        user: 'root',
        password: '0128gksqls',
        port: 3306,
        database: 'shem'
    });

    conn.connect(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('mysql connected.');
        }
    });

    conn.query("SELECT question FROM pstimer.log_info WHERE id='" + getId + "'", (err, rows, fields) => {
        if (!err) {
            if (rows[0]['question'] != que) {
                res.send('<script type="text/javascript"> location.href="/askque.html"; alert("개인확인 질문이 다릅니다. 다시 입력해 주십시오.")</script>')
            } else {
                console.log('-> reset page')
                res.redirect('/resetpw.html');
            }
        } else {
            console.log('err: ', err);
        }
    })
})



var org_pw;

app.get('/resetpw', (req, res) => {
    var pw = req.param('newpw');
    var return_pw = req.param('return_newpw');

    var conn = mysql.createConnection({
        host: '15.164.232.202',
        user: 'root',
        password: '0128gksqls',
        port: 3306,
        database: 'shem'
    });

    conn.connect(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('mysql connected.');
        }
    });

    if (pw == return_pw) {
        //기존 비밀번호 뽑아오기
        conn.query("SELECT password FROM pstimer.log_info WHERE id='" + getId + "'", (err, rows, fields) => {
            if (err) {
                console.log('err: ', err);
            } else {
                //기존비밀번호와 비교
                if (pw == rows[0]['password']) {
                    res.send('<script type="text/javascript"> location.href="/resetpw.html"; alert("재설정할 비밀번호는 기존의 비밀번호와 달라야 합니다. 다시 입력해주십시오.")</script>');
                } else {
                    //기존비밀번호와 다를경우 UPDATE
                    conn.query("UPDATE pstimer.log_info SET password='" + return_pw + "' WHERE id='" + getId + "'", (err, rows, fields) => {
                        if (err) {
                            console.log('err: ', err);
                        } else {
                            console.log('update success!')
                            res.send('<script type="text/javascript"> location.href="/login.html"; alert("비밀번호가 재설정되었습니다. 다시 로그인해 주십시오.")</script>');
                        }
                    });
                }
            }
        });
        //비밀번호와 재입력된 비밀번호 일치 비교
    } else {
        res.send('<script type="text/javascript"> location.href="/resetpw.html"; alert("비밀번호가 다릅니다. 다시입력해주십시오.")</script>');
    };

});


//마이페이지


app.get('/gomy', (req, res) => {
var day;
var month;
var year;
var today_study = 0;
var week_study = 0;
var month_study = 0;
var temp_date;
var st_date = new Date().toISOString().substr(0, 10).replace('T', ' ');
var sess = req.session;


var conn = mysql.createConnection({
    host: '15.164.232.202',
    user: 'root',
    password: '0128gksqls',
    port: 3306,
    database: 'shem'
});

conn.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('mysql connected.');
    }
});

conn.query("SELECT number,name,email FROM pstimer.log_info WHERE id='" + sessionid + "'", (err, rows, fields) => {
        if (err) {
            console.log("err: ", err);
        } else {
            conn.query("SELECT subject,date,study FROM pstimer.study_data WHERE id='" + sessionid + "'", (err, row, fields) => {
                var check = false;
                if (err) {
                    console.log(err)
                } else {
                    var wholestudy = 0;
                    
                    for (var i = 0; i < row.length; i++) {
                        wholestudy += row[i]['study'];
                        temp_date = String(row[i]['date']).slice(0, 15)
                        month = temp_date.slice(4, 7)
                        day = temp_date.slice(8, 10)
                        year = temp_date.slice(11, 15);

                        // 월 구하기
                        if (month == "Jan") {
                            month = "01";
                        } else if (month == "Feb") {
                            month = "02"
                        } else if (month == "Mar") {
                            month = "03"
                        } else if (month == "Apr") {
                            month = "04"
                        } else if (month == "May") {
                            month = "05"
                        } else if (month == "Jun") {
                            month = "06"
                        } else if (month == "Jul") {
                            month = "07"
                        } else if (month == "Aug") {
                            month = "08"
                        } else if (month == "Sep") {
                            month = "09"
                        } else if (month == "Oct") {
                            month = "10"
                        } else if (month == "Nov") {
                            month = "11"
                        } else if (month == "Dec") {
                            month = "12"
                        } else {
                            console.log("err")
                        }
                        //이번 달 공부량 구하기
                        if (month == st_date.slice(5, 7)) {
                            month_study += row[i]['study']
                        }
                        //오늘 공부량 구하기
                        if (parseInt(day) == parseInt(st_date.slice(8, 10))) {
                            today_study += row[i]['study']
                        }
                        
                        //이번주 공부량 구하기
                        var currentDay = new Date();
                        var theYear = currentDay.getFullYear();
                        var theMonth = currentDay.getMonth();
                        var theDate = currentDay.getDate();
                        var theDayOfWeek = currentDay.getDay();

                        var thisWeek = [];
                        

                        for (var k = 0; k < 7; k++) {
                            var resultDay = new Date(theYear, theMonth, theDate + (k - theDayOfWeek));
                            var yyyy = resultDay.getFullYear();
                            var mm = Number(resultDay.getMonth()) + 1;
                            var dd = resultDay.getDate();

                            mm = String(mm).length === 1 ? '0' + mm : mm;
                            dd = String(dd).length === 1 ? '0' + dd : dd;

                            thisWeek[k] = yyyy + '-' + mm + '-' + dd;
                        }

                        for (var j = 0; j < 7; j++) {

                            if (parseInt(year) == parseInt(thisWeek[j].slice(0, 4)) && parseInt(month) == parseInt(thisWeek[j].slice(5, 7)) && parseInt(day) == parseInt(thisWeek[j].slice(8, 10))) {
                                check = true;
                            }
                        }
                        if (check == true) {
                            week_study += row[i]['study']
                        }
                    }
                    var subject = {'math':0,
                                    'english':0,
                                    'korean':0,
                                    'science':0,
                                    'social':0,
                                    'business and management':0,
                                    'OS':0,
                                    'electronic':0,
                                    'programming':0};
                    var exist = true;
                    for(var i=0;i<row.length;i++){
                        subject[row[i]['subject']] += row[i]['study']
                    }
                    subject = JSON.stringify(subject);
                    sess.name = rows[0]['name'];
                    sess.number = rows[0]['number'];
                    sess.email = rows[0]['email'];
                    sess.study = wholestudy;
                    sess.subject = subject;
                    sess.today = today_study;
                    sess.week = week_study;
                    sess.month = month_study;
                    return res.render('../template/my', {
                        name: sess.name,
                        number: sess.number,
                        email: sess.email,
                        time: sess.study,
                        today: sess.today,
                        week: sess.week,
                        month: sess.month,
                        subject: sess.subject
                    });
                    req.session.save(() => {
                        res.redirect('');
                    });
                }
            })
        }
    })
})

app.get('/timerdate',(req,res)=>{
    var date = req.param('date');
    var time = req.param('studytime')
    var subject = req.param('subject')
    if(subject == "수학"){
        subject="math"
    }else if(subject == "영어"){
        subject = "english"
    }else if(subject == "물리학"){
        subject="science"
    }else if(subject == "사회"){
        subject="social"
    }else if(subject == "기업과 경영"){
        subject="business and management"
    }else if(subject == "운영체제"){
        subject="OS"
    }else if(subject == "전기전자"){
        subject="electronic"
    }else if(subject == "프로그래밍"){
        subject="programming"
    }else if(subject == "국어"){
        subject="korean"
    }
    var conn = mysql.createConnection({
        host: '15.164.232.202',
        user: 'root',
        password: '0128gksqls',
        port: 3306,
        database: 'shem'
    });
    
    conn.connect(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('mysql connected.');
        }
    });
    var param  = [sessionid,subject,date,time]
    conn.query("INSERT INTO pstimer.study_data(id,subject,date,study) VALUES(?,?,?,?)",param,(err)=>{
        if(err){
            throw err;
        } else{
            console.log('insert success')
            res.redirect('/timer')
        }
    })
})

app.get('/ranking', (req, res) => {
    var sess = req.session;

    var conn = mysql.createConnection({
        host: '15.164.232.202',
        user: 'root',
        password: '0128gksqls',
        port: 3306,
        database: 'shem'
    });
    
    conn.connect(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('mysql connected.');
        }
    });

    conn.query("select id,date,study,@vRank :=@vRank + 1 AS rank from pstimer.study_data AS ps,(select @vRank := 0) AS r order by study DESC",(err,result)=>{
        if(err){
            throw err;
        } else{
            var data = {};
            var exist = true;
            var k=0;
            for(var i = 0; i<result.length;i++){
                if(result[i].id in data){
                    exist = false;
                }
                if(exist){
                    data[result[i].id] = result[i].study;
                }else{
                    data[result[i].id] += result[i].study;
                }
                exist = true;
            }
             console.log(data)
            sess.list = JSON.stringify(data)
            return res.render('../template/ranking',{
                list: sess.list
            })
        }
    })
})

app.get('/main',(req,res)=>{
    var sess = req.session;
    sess.user = sessionid;
    return res.render('../template/main', {
        name: sess.user
    });
    req.session.save(() => {
        res.redirect('/');
    });
})

//main추가할 차트 --> 하루마다 전체 사용시간, 과목별 공부시간