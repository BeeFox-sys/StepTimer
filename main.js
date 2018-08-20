//Declare Global vars
var newSteps = []
var timers = []
var currentID = 0
var stepNot = []

function addNewStep() {
  //Verification check for step
  if($("#newStepName").val() != "" && $("#newStepMin").val() > 0){
    //Add to step array
    newSteps.push(new Step($("#newStepName").val(), $("#newStepMin").val()))
    //Clear Fields
    $("#newStepName").val('Step');
    $("#newStepMin").val(1);
  }
}
function addNewTimer() {
  //Valadation check
  if($('#newTimerName').val()!=''&&newSteps!=[]){
    //Add to global timers array
    timers.push(new Timer($('#newTimerName').val(),$('#NewTimerDescription').val(),newSteps))
    //clear feilds
    newSteps = []
    $('#newTimerName').val('')
    $('#NewTimerDescription').val('')

    //Close timer add window
    $('#newTimer').fadeOut(200)

    //Add timer to timer select dropdown and select it
    $('#timerSelect').prepend($("<option></option>").val(timers.length-1).html(timers[timers.length-1].name))
    $('#timerSelect').val(timers.length-1)
    $('#timerSelect').change()
     }
}

function saveTimers() {
    //Save all timers to a local storage object for better saving the cookies
    localStorage.setItem('allTimers',JSON.stringify(timers))
}

function loadTimers() {
    //hide new timer window instantly
    $('#newTimer').fadeOut(0)

    //get all timers and set it to the global var timers
    timers = JSON.parse(localStorage.getItem('allTimers'))

    //Run through all timers and run function
    timers.forEach(function(timer, index){
      //add timer to timer selection list
      $('#timerSelect').prepend($("<option></option>").val(index).html(timer.name))
    })
    //set the selected timer to the newest one
    $('#timerSelect').val(timers.length-1)
    $('#timerSelect').change()
}

function pageStart() {
  if (!("Notification" in window)) { //Test if notifications work in this browser
    //Alert the user
   alert("This browser does not support desktop notification");
 } else if (Notification.permission !== "granted") { //test if notifcation haven't been allowed

   //request permission for notificatons to be enabled
    Notification.requestPermission(function (permission) {
      if (permission !== "granted") { //test if the user denyed the request
        //alert the user
        alert("This site only works if you turn on notificaions!")
      }
    })
  }
  //test if there are already existing timers saved to the local storage
  if(localStorage.getItem('allTimers') != "[]" && localStorage.getItem('allTimers') != null){
    loadTimers();
  } else {
    //promt user to add a timer
    $('#newTimer').fadeIn(500)
  }
}

//save timers when the window is unloading
 $(window).bind('beforeunload',function(){
   saveTimers()
 })

//update the information on the page
function updatePage(id) {
  //id is the index of the timer in the global var timers
  $('#timerSelect').val(id)

  //check if the timer exists or the user has selected a timer
  if(timers[id] != null && +timers[id] != NaN){
    $('#tName').html(timers[id].name) //show timer name
    $('#tDesc').html(timers[id].description) //show timer description
    $('#tLength').html(timers[id].length) //show timer duration
    //Reset step display table
    $('#stepTable').html(`<tr>
      <th> Step </th>
      <th> Time </th>
    </tr>`)
    //for each step; add step duration and  name to step table
    timers[id].steps.forEach(function(step){
      oldHTML = $('#stepTable').html()
      $('#stepTable').html(oldHTML+`<tr>
        <td> `+step.name+` </td>
        <td> `+step.minutes+` </td>
      </tr>`)
    })
  } else { //if no timer selected; reset information to no timer
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
  //test if there are steps in the timer
  if(stepNot.length <= 0){ //test if timer is not already running
    stepNot = [] //re-initaize Current notification array
    var currentTime = new Date() //get current UTC date
    var cMill = currentTime.getTime() //Get UTC in milliseconds
    var currentMin = 0; //initaize local var for counting step total time
    $("#sName").html(timers[currentID].steps[0].name) //Display the first step as current step

    //for each step, create notification
    timers[currentID].steps.forEach(function(step, index){
      currentMin += (step.minutes*60000) //add  step duration in milliseconds to total time
      var options = { //set setting for notification
        body: "Completed "+step.name+"!",
        timestamp: cMill+(currentMin), //set the timestamp of the notification
        image: "Timer running.png",
        badge: "Timer running.png",
        icon: "Timer running.png"
      }
      if(index+1 < timers[currentID].steps.length){ // if this is not the last step add next step info onto body
        options.body += " Next step is "+timers[currentID].steps[index+1].name+" for "+timers[currentID].steps[index+1].minutes+" minutes!"
      } else { //otherwise tell the user the timer is complete
        options.body += " That was the last one! Good work!"
      }
      //Set delay for the notificaton to the length of all previous notification combined
      stepNot.push(setTimeout(function () {
        new Notification("Step complete!", options); //notify with the options
        if(timers[currentID].steps.length-1 == index){//if this step is the last one: reset all settings
          $("#startStop").val("Start Timer") //reset button
          $("#timerSelect").prop('disabled', false) //enable selector
      }
        $("#sName").html(timers[currentID].steps[index+1].name) //set the current step name
      }, currentMin));
    })
    $("#startStop").val("Stop Timer") //change button text
    $("#timerSelect").prop('disabled', true) //disable selector
  } else {
     //delete every remaining notification
    stepNot.forEach(function(step) {
      clearTimeout(step);
    })
    stepNot = []
    $("#sName").html("None") //reset current step
    $("#startStop").val("Start Timer") //reset button
    $("#timerSelect").prop('disabled', false) //enable selector
  }
}
