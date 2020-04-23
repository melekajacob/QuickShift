// Importing ipcRenderer to allow for communication with main process
const { ipcRenderer } = require("electron");
const moment = require("moment");

// Calling helper class Library and the required method fillSkills
const classLibrary = require("../public/javascript/classLibrary.js");
const fillSkills = classLibrary.fillSkills;

// get employee list
employees = ipcRenderer.sendSync("employeeListSync");

// get required shifts
shifts = ipcRenderer.sendSync("getShiftRequestSync");

// get positions
skills = ipcRenderer.sendSync("getBusinessInfoSync").skills;

// Function to filter out employees that can't work the shift (alerts if shift cannot be filled)
function checkPool(shift, pool) {
  newPool = [];

  // strategy will be to add to employee to newPool only if there are no conflicts in the schedule
  pool.forEach((employee) => {
    // No conflicts will check for required skills, those without space, and unavailability
    if (noConflicts(employee, shift)) {
      newPool.push(employee);
    }
  })

  return newPool;
}

// check most qualified out of the remaining employees
function allocateShift(shift, pool, employeeList) {
  newPool = [];

  if (pool.length == 0) {
    alert("Shift on " + getFormattedDate(shift.date, "MMM D") + " for " + shift.requiredSkill + " could not be filled");
    return employeeList;
  }

  // Developed scoring system for employee match (which allows for adjustment later, for relationships with other employees)
  // Primary skill : 5 points
  // Amount below minimum hours : 5 * (hours below (to a max of 10) / 10)
  // If it is your preferred shift : 5 points
  pool.forEach(employee => {
    // Primary skill : 5 points
    if (employee.primarySkills.includes(shift.requiredSkill)) {
      employee.score += 5;
    }

    if (employee.minHoursPerWeek > employee.hoursWorked) {
      amountBelowMinHours = Math.min(employee.minHoursPerWeek - employee.hoursWorked, 10);

      employee.score += 5 * (amountBelowMinHours / 10);
    }

    // preffered shift of the employee
    employee.preferredShifts.forEach((preferredShift) => {
      if (preferredShift.dayOfWeek == getDayOfWeek(shift.date) && preferredShift.startTime == shift.startTime && preferredShift.endTime == shift.endTime) {
        employee.score += 5;
      }
    })

    newPool.push(employee);
  })


  // Select highest scoring employee 
  selectedEmployees = [newPool[0]];
  for (var i = 1; i < newPool.length; ++i) {
    if (newPool[i].score > selectedEmployees[0].score) {
      selectedEmployees = [];
      selectedEmployees.push(newPool[i]);
    } else if (newPool[i].score == selectedEmployees[0].score) { // if tie, just add to end of array
      selectedEmployees.push(newPool[i]);
    }
  }

  selectedEmployee = {};

  if (selectedEmployees.length > 1) {
    selectedEmployee = selectedEmployees[Math.floor(Math.random() * selectedEmployees.length)]; // picking random employee if there is a tie
  } else {
    selectedEmployee = selectedEmployees[0];  // selecting the one employee if there is no tie
  }

  // Selecting employee for shift
  index = employeeList.indexOf(selectedEmployee);
  giveShift(employeeList[index], shift);

  newEmployeeList = [];
  // Formatting new employee List
  employeeList.forEach((employee, i) => {
    if (i == index) {
      employee.shiftsToday += 1;
      employee.hoursWorked += getTimeDiff(shift.startTime, shift.endTime);
    }

    employee.score = 0; // Resetting all scores to 0

    newEmployeeList.push(employee);
  })

  return newEmployeeList;
}

function giveShift(selectedEmployee, shift) {
  contentId = selectedEmployee.firstName + selectedEmployee.lastName + getFormattedDate(shift.date, "MMMD");

  // showing the form if they were selected for shift
  $("." + contentId + ".startTime").show();
  $("." + contentId + ".endTime").show();
  $("." + contentId + "Pos").show();

  // setting the value of the form
  $("." + contentId + ".startTime").val(shift.startTime + ":00");
  $("." + contentId + ".endTime").val(shift.endTime);
  $("." + contentId + "Pos").val(shift.requiredSkill);
}

function getTimeDiff(startTime, endTime) {
  //create date format          
  var timeStart = new Date("01/01/2020 " + startTime).getHours();
  var timeEnd = new Date("01/01/2020 " + endTime).getHours();

  return timeEnd - timeStart;
}

function noConflicts(employee, shift) {


  if (checkSpace(employee.hoursWorked, employee.maxHoursPerWeek, shift) && skillMatch(employee.primarySkills.concat(employee.secondarySkills), shift.requiredSkill) && checkSchedule(employee, shift) && employee.shiftsToday == 0) {
    return true;
  } else {
    return false;
  }
}

function checkSpace(hoursWorked, maxHours, shift) {
  // get shift length in hours (not using moment here)
  shiftLength = getTimeDiff(shift.startTime, shift.endTime);

  // check if hours worked + shift length > maxHours, if not return true, if yes return false
  if (hoursWorked + shiftLength > maxHours) {
    return false;
  } else {
    return true;
  }
}

function skillMatch(employeeSkills, shiftReq) {
  for (var i = 0; i < employeeSkills.length; ++i) {
    if (shiftReq == employeeSkills[i]) {
      return true;
    }
  }

  return false;
}

function checkSchedule(employee, shift) {
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  // Checking if prolonged unavailability overlaps with shift
  employee.prolongedUnavailability.forEach((range) => {
    // Converting everything to a moment object for ease (change startTime to startDate at some point)
    if (willOverlap(shift.date, shift.date, getNoOffsetDate(range.startTime), getNoOffsetDate(range.endTime))) {
      return false;
    }
  })


  // Checking if dates unavailable matches date of shift
  employee.datesUnavailable.forEach((date) => {
    if (getFormattedDate(getNoOffsetDate(date)) == getFormattedDate(shift.date)) {
      return false;
    }
  })

  // Checking if overlaps with days unavailable
  employee.daysUnavailable.forEach((day) => {
    // Checking if shift day of the week is the same as the unavailable day of the week
    if (getDayOfWeek(shift.date) == day.dayOfWeek) {

      // Checking if the shift times will overlap (converting times to dates to reuse willOverlap())
      if (willOverlap(getDateFromTime(shift.startTime), getDateFromTime(shift.endTime), getDateFromTime(day.startTime), getDateFromTime(day.endTime))) {
        return false;
      }
    }
  })

  // means there was no scheduling conflicts
  return true;
}

// INPUT: time in format "XX:XX"
// OUTPUT: A date with that given time
function getDateFromTime(time) {
  var today = new Date();
  var timeArray = time.split(":");
  today.setHours(timeArray[0], timeArray[1], 0, 0);
  return today;
}

// INPUT: employeeList: Takes in list of employees unformatted
// OUTPUT: formatted employee list with variables like hoursWorked, score, shiftToday, etc.
function formatEmployees(employeeList) {
  formattedEmployeeList = [];

  employeeList.forEach(employee => {
    employee.hoursWorked = 0;
    employee.score = 0;
    employee.shiftsToday = 0;

    formattedEmployeeList.push(employee);
  });

  return formattedEmployeeList;
}

// INPUT: shiftSchedule -> Current shift schedule set by employer
// INPUT: startDateOfWeek -> Start date of current week
// INPUT: daysOfWeek -> names of days of week
// OUTPUT: formatted shift schedule including dates and including special shifts
function formatWeekShifts(shiftSchedule, startDateOfWeek, daysOfWeek) {

  // Creating new formatted week shifts container
  weekShifts = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
    startDate: startDateOfWeek,
    endDate: changeDate(6, startDateOfWeek)
  };

  // Cycling through each day of week, formatting each shift, and adding to the formatted week shifts container
  daysOfWeek.forEach((day, index) => {
    shiftSchedule[day].forEach(shift => {
      formattedShift = {
        date: changeDate(index, startDateOfWeek),
        startTime: shift.startTime,
        endTime: shift.endTime,
        requiredSkill: shift.requiredSkill
      }

      weekShifts[day].push(formattedShift);
    });

    // Adding special shifts
    shiftSchedule.specialShifts.forEach(shift => {
      if (shift.date == getFormattedDate(changeDate(index, startDateOfWeek))) {
        specialShift = {
          date: changeDate(index, startDateOfWeek),
          startTime: shift.startTime,
          endTime: shift.endTime,
          requiredSkill: shift.requiredSkill
        }

        weekShifts[day].push(specialShift);
      }
    })

  })

  return weekShifts;

}

// INPUT: date -> date in form "MM/DD/YYYY"
// OUTPUT: string -> date in form "YYYY-MM-DD"
function formatDate(date) {
  var pieces = date.split("/");

  return pieces[2] + "-" + pieces[0] + "-" + pieces[1];

}
// INPUT: numDays -> Number of days wanted to be changed(i.e. 1 is next day, -1 is previous day)
// INPUT: today -> The reference/startDate
// OUTPUT: tomorrow -> Changed javascript date
function changeDate(numDays, today) {
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + numDays);

  return tomorrow;
}

// INPUT: date -> Javascript date
// OUTPUT: the date in MM/DD/YYYY or MMM D format
function getFormattedDate(date, format = "MM/DD/YYYY") {
  if (format == "MM/DD/YYYY") {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  } else if (format == "MMM D") {

    var options = { month: "short", day: "numeric" };
    str = date.toLocaleDateString("en-US", options);


    return str;

  } else if (format == "MMMD") {

    var options = { month: "short", day: "numeric" };
    str = date.toLocaleDateString("en-US", options);
    arr = str.split(" ");

    return arr[0] + arr[1];
  }

}

// INPUT: date -> Javascript date
// INPUT: daysOfWeek -> List of days of week for ease (allows for easier changing later in case week starts on wednesday)
// OUTPUT: String rep. for day of the week (i.e. monday, tuesday, wed...)
function getDayOfWeek(date) {
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  return daysOfWeek[date.getDay() - 1]; // -1 is to adjust for Sunday == 0
}

function getMonday(date) {
  date = new Date(date);
  var day = date.getDay(),
    diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

  return new Date(date.setDate(diff));

}



// INPUT: weeks -> Number of weeks the schedule is for (basically number of tables)
// INPUT: startDate -> Javascript date for the first day of the schedule 
// INPUT: daysOfWeek -> Name for each day of the week [monday, tuesday, ...]
// OUTPUT: void, jQuery adds a table for each week
function createTable(weeks, startDate, daysOfWeek) {
  currDate = startDate;

  for (i = 0; i < weeks; ++i) {
    var weekNumBody = "week" + i + "Body";

    $("#schedule").append(
      '<div class="table-responsive">' +
      '<table class="table table-bordered">' +
      '<thead class="thead-light">' +
      '<tr>' +
      '<th scope="col">Employee</th>' +
      '<th id="monday" scope="col">' +
      'Mon, ' + getFormattedDate(changeDate(0, currDate), "MMM D") +
      '</th>' +
      '<th id="tuesday" scope="col">' +
      'Tue, ' + getFormattedDate(changeDate(1, currDate), "MMM D") +
      '</th>' +
      '<th id="wednesday" scope="col">' +
      'Wed, ' + getFormattedDate(changeDate(2, currDate), "MMM D") +
      '</th>' +
      '<th id="thursday" scope="col">' +
      'Thu, ' + getFormattedDate(changeDate(3, currDate), "MMM D") +
      '</th>' +
      '<th id="friday" scope="col">' +
      'Fri, ' + getFormattedDate(changeDate(4, currDate), "MMM D") +
      '</th>' +
      '<th id="saturday" scope="col">' +
      'Sat, ' + getFormattedDate(changeDate(5, currDate), "MMM D") +
      '</th>' +
      '<th id="sunday" scope="col">' +
      'Sun, ' + getFormattedDate(changeDate(6, currDate), "MMM D") +
      '</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody id=' + weekNumBody + '></tbody>' +
      '</table>' +
      '</div>'
    );


    // Adding each employee to the table
    employees.forEach((employee) => {
      // Adding name column
      var name = employee.firstName + " " + employee.lastName;
      $("#week" + i + "Body").append('<tr>' + '<th>' + name + '</th>');

      // looping through and just adding information for individual employees
      daysOfWeek.forEach((day) => {

        contentId = employee.firstName + employee.lastName + getFormattedDate(currDate, "MMMD");

        $("#week" + i + "Body tr:last").append(
          '<td>' +
          '<input' +
          ' type="time"' +
          ' class="form-control startTime ' + contentId +
          '"/>' +

          '<input' +
          ' type="time"' +
          ' class="form-control endTime ' + contentId +
          '"/>' +

          '<div class="form-group col-md-12 mt-2 px-0 mx-0">' +
          '<select class="form-control ' + contentId + 'Pos" px-0 mx-0">' +
          '<option selected disable hidden value="">Position</option>' +
          fillSkills(skills) +
          "</select>" +
          "</div>" +

          '</td>'
        );

        // hiding inputs until they are selected for a shift
        $("." + contentId + ".startTime").hide();
        $("." + contentId + ".endTime").hide();
        $("." + contentId + "Pos").hide();

        // Add one day to currDate
        currDate = changeDate(1, currDate);

      })

      $("#week" + i + "Body").append('</tr>');
      currDate = changeDate(-7, currDate); // getting start of week for next employee

    });

    // Adding days to get the next week
    currDate = changeDate(7, currDate);
  }
}

// Checks if two javascript dates ranges overlap
// INPUT: a_start, a_end -> starting and ending javascript dates
// INPUT: b_start, b_end -> starting and ending javascript dates
// OUTPUT: bool -> returns true if the intervals overlap
function willOverlap(a_start, a_end, b_start, b_end) {
  if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
  if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
}

// INPUT: date -> string in format "MM/DD/YYYY"
// OUTPUT: javascript date with removed offset trick
function getNoOffsetDate(date) {
  var newDate = new Date(formatDate(date));
  return new Date(newDate.getTime() - newDate.getTimezoneOffset() * -60000);
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

  // Showing current schedule from database (DO AFTER)

  $("#createSchedule").on("click", (e) => {
    shiftsCopy = shifts;
    employeesCopy = employees;


    // define start date and end date
    startDate = $(".scheduleStart").val();
    endDate = $(".scheduleEnd").val();

    // find number of weeks needed to display
    weekDiff = getWeekDiff(startDate, endDate);

    // getting the first day of the week
    // startDateOfWeek = getMonday(formatDate(startDate));
    startDateOfWeek = getMonday(getNoOffsetDate(startDate));

    // creating a table for each week
    createTable(weekDiff, startDateOfWeek, daysOfWeek);

    // loop through each week
    for (var i = 0; i < weekDiff; ++i) {
      // get shift requirements for each day of the week (formatted from above) (NEED TO FIX, GIVING ALL THE SAME DATE)
      weekShifts = formatWeekShifts(shiftsCopy, changeDate(i * 7, startDateOfWeek), daysOfWeek);

      console.log(weekShifts);

      // create list of employees (each week, in order to keep track of hours worked)
      var employeeList = formatEmployees(employeesCopy);

      // loop through each day of week and then loop through shift requirements(dont forget special shift requirements)
      daysOfWeek.forEach((day) => {
        weekShifts[day].forEach((shift) => {

          if ((shift.date >= getNoOffsetDate(startDate)) && (shift.date <= getNoOffsetDate(endDate))) {
            // Removing people from employee list if they dont work for shift
            pool = checkPool(shift, employeeList);

            // Allocating shifts
            employeeList = allocateShift(shift, pool, employeeList);

            // reset scores
            for (var i = 0; i < employeeList.length; ++i) {
              employeeList[i].score = 0;
            }

          };

        })

        // Resetting number of shifts worked that day
        for (var i = 0; i < employeeList.length; ++i) {
          employeeList[i].shiftsToday = 0;
        }
      });


    }
  });
});
