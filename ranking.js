function change_ranking(ranking) {
    reset_ranking_page();
    var rs = document.getElementById(ranking);
    var border;
    rs.setAttribute("style", "border-bottom : 2px solid white; background-color : white;");
    if (ranking == "overall_ranking") {
        border = "OVERALL RANKING";
    } else if (ranking == "grade_ranking") {
        border = "GRADE RANKING";
    } else if (ranking == "class_ranking") {
        border = "CLASS RANKING";
    } else {
        border = "ERROR!";
    }
    change_ranking_table(ranking);
    document.getElementById("ranking_border").innerHTML = border;
}

function reset_ranking_page() {
    var rs1 = document.getElementById("overall_ranking");
    var rs2 = document.getElementById("grade_ranking");
    var rs3 = document.getElementById("class_ranking");
    rs1.setAttribute("style", "border-bottom : 2px solid black; background-color : lightgray;");
    rs2.setAttribute("style", "border-bottom : 2px solid black; background-color : lightgray;");
    rs3.setAttribute("style", "border-bottom : 2px solid black; background-color : lightgray;");
}

function change_ranking_table(ranking) {
    list = JSON.parse(list);
    console.log(list)
    var list_length = Object.keys(list).length;

    document.getElementById('rank_table').innerHTML = "";
    var time;
    var id;
    var hour;
    var min;
    var sec;

    var test; // 테스트용
    if (ranking == "overall_ranking") {
        test = 60;
    } else if (ranking == "grade_ranking") {
        test = 55;
    } else if (ranking == "class_ranking") {
        test = 50;
    } else {
        console.log("ERROR!");
    }
    
    for (var i = 1; i <= list_length; i++) {
        time = list[Object.keys(list)[i]]
        hour = parseInt(time / 3600); 
        min = parseInt(parseInt(time%3600) / 60); 
        sec = parseInt(time%3600) % 60;
        id = Object.keys(list)[i]
        

        document.getElementById('rank_table').innerHTML +=
        '<tr class = "rank" id = "' + i + '"><td>' + id + '</td><td id = "name_' + i + '">' + id + '</td><td id = "time_' + i + '">' + hour + '시간 ' + min + '분 ' + sec + '초</td></tr>';
    }
}