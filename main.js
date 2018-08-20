var newSteps = []
var timers = []
var currentID = 0
var stepNot = []

function addNewStep() {
  console.log($("#newStepName").val(), $("#newStepMin").val())
  if($("#newStepName").val() != "" && $("#newStepMin").val() > 0){
  newSteps.push(new Step($("#newStepName").val(), $("#newStepMin").val()))
  $("#newStepName").val('');
  $("#newStepMin").val(1);
  console.log(newSteps);
  }
}
function addNewTimer() {
  if($('#newTimerName').val()!=''&&newSteps!=[]){
    timers.push(new Timer($('#newTimerName').val(),$('#NewTimerDescription').val(),newSteps))
    newSteps = []
    $('#newTimerName').val('')
    $('#NewTimerDescription').val('')
    console.log(timers)
    $('#newTimer').fadeOut(200)
    $('#timerSelect').prepend($("<option></option>").val(timers.length-1).html(timers[timers.length-1].name))
    $('#timerSelect').val(timers.length-1)
    $('#timerSelect').change()
     }
}

function saveTimers() {
    localStorage.setItem('allTimers',JSON.stringify(timers))
}

function loadTimers() {
    $('#newTimer').fadeOut(0)
    timers = JSON.parse(localStorage.getItem('allTimers'))
    timers.forEach(function(timer, index){
      $('#timerSelect').prepend($("<option></option>").val(index).html(timer.name))
    })
    $('#timerSelect').val(timers.length-1)
    $('#timerSelect').change()
}

function pageStart() {
  if (!("Notification" in window)) {
   alert("This browser does not support desktop notification");
 } else if (Notification.permission !== "granted") {
    Notification.requestPermission(function (permission) {
      if (permission !== "granted") {
        alert("This site only works if you turn on notificaions!")
      }
    })
  }
  if(localStorage.getItem('allTimers') != "[]" && localStorage.getItem('allTimers') != null){
    loadTimers();
  } else {
    $('#newTimer').fadeIn(500)
  }
}

 $(window).bind('beforeunload',function(){
   saveTimers()
 })

function updatePage(id) {
  $('#timerSelect').val(id)
  if(timers[id] != null && +timers[id] != NaN){
  $('#tName').html(timers[id].name)
  $('#tDesc').html(timers[id].description)
  $('#tLength').html(timers[id].length)
  $('#stepTable').html(`<tr>
    <th> Step </th>
    <th> Time </th>
  </tr>`)
  timers[id].steps.forEach(function(step){
    oldHTML = $('#stepTable').html()
    $('#stepTable').html(oldHTML+`<tr>
      <td> `+step.name+` </td>
      <td> `+step.minutes+` </td>
    </tr>`)
  })
} else {
  $('#tName').html("No timer selected")
  $('#tDesc').html(" ")
    $('#tLength').html("0")
    $("#sName").html("None")
  $('#stepTable').html(`<tr>
    <th> Step </th>
    <th> Time </th>
  </tr>`)
}
}

function startTimer() {
  console.log(stepNot.length)
  if(stepNot.length <= 0){
    console.log("Timer Started")
    stepNot = []
    var currentTime = new Date()
    var cMill = currentTime.getTime()
    var currentMin = 0;
    $("#sName").html(timers[currentID].steps[0].name)
    timers[currentID].steps.forEach(function(step, index){
      currentMin += (step.minutes*60000)
      var options = {
        body: "Completed "+step.name+"!",
        timestamp: cMill+(currentMin),
        image: "Timer Ended.png",
        badge: "Timer Ended.png"
      }
      if(index+1 < timers[currentID].steps.length){
        options.body += " Next step is "+timers[currentID].steps[index+1].name+" for "+timers[currentID].steps[index+1].minutes+" minutes!"
      } else {
        options.body += " That was the last one! Good work!"
      }
      console.log("Notification set for "+(new Date(cMill+currentMin)))
      stepNot.push(setTimeout(function () {
        new Notification("Step complete!", options);
        if(timers[currentID].steps.length-1 == index){
          console.log("Last One")
          $("#startStop").val("Start Timer")
          $("#timerSelect").prop('disabled', false)
      }
        $("#sName").html(timers[currentID].steps[index+1].name)
      }, currentMin));
    })
    $("#startStop").val("Stop Timer")
    $("#timerSelect").prop('disabled', true)
  } else {
    console.log("Timer Stoped")
    stepNot.forEach(function(step) {
      clearTimeout(step);
    })
    stepNot = []
    $("#sName").html("None")
    $("#startStop").val("Start Timer")
    $("#timerSelect").prop('disabled', false)
  }
}

$(window).resize(function(){
  console.log($(window).width())
})
