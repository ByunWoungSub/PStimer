import Axios from "axios";

var dsec = 1;
var dmin = 2;
var dhour = 3;

function DTime(){
    document.getElementById("dsec").innerHTML = dsec + " 초";
    document.getElementById("dmin").innerHTML = dmin + " 분 ";
    document.getElementById("dhour").innerHTML = dhour + " 시간 ";
}

var msec = 4 + dsec;
var mmin = 5 + dmin;
var mhour = 6 + dmin;

function WTime(){
    document.getElementById("wsec").innerHTML = msec + " 초";
    document.getElementById("wmin").innerHTML = mmin + " 분 ";
    document.getElementById("whour").innerHTML = mhour + " 시간 ";
}

var ysec = 7 + msec;
var ymin = 8 + mmin;
var yhour = 9 + mhour;

function MTime(){
    document.getElementById("msec").innerHTML = ysec + " 초";
    document.getElementById("mmin").innerHTML = ymin + " 분 ";
    document.getElementById("mhour").innerHTML = yhour + " 시간 ";
}

setInterval(DTime);
setInterval(WTime);
setInterval(MTime);

function showPopup(){
    window.open("resetpw.html","resetpassword", "width=800, height=650, left=100, top=50");
  }

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);


  function drawChart() {
    subject = JSON.parse(subject)
    var time = [];
    var i=0;
    for(sort in subject){
      time[i]=subject[sort]
      i++;
    }
    var data = google.visualization.arrayToDataTable([
      ['Subject', 'Study for Subject'],
      ['korean', time['korean']],
      ['math',  time['math']],
      ['science', time['science']],
      ['OS', time['OS']],
      ['business and management', time['business and management']],
      ['english', time['english']],
      ['programming', time['programming']],
      ['electronic', time['electronic']],
      ['social', time['social']] 
    ]);

    var options = {
      title: 'My Daily Activities'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
  }