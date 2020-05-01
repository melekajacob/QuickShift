// Importing ipcRenderer to allow for communication with main process
const { ipcRenderer } = require("electron");

// Allows jQuery to work
// /* global $ */

// Importing helper functions for getting form data
const classLibrary = require("../public/javascript/classLibrary.js");
const retrieveListFromShifts = classLibrary.retrieveListFromShifts;
const retrieveListFromSpecialShifts =
  classLibrary.retrieveListFromSpecialShifts;
const capitalize = classLibrary.capitalize;
const fillSkills = classLibrary.fillSkills;

// get skills
skills = ipcRenderer.sendSync("getBusinessInfoSync").skills;

// REMOVE ONCE FORM VALIDATION IS COMPLETE
function nonEmptyShift(inputs) {
  for (var i = 0; i < inputs.length; ++i) {
    console.log(inputs[i]);
    if (inputs[i] == "" || inputs[i] == " ") {

      return false;
    }
  }

  return true;
}

function getSpecialShifts() {
  shifts = [];

  $(".specialShift").each((i, obj) => {
    console.log(obj);

    startTime = $(obj).children(".specialShiftStart").children(".startTime").val()
    endTime = $(obj).children(".specialShiftEnd").children(".endTime").val()
    position = $(obj).children(".specialShiftPosition").children(".specialShiftPosition").val()
    date = $(obj).children(".dateGroup").children(".date").children(".dateInput").val()

    console.log(nonEmptyShift([startTime, endTime, position, date]));
    if (nonEmptyShift([startTime, endTime, position, date])) {
      shift = {
        startTime: startTime,
        endTime: endTime,
        position: position,
        date: date
      }

      shifts.push(shift);
    } else {
      alert("One or more shifts inputted incorrectly")
    }

  })

  return shifts;
}

function getDayShifts(day) {
  shifts = [];


  $("." + day + "Shift").each((i, obj) => {
    console.log(obj);

    startTime = $(obj).children(".startTime").val()
    endTime = $(obj).children(".endTime").val()
    position = $(obj).children(".form-group").children("." + day + "Pos").val()

    console.log(nonEmptyShift([startTime, endTime, position]));
    if (nonEmptyShift([startTime, endTime, position])) {
      shift = {
        startTime: startTime,
        endTime: endTime,
        position: position
      }

      shifts.push(shift);
    } else {
      alert("One or more shifts inputted incorrectly, and could not be saved")
    }

  })

  return shifts;
}

function createShiftTable(daysOfWeek) {
  $("#shifts").append(
    '<div class="table-responsive">' +
    '<table class="table table-bordered">' +
    '<thead class="thead-light">' +
    '<tr>' +
    '<th id="monday" scope="col">' +
    'Monday' +
    '</th>' +
    '<th id="tuesday" scope="col">' +
    'Tuesday' +
    '</th>' +
    '<th id="wednesday" scope="col">' +
    'Wednesday' +
    '</th>' +
    '<th id="thursday" scope="col">' +
    'Thursday' +
    '</th>' +
    '<th id="friday" scope="col">' +
    'Friday' +
    '</th>' +
    '<th id="saturday" scope="col">' +
    'Saturday' +
    '</th>' +
    '<th id="sunday" scope="col">' +
    'Sunday' +
    '</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody id="shiftTableBody"></tbody>' +
    '</table>' +
    '</div>'
  );

  daysOfWeek.forEach(day => {
    $("#shiftTableBody").append(
      '<td>' +
      '<div id="' + day + 'ShiftsSection">' +

      '<div class="form-group text-center">' +
      '<button class="btn btn-primary btn-block addShift" type="button" id="' + day + '">' +
      'Add Shift' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</td>'
    )
  })

}

