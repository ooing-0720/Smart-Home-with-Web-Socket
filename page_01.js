//시계
function clock(){
  var today = new Date();
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var day = today.getDay();

  var week = ["월요일","화요일","수요일","목요일","금요일","토요일","일요일"]
  var hour = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();
  
  document.getElementById("clock").innerHTML=
  m+"월 "+d+"일 "+week[day]+" "+hour+":"+min+":"+sec;
}

setInterval(clock,1000);

// 탭 메뉴
$(function(){
  $('.tabcontent > div').hide();
  $('.tabnav a').click(function () {
    $('.tabcontent > div').hide().filter(this.hash).fadeIn();
    $('.tabnav a').removeClass('active');
    $(this).addClass('active');
    return false;
  }).filter(':eq(0)').click();
  });

// 현재와 전일 전력 소비량 비교 바 차트
new Chart(document.getElementById("bar-chart"), {
  type: 'bar',
  data: {
    labels: ["전일 평균", "현재"],
    datasets: [
      {
        label: "전력 소비량",
        backgroundColor: ["#3e95cd", "#8e5ea2"],
        data: [5267,2478]
      }
    ]
  }
});

// 하루 기기별 전력 소비량 도넛 차트
new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: ["에어컨","TV","냉장고"],
      datasets: [
        {
          label: "대기 전력",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
          data: [2478,5267,734]
        }
      ]
    }
});

// 날씨
let weatherIcon = {
  '01': 'fas fa-sun fa-6x',
  '02': 'fas fa-cloud-sun fa-6x',
  '03': 'fas fa-cloud fa-6x',
  '04': 'fas fa-cloud-meatball fa-6x',
  '09': 'fas fa-cloud-sun-rain fa-6x',
  '10': 'fas fa-cloud-showers-heavy fa-6x',
  '11': 'fas fa-poo-storm fa-6x',
  '13': 'fas fa-snowflake fa-6x',
  '50': 'fas fa-smog fa-6x'
};

$.getJSON('http://api.openweathermap.org/data/2.5/forecast?id=1835848&APPID=47860d276a5bf51127b72fc375f1925d&units=metric', function(data){
  var $icon = (data.list[0].weather[0].icon).substr(0,2);
  var $temp = Math.floor(data.list[0].main.temp);
  var $humi = data.list[0].main.humidity;

  $('.icon').append('<i class="' + weatherIcon[$icon] + '"></i>');     
  $('.temperature').append($temp + 'º');
  $('.humidity').append($humi + '%');
});

// 에어컨 ON/OFF 버튼
var check = $("input[type='checkbox']");
check.click(function(){
	$("p").toggle();
});
