// Importing ipcRenderer to allow for communication with main process
const { ipcRenderer } = require("electron");
const moment = require("moment");

// get employees
employee = ipcRenderer.sendSync("employeeList");

// get required shifts
shifts = ipcRenderer.sendSync("getShiftRequest");

// Creates table template we will work with
function createTable(week) {
  $("#schedule").append(
    '<div class="table-responsive">' +
      '<table class="table table-bordered table' +
      week +
      ">" +
      "<thead>" +
      "<tr>" +
      '<th scope="col">Employee</th>' +
      '<th id="monday" scope="col">Monday</th>' +
      '<th id="tuesday" scope="col">Tuesday</th>' +
      '<th id="wednesday" scope="col">Wednesday</th>' +
      '<th id="thursday" scope="col">Thursday</th>' +
      '<th id="friday" scope="col">Friday</th>' +
      '<th id="saturday" scope="col">Saturday</th>' +
      '<th id="sunday" scope="col">Sunday</th>' +
      "</tr>" +
      "</thead>" +
      "</table>" +
      "</div>"
  );

  //$(".table" + week).append();
}

// get the week number a date is in
function getWeek(date) {
  return moment(date).format("W");
}

// returns the number of weeks needed to display
function getWeekDiff(startDate, endDate) {
  return getWeek(endDate) - getWeek(startDate) + 1;
}

// checks if date overlaps
// function isOverlap(startDate, endDate, checkDate);

$(document).ready(() => {
  // Sets the datepicker on the input
  $(".input-group.date").datepicker({
    todayHighlight: true,
    autoclose: true
  });

  $("#createSchedule").on("click", e => {
    // define start date and end date
    startDate = $(".scheduleStart").val();
    endDate = $(".scheduleEnd").val();

    // find number of weeks needed to display
    weekDiff = getWeekDiff(startDate, endDate);

    // create that number of tables
    createTable(1);
    // find first day using the day of the week
    // count up labelling the days until you reach the last day
    // OPTIONAL: Label unneeded dates of days

    // loop through each week
    // create pool of employees (randomize)
    // get shift requirements for each day of the week
    // remove any unavailable people
    // remove anyone that does not have the required skills
    // remove anyone that does not have room for shift

    // check most qualified out of the remaining employees
    // if tie, check if any below minimum
    // if tie, preferences of each employee
    // if tie, pick random
    // (if not tie, fill shift)
    // if no option, give warning
    // if one option, fill shift
  });
});
