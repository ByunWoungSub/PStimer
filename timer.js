var time = 1;

var totalhour = 1;
var totalmin = 1;
var totalsec = 1;

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();


function timer(a) {
    if (a == 1) {
        alert("시작");
        var start = setInterval(timerOn, 100);
        setInterval(total, 100);
    }
    if (a == 0) {
        var hour = 0;
        var min = 0;
        var sec = 0;
        clearInterval(start);
        if (time >= 60) {
            min = parseInt(time / 60);
            sec = parseInt(time % 60);
        } else if (time >= 3600) {
            hour = time / 3600;
            if (time % 3600 >= 60) {
                min = parseInt((time % 3600) / 60);
                sec = parseInt((time % 3600) % 60);
            }
        } else {
            sec = time;
        }
        alert("종료");
        alert(hour + "시간 " + min + "분 " + sec + "초");
        console.log(time);
    }
}

function timerOn() {
    document.getElementById("time").innerHTML = time + "s";
    time += 1;
}

function total() {
    min = 0;
    hour = 0;
    if (time >= 60) {
        min = parseInt(time / 60);
        sec = parseInt(time % 60);
    } else if (time >= 3600) {
        hour = time / 3600;
        if (time % 3600 >= 60) {
            min = parseInt((time % 3600) / 60);
            sec = parseInt((time % 3600) % 60);
        }
    } else {
        sec = time;
    }
    document.getElementById("sec").innerHTML = sec;
    document.getElementById("min").innerHTML = min + " : ";
    document.getElementById("hour").innerHTML = hour + " : ";
}

function day(){
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
setInterval(day);

//today = mm + "/" + dd + "/" + yyyy;
//document.write(today);