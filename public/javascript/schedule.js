// Importing ipcRenderer to allow for communication with main process
const { ipcRenderer } = require("electron");
const moment = require("moment");

// get employees
// get required shifts

// Creates table template we will work with
function createTable(week) {
  // $("#schedule").append("");
}

// get the week number a date is in
function getWeek(date) {
  return moment(date).format("W");
}

// // returns the number of weeks needed to display
function getWeekDiff(startDate, endDate) {
  return getWeek(endDate) - getWeek(startDate) + 1;
}

// // checks if date overlaps
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
