var time = 0;
var study_Date;
var totalhour = 1;
var totalmin = 1;
var totalsec = 1;

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();

var timer = false; // 타이머 작동중이면 true, 아니면 false
var pause = false; // pause 걸리면 true, 아니면 false

var power;
var power2;

var subject;

function start() {


    var s = document.getElementById("study_select");
    subject = s.options[s.selectedIndex].value;
    if (subject == "") {
        console.log("과목을 입력하여 주십시오.");
        stop_studing();
        document.getElementById("study").innerHTML += '<p id = "subject_select" style = "color : red;">* 과목을 입력하셔야 합니다.</p>'
        return;
    }
    if (timer) {
        // alert("이미 타이머가 실행되었습니다.");
    } else {
        // alert("시작");
        press_start();
        power = setInterval(timerOn, 1000);
        power2 = setInterval(total, 1000);
        timer = true;
        studing();
        console.log(subject);
        
        study_date = startDate();
        
    }
}

function timer_pause() {
    if (timer) {
        if (pause) {
            unpress_pause();
            power = setInterval(timerOn, 1000);
            power2 = setInterval(total, 1000);
            // alert("시간이 다시 흐릅니다.");
            pause = false;
        } else {
            press_pause();
            clearInterval(power);
            clearInterval(power2);
            // alert("시간이 정지되었습니다.");
            pause = true;
        }
    } else {
        // alert("타이머가 작동하지 않고 있습니다."); 
    }
}

function stop() {
    if (timer) {
        var hour = 0;
        var min = 0;
        var sec = 0;
        clearInterval(power);
        clearInterval(power2);
        if (time >= 3600) {
            hour = parseInt(time / 3600);
            if (time % 3600 >= 60) {
                min = parseInt((time % 3600) / 60);
                sec = parseInt((time % 3600) % 60);
            }
        } else if (time >= 60) {
            min = parseInt(time / 60);
            sec = parseInt(time % 60);
        } else {
            // var mysql = require('mysql');
            // var conn = mysql.createConnection({
            //     host : '15.164.232.202',
            //     user : 'root',
            //     password : '0128gksqls',
            //     port : 3306,
            //     database : 'shem'
            // });

            // conn.connect(function(err){
            //     if(err){
            //         console.log(err);
            //     }else{
            //         console.log('mysql connected.');
            //     }
            // });
            // var sess = req.session;
            // var paramater = [sess.user,];
            // conn.query("INSERT INTO pstimer.study_data(name,study_day,study_week,study_month) VALUES(?,?,?,?)",parmater,(err,rows,fields)=>{

            // })

            sec = time;
        }
        // alert("종료");
        // alert(hour + "시간 " + min + "분 " + (sec) + "초");
        clearInterval(hour);
        clearInterval(min);
        clearInterval(sec);
        unpress_start();
        unpress_pause();
        timer = false;
        pause = false;
        //axios 서버에 date,time보내기
        axios.get(window.location.href+"date",{
            params: {
                date: study_date,
                studytime: time,
                subject: subject
            }
        })
        time = 0;
        total();

        stop_studing();
        
    } else {
        // alert("이미 타이머가 정지되어있습니다.");
    }
}

function timerOn() {
    /*document.getElementById("time").innerHTML = time + "s";*/
    time += 1;
}


function total() {
    min = 0;
    hour = 0;
    if (time >= 3600) {
        hour = parseInt(time / 3600);
        if (time % 3600 >= 60) {
            min = parseInt((time % 3600) / 60);
            sec = parseInt((time % 3600) % 60);
        }
    } else if (time >= 60) {
        min = parseInt(time / 60);
        sec = parseInt(time % 60);
    } else {
        sec = time;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    document.getElementById("sec").innerHTML = sec;
    document.getElementById("min").innerHTML = min + " : ";
    document.getElementById("hour").innerHTML = hour + " : ";
}


function day() {
    if (dd < 10) {
        dd = "0" + dd;
    }

    if (mm < 10) {
        mm = "0" + mm;
    }

    document.getElementById("dd").innerHTML = dd + " 일";
    document.getElementById("mm").innerHTML = mm + " 월 ";
    document.getElementById("yyyy").innerHTML = yyyy + " 년 ";
}

function press_start() {
    var ps = document.getElementById('start');
}

function unpress_start() {
    var ps = document.getElementById('start');
}

function press_pause() {
    var pp = document.getElementById('pause');
}

function unpress_pause() {
    var pp = document.getElementById('pause');
}

function studing() {
    document.getElementById("study").innerHTML = "<p style = 'font-size : 12pt;'>" + subject + " 공부 중...</p>";
}

function stop_studing() {
    document.getElementById("study").innerHTML =
        '<select name = "subject" id = "study_select"><option value = "">과목선택</option>' +
        '<option value = "국어">국어</option>' +
        '<option value = "수학">수학</option>' +
        '<option value = "영어">영어</option>' +
        '<option value = "물리학">물리학</option>' +
        '<option value = "사회">사회</option>' +
        '<option value = "기업과 경영">기업과 경영</option>' +
        '<option value = "운영체제">운영체제</option>' +
        '<option value = "전기전자">전기전자</option>' +
        '<option value = "프로그래밍">프로그래밍</option>' +
        '</select>'
    document.getElementById("study").innerHTML += '<p id = "subject_select">과목을 선택하셔야만 타이머가 실행됩니다.</p>'
}

// setInterval(day);

//today = mm + "/" + dd + "/" + yyyy;
//document.write(today);

function startDate(){
    var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today =  yyyy+ '-' + mm + '-' + dd;
        return today;
}