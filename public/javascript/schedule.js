// Importing ipcRenderer to allow for communication with main process
const { ipcRenderer } = require("electron");
const moment = require("moment");

// get employees
employees = ipcRenderer.sendSync("employeeListSync");

// get required shifts
shifts = ipcRenderer.sendSync("getShiftRequestSync");

// Creates table template we will work with
function createTable(week, startDateLabelling, daysOfWeek) {
  currDate = startDateLabelling;

  for (i = 0; i < week; ++i) {
    var weekNumBody = "week" + i + "Body";


    $("#schedule").append(
      '<div class="table-responsive">' +
      '<table class="table table-bordered">' +
      '<thead>' +
      '<tr>' +
      '<th scope="col">Employee</th>' +
      '<th id="monday" scope="col">' +
      'Monday, ' + currDate.add(0, 'days').format("MMM Do") +
      '</th>' +
      '<th id="tuesday" scope="col">' +
      'Tuesday, ' + currDate.add(1, 'days').format("MMM Do") +
      '</th>' +
      '<th id="wednesday" scope="col">' +
      'Wednesday, ' + currDate.add(1, 'days').format("MMM Do") +
      '</th>' +
      '<th id="thursday" scope="col">' +
      'Thursday, ' + currDate.add(1, 'days').format("MMM Do") +
      '</th>' +
      '<th id="friday" scope="col">' +
      'Friday, ' + currDate.add(1, 'days').format("MMM Do") +
      '</th>' +
      '<th id="saturday" scope="col">' +
      'Saturday, ' + currDate.add(1, 'days').format("MMM Do") +
      '</th>' +
      '<th id="sunday" scope="col">' +
      'Sunday, ' + currDate.add(1, 'days').format("MMM Do") +
      '</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody id=' + weekNumBody + '></tbody>' +
      '</table>' +
      '</div>'
    );

    // Adding date for next week
    currDate.add(1, 'days');


    // Adding each employee to the table
    employees.forEach((employee) => {
      // Adding name column
      var name = employee.firstName + " " + employee.lastName;
      $("#week" + i + "Body").append('<tr>' + '<th>' + name + '</th>');



      // looping through and just adding information for individual employees
      daysOfWeek.forEach((day) => {

        contentId = employee.firstName + employee.lastName + i + day;

        $("#week" + i + "Body tr:last").append(
          '<td>' +
          '<input' +
          ' type="time"' +
          ' class="form-control startTime ' + contentId +
          ' "/>' +

          '<input' +
          ' type="time"' +
          ' class="form-control endTime ' + contentId +
          ' "/>' +

          '<h5 class="text-center ' + contentId + 'Pos"></h5>' +
          '</td>'
        );
      })

      $("#week" + i + "Body").append('</tr>');

    });
  }
}

// get the week number a date is in
function getWeek(date) {
  return moment(date).format("W");
}

// returns the number of weeks needed to display
function getWeekDiff(startDate, endDate) {
  return getWeek(endDate) - getWeek(startDate) + 1;
}

$(document).ready(() => {
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  // Sets the datepicker on the input
  $(".input-group.date").datepicker({
    todayHighlight: true,
    autoclose: true,
  });

  $("#createSchedule").on("click", (e) => {
    // define start date and end date
    startDate = $(".scheduleStart").val();
    endDate = $(".scheduleEnd").val();

    // find number of weeks needed to display
    weekDiff = getWeekDiff(startDate, endDate);


    // Figure out when to startlabelling
    startDateLabelling = moment(startDate).startOf("isoWeek");
    endDateLabelling = moment(endDate).endOf("isoWeek");

    // creating a table for each week
    createTable(weekDiff, startDateLabelling, daysOfWeek);

    // loop through each week
    for (var i = 0; i < weekDiff; ++i) {


      // get shift requirements for each day of the week
      var shiftRequirements = shifts;

      // console.log({ pool, shiftRequirements });

      // loop through each day of week and then loop through shift requirements(dont forget special shift requirements)
      daysOfWeek.forEach((day) => {
        shiftRequirements[day].forEach((shift) => {

          // create pool of employees (randomize)
          var pool = employees;

          // remove any unavailable people
          // remove anyone that does not have the required skills
          // remove anyone that does not have room for shift
          // LEFT OFF HERE 
          pool = checkPool(shift, pool);

          // check most qualified out of the remaining employees
          // if tie, check if any below minimum
          // if tie, preferences of each employee
          // if tie, pick random
          // (if not tie, fill shift)
          // if no option, give warning
          // if one option, fill shift
          allocateShift(shift, pool);
        })
      })
    }
  });
});