$(document).ready(() => {
  daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ];

  createShiftTable(daysOfWeek);

  $(".addShift").on("click", e => {
    // Getting the day of the week 
    dayOfWeek = e.currentTarget.id;


    $("#" + dayOfWeek + "ShiftsSection").prepend(

      '<div class="' + dayOfWeek + 'Shift">' +
      '<input' +
      ' type="time"' +
      ' class="form-control startTime ' + dayOfWeek +
      '"/>' +

      '<input' +
      ' type="time"' +
      ' class="form-control endTime ' + dayOfWeek +
      '"/>' +

      '<div class="form-group col-md-12 mt-2 px-0 mx-0">' +
      '<select class="form-control ' + dayOfWeek + 'Pos" px-0 mx-0">' +
      '<option selected disable hidden value="">Required Position</option>' +
      fillSkills(skills) +
      "</select>" +
      "</div>" +

      '<div class="form-group text-center ">' +
      '<button class="btn btn-danger btn-block remove" type="button">' +
      'Remove' +
      '</button>' +
      '</div>' +
      '</div>' +
      '<hr/>'
    )

  })

  $("#addSpecialShift").on("click", e => {
    $("#specialShiftsSection").prepend(
      '<div class="form-row specialShift">' +
      '<div class="form-group dateGroup col-md-4">' +
      '<div class="input-group date">' +
      '<input type="text" class="form-control dateInput specialShiftDate" placeholder="Date" aria-describedby="calenderIcon" />' +
      '<div class="input-group-append">' +
      '<span class="input-group-text" id="calenderIcon"><i class="fas fa-calendar-alt"></i></span>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="form-group specialShiftPosition col-md-3">' +
      '<select class="form-control specialShiftPosition">' +
      '<option selected disable hidden value="">Required Position</option>' +
      fillSkills(skills) +
      '</select>' +
      '</div>' +

      '<div class="form-group specialShiftStart col-md-2">' +
      '<input type="time" class="form-control startTime specialShiftStart" />' +
      '</div>' +

      '<div class="form-group  specialShiftEnd col-md-2">' +
      '<input type="time" class="form-control endTime specialShiftEnd" />' +
      '</div>' +

      '<div class="form-group removeButton col-md-1">' +
      '<button class="btn btn-danger remove" id="removeSpecialShift">' +
      'Remove' +
      '</button>' +
      '</div>' +
      '</div>'

    )

    // Sets the datepicker on the input
    $(".input-group.date").datepicker({
      todayHighlight: true,
      autoclose: true
    });

  })

  // ===================
  // SAVING SHIFTS TO DATABASE
  // ===================
  $("#saveShifts").on("click", e => {
    // Put form data into data structure

    var shifts = {
      specialShifts: getSpecialShifts()
    };


    daysOfWeek.forEach(day => {
      shifts[day] = getDayShifts(day);
    })

    console.log(shifts);

    // Send data structure to main process
    ipcRenderer.send("updateShifts", shifts);
  });

  // // Handling response
  ipcRenderer.on("updateShiftsReply", (e, msg) => {
    alert(msg);
  });



  // Sets the datepicker on the input
  $(".input-group.date").datepicker({
    todayHighlight: true,
    autoclose: true
  });


  $(document).on("click", "button.remove", e => {
    var id = e.target.parentNode.parentNode.parentNode.id;

    // Must remove last horizontal line (was having problems including <hr> into parent div)
    $("#" + id + " hr")
      .last()
      .remove();

    // Getting the form row using parentNode twice!!
    e.target.parentNode.parentNode.remove();
  });


  // ========================
  // CHECKING FOR EXISTING SHIFT AND INPUTTING IT
  // ========================
  // Send a request to get a shift if it exists
  ipcRenderer.send("getShiftRequest");

  // Accept the response
  ipcRenderer.on("getShiftResponse", (e, shifts) => {
    console.log("INCOMING SHIFTS");
    console.log(shifts);
    daysOfWeek.forEach(day => {
      shifts[day].forEach(shift => {
        $("#" + day + "ShiftsSection").children(".form-group").children(".addShift").click();

        $("." + day + "Shift").first().children(".startTime").val(shift.startTime)
        $("." + day + "Shift").first().children(".endTime").val(shift.endTime)
        $("." + day + "Shift").first().children(".form-group").children("." + day + "Pos").val(shift.position)
      })
    })

    shifts.specialShifts.forEach(specialShift => {
      $("#addSpecialShift").click();
      $(".specialShiftDate").first().val(specialShift.date);

      console.log($(".form-control.specialShiftPosition").first());
      console.log($(".specialShiftStart").first());
      console.log($(".specialShiftEnd").first());

      $(".specialShiftPosition.form-control").first().val(specialShift.position);
      $(".specialShiftStart.startTime").first().val(specialShift.startTime);
      $(".specialShiftEnd.endTime").first().val(specialShift.endTime)
    })

  });
});
