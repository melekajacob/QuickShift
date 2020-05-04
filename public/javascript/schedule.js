// Importing ipcRenderer to allow for communication with main process
const { ipcRenderer } = require("electron");
const moment = require("moment");
const axios = require('axios')


// const Combinatorics = require('js-combinatorics');
// const product = require('cartesian-product-generator').product;

// Calling helper class Library and the required method fillSkills
const classLibrary = require("../public/javascript/classLibrary.js");
const fillSkills = classLibrary.fillSkills;


// get employee list
employees = ipcRenderer.sendSync("employeeListSync");

// get required shifts
shifts = ipcRenderer.sendSync("getShiftRequestSync");

// Reporting employees and shifts
console.log(employees);
console.log(shifts);

// get positions
skills = ipcRenderer.sendSync("getBusinessInfoSync").skills;

function log(obj, msg) {
  console.log(msg + ":");
  console.log(obj);
}

// sets: an array of arrays
function LazyProduct(sets) {
  for (var dm = [], f = 1, l, i = sets.length; i--; f *= l) { dm[i] = [f, l = sets[i].length] }
  this.length = f;
  this.item = function (n) {
    for (var c = [], i = sets.length; i--;)c[i] = sets[i][(n / dm[i][0] << 0) % dm[i][1]];
    return c;
  };
};

function lazyProduct(sets, f, context) {
  if (!context) context = this;
  var p = [], max = sets.length - 1, lens = [];
  for (var i = sets.length; i--;) lens[i] = sets[i].length;
  function dive(d) {
    var a = sets[d], len = lens[d];
    if (d == max) for (var i = 0; i < len; ++i) p[d] = a[i], f.apply(context, p);
    else for (var i = 0; i < len; ++i) p[d] = a[i], dive(d + 1);
    p.pop();
  }
  dive(0);
}

// Doesn't check date, just start time end time and position
function isSameShift(shift1, shift2) {


  return shift2.startTime == shift1.startTime && shift2.endTime == shift1.endTime && shift2.position == shift1.position;
}

function hasNonZeroRepeats(arr) {
  let sorted_arr = arr.slice().sort(); // get sorted array without altering arr
  var last = sorted_arr[0];
  for (var i = 1; i < sorted_arr.length; i++) {
    if (sorted_arr[i] == last && sorted_arr[i] != 0) return true;
    last = sorted_arr[i];
  }
}

let swap = function (array, index1, index2) {
  var temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
  return array;
};

let permutationHeap = function (array, result, n) {
  n = n || array.length; // set n default to array.length
  if (n === 1) {
    return array;
  } else {
    for (var i = 1; i <= n; i++) {
      permutationHeap(array, result, n - 1);
      if (n % 2) {
        swap(array, 0, n - 1); // when length is odd so n % 2 is 1,  select the first number, then the second number, then the third number. . . to be swapped with the last number
      } else {
        swap(array, i - 1, n - 1); // when length is even so n % 2 is 0,  always select the first number with the last number
      }
    }
  }
};


// INPUT: permutation: list of integers the same length as the employees list (permutation[0] corresponds to employees[0]) 
// INPUT: shiftEncoding : What each integer in permutation represents (a shift with pos, start,end, and date)
// INPUT: employees: list of all employees
function isValidPerm(permutation, shiftEncoding, employees) {

  if (hasNonZeroRepeats(permutation)) {
    return false;
  }

  for (var i = 0; i < employees.length; ++i) {
    if (permutation[i] != 0) {
      if (!noConflicts2(employees[i], shiftEncoding[permutation[i]])) {
        return false;
      }
    }
  }

  return true;
}

function getOptimalCombo(arr2D, validPermEncoding, shiftEncoding, employees, daysOfWeek) {
  var maxScore = -100000;
  var optimalShifts = {};


  // Usage, assuming count/kinds/moods are all arrays
  log(arr2D, "WHAT WE ARE GETTING CARTESIAN PRODUCT OF")
  lazyProduct(arr2D, function (option1, option2, option3, option4, option5, option6, option7) {

    weekOption = [option1, option2, option3, option4, option5, option6, option7];
    log(weekOption, "week option")

    allocShift = allocateShiftFormat(weekOption, validPermEncoding, shiftEncoding, employees, daysOfWeek);
    newScore = getScore(allocShift, weekShifts, employees, daysOfWeek);

    if (newScore > maxScore) {
      maxScore = newScore;
      optimalShifts = allocShift;
    }
  });

  return optimalShifts;
}

function shiftIsPresent(targetShift, shiftList) {
  for (var i = 0; i < shiftList.length; ++i) {
    if (isSameShift(targetShift, shiftList[i])) {
      return true;
    }
  }

  return false;
}

function alertMissingShifts(allocShifts, weekShifts, daysOfWeek) {
  daysOfWeek.forEach(day => {
    weekShifts[day].forEach(weekShift => {
      if (!shiftIsPresent(weekShift, allocShifts[day])) {
        alert("Shift on " + getFormattedDate(weekShift.date, "MMM D") + " for " + weekShift.position + " could not be filled");
      }

    })

  })
}

function allocateShiftFormat(weekOption, validPermEncoding, shiftEncoding, employees, daysOfWeek) {
  var allocShifts = {}

  weekOption.forEach((dayOption, i) => {
    allocShifts[daysOfWeek[i]] = [];

    if (dayOption != 0) {
      var dayShifts = validPermEncoding[dayOption];

      dayShifts.forEach((shift, j) => {
        if (shift != 0) {
          allocShift = {
            employee: employees[j],
            date: shiftEncoding[shift].date,
            startTime: shiftEncoding[shift].startTime,
            endTime: shiftEncoding[shift].endTime,
            position: shiftEncoding[shift].position
          }

          allocShifts[daysOfWeek[i]].push(allocShift);
        }

      })
    }
  })

  return allocShifts;
}

function numOfWeeklyShifts(shifts, daysOfWeek) {
  var numShifts = 0;
  daysOfWeek.forEach(day => {
    numShifts += shifts[day].length
  })
  return numShifts;
}

function getScore(allocShifts, weekShifts, employees, daysOfWeek) {
  var totalScore = 0;

  // 1: Check that every shift is filled
  var shiftDiff = numOfWeeklyShifts(allocShifts, daysOfWeek) - numOfWeeklyShifts(weekShifts, daysOfWeek);

  if (shiftDiff == 0) {
    totalScore += 20;
  } else {
    totalScore += shiftDiff * 10; // Penalty for every shift not filled
  }

  // 2: Everyone is above minimum hours but below maximum hours
  employees.forEach(employee => {
    hoursWorked = 0;

    daysOfWeek.forEach(day => {
      allocShifts[day].forEach(shift => {
        if (shift.employee == employee) {
          hoursWorked += getTimeDiff(shift.startTime, shift.endTime);

          // Adding points if employees get their primary shift
          if (employee.primaryPositions.includes(shift.position)) {
            totalScore += 2;
          }

          employee.preferredShifts[day].forEach(preferredShift => {
            if (isSameShift(shift, preferredShift)) {
              totalScore += 1;
            }
          })
        }
      })
    })

    // Figure out how scoring system will work
    if (hoursWorked > employee.maxHoursPerWeek) {
      var amountOver = hoursWorked - employee.maxHoursPerWeek;
      totalScore -= amountOver;
    } else if (hoursWorked < employee.minHoursPerWeek) {
      var mountUnder = employee.minHoursPerWeek - hoursWorked;
      totalScore -= amountUnder;
    }

  })

  return totalScore;
}

function cartesianProduct(arr) {
  return arr.reduce(function (a, b) {
    return a.map(function (x) {
      return b.map(function (y) {
        return x.concat([y]);
      })
    }).reduce(function (a, b) { return a.concat(b) }, [])
  }, [[]])
}

function appendZeros(arr, numZeros) {
  for (var i = 0; i < numZeros; ++i) {
    arr.push(0);
  }

  return arr;
}

// INPUT: weekShifts -> shifts for that week organized by day and including date of each shift, as well as start date of week and end date of week
// INPUT: employees -> Full list of employees
// OUTPUT: list of optimally allocated shifts of the week 
function optimalWeekShiftCombo(weekShifts, employees, daysOfWeek) {


  // 1: Encode each shift to an integer, where the count starts at 1 (0 will be used later), also keeping track of which encodings match with each day of the week
  shiftEncoding = {};
  dayOfWeekEncoding = {};
  var numEmployees = employees.length;
  var i = 1;

  daysOfWeek.forEach(day => {
    // Adding to day of week encoding
    dayOfWeekEncoding[day] = [];

    weekShifts[day].forEach(shift => {
      // Adding to shift encoding 
      shiftEncoding[i] = shift;

      // Adding to day encoding
      dayOfWeekEncoding[day].push(i);

      ++i;
    })
  })


  var q = 1;
  var validPermEncoding = {};
  var validPermDayEncoding = {};
  var arr2D = [];
  // log(daysOfWeekPerm, "EVERY POSSIBLE COMBINATION OF SHIFTS FOR EACH DAY")
  daysOfWeek.forEach(day => {
    validPermDayEncoding[day] = [];

    if (dayOfWeekEncoding[day].length != 0) {
      dayOfWeekEncoding[day].push(0);
    }


    var dayShiftOptions = [];
    for (var r = 0; r < numEmployees; ++r) {
      dayShiftOptions.push(dayOfWeekEncoding[day])
    }

    var combos = new LazyProduct(dayShiftOptions)

    for (var i = 0, len = combos.length; i < len; ++i) {
      var permutation = combos.item(i);



      if (isValidPerm(permutation, shiftEncoding, employees)) { // Checking valid perm every is probably cumbersome, may need to optimize
        validPermEncoding[q] = permutation;

        validPermDayEncoding[day].push(q);
        ++q;
      }
    }

    // Creating 2D array to apply cartesian product
    if (validPermDayEncoding[day].length == 0) {
      arr2D.push([0]);
    } else {
      arr2D.push(validPermDayEncoding[day]);
    }
  })

  log(validPermEncoding, "ENCODING FOR THE VALID PERMUTATIONS");
  log(validPermDayEncoding, "WHAT DAY EACH VALID PERMUTATION FALLS UNDER")

  optimalShifts = getOptimalCombo(arr2D, validPermEncoding, shiftEncoding, employees, daysOfWeek);

  log(optimalShifts, "OPTIMAL SHIFT ALLOC")

  return optimalShifts;
}

// INPUT: numOfWeeks -> number of weeks displayed in schedule
// INPUT: daysOfWeek -> names of the days of the week
// OUTPUT: void -> prints the number of hours worked out of maximum hours for each employee, each week
function calcHoursWorkedInWeek(numOfWeeks, startDateOfWeek) {
  // cycling through each table
  for (var i = 0; i < numOfWeeks; ++i) {
    employees.forEach(employee => {
      var hoursWorkedInWeek = 0;

      // Cycling through each day of the week
      for (var j = 0; j < 7; ++j) {

        var contentId = employee.firstName + employee.lastName + getFormattedDate(changeDate(i * 7 + j, startDateOfWeek), "MMMD");

        if ($("." + contentId + ".startTime").is(":visible")) {
          var startTime = $("." + contentId + ".startTime").val();
          var endTime = $("." + contentId + ".endTime").val();

          hoursWorkedInWeek += getTimeDiff(startTime, endTime);
        }
      }

      displayHoursWorked(i, employee, hoursWorkedInWeek);
    })
  }
}

function getDaysDiff(startDate, endDate) {
  var start = getNoOffsetDate(startDate);
  var end = getNoOffsetDate(endDate);

  // To calculate the time difference of two dates 
  var Difference_In_Time = end.getTime() - start.getTime();

  // To calculate the no. of days between two dates 
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  return Difference_In_Days;
}

function formatTime(time) {
  if (time.length == 8) {
    return time.slice(0, time.length - 3);
  } else {
    return time;
  }
}

function getShiftsOnDate(date) {
  shifts = [];

  employees.forEach(employee => {
    contentId = employee.firstName + employee.lastName + getFormattedDate(date, "MMMD");
    if ($("." + contentId + ".startTime").is(":visible")) {
      shifts.push({
        startTime: formatTime($("." + contentId + ".startTime").val()), // fix for strange bug where two extra zeroes are taken at end of time (for seconds, which dont matter)
        endTime: formatTime($("." + contentId + ".endTime").val()),
        position: $("." + contentId + "Pos").val(),
        employee: employee
      })
    }
  })

  return shifts;
}


function displayHoursWorked(weekNumber, employee, hoursWorkedInWeek) {
  contentId = employee.firstName + employee.lastName + "week" + weekNumber + "BodyHoursWorked";
  $("#" + contentId).text(hoursWorkedInWeek.toString());
}

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
function allocateShift(shift, pool, employeeList, daysOfWeek) {
  newPool = [];

  if (pool.length == 0) {
    alert("Shift on " + getFormattedDate(shift.date, "MMM D") + " for " + shift.position + " could not be filled");
    return employeeList;
  }

  // Developed scoring system for employee match (which allows for adjustment later, for relationships with other employees)
  // Primary skill : 5 points
  // Amount below minimum hours : 5 * (hours below (to a max of 10) / 10)
  // If it is your preferred shift : 5 points
  pool.forEach(employee => {
    // Primary skill : 5 points
    if (employee.primaryPositions.includes(shift.position)) {
      employee.score += 5;
    }

    if (employee.minHoursPerWeek > employee.hoursWorked) {
      amountBelowMinHours = Math.min(employee.minHoursPerWeek - employee.hoursWorked, 10);

      employee.score += 5 * (amountBelowMinHours / 10);
    }

    // preffered shift of the employee
    daysOfWeek.forEach(day => {
      employee.preferredShifts[day].forEach((preferredShift) => {
        if (day == getDayOfWeek(shift.date) && preferredShift.startTime == shift.startTime && preferredShift.endTime == shift.endTime && preferredShift.position == shift.position) {
          employee.score += 5;
        }
      })
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

    var randomVal = Math.floor(Math.random() * selectedEmployees.length)

    selectedEmployee = selectedEmployees[randomVal]; // picking random employee if there is a tie

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

function allocateWeekShifts(weekShifts, daysOfWeek) {
  daysOfWeek.forEach(day => {
    weekShifts[day].forEach(shift => {
      giveShift(shift.employee, { startTime: shift.startTime, endTime: shift.endTime, position: shift.position, date: shift.date })
    })
  })
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
  $("." + contentId + "Pos").val(shift.position);

  // removing not filled class
  $("." + contentId + ".startTime").parent().removeClass("notFilled");
}

// Gets time  difference between two times in hours
function getTimeDiff(startTime, endTime) {
  //create date format          
  var timeStart = new Date("01/01/2020 " + startTime).getHours();
  var timeEnd = new Date("01/01/2020 " + endTime).getHours();

  return timeEnd - timeStart;
}



function noConflicts2(employee, shift) {
  if (skillMatch(employee.primaryPositions.concat(employee.secondaryPositions), shift.position) && checkSchedule(employee, shift)) {
    return true;
  } else {
    return false;
  }
}

function noConflicts(employee, shift) {


  if (checkSpace(employee.hoursWorked, employee.maxHoursPerWeek, shift) && skillMatch(employee.primaryPositions.concat(employee.secondaryPositions), shift.position) && checkSchedule(employee, shift) && employee.shiftsToday == 0) {
    return true;
  } else {
    return false;
  }
}

function checkSpace(hoursWorked, maxHours, shift) {
  // get shift length in hours (not using moment here)
  var shiftLength = getTimeDiff(shift.startTime, shift.endTime);

  // check if hours worked + shift length > maxHours, if not return true, if yes return false
  return hoursWorked + shiftLength <= maxHours
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


  // Checking if prolonged unavailability overlaps with shift
  for (var i = 0; i < employee.prolongedUnavailability.length; ++i) {
    if (willOverlap(shift.date, shift.date, getNoOffsetDate(employee.prolongedUnavailability[i].startTime), getNoOffsetDate(employee.prolongedUnavailability[i].endTime))) {
      return false;
    }
  }


  for (var i = 0; i < employee.datesUnavailable.length; ++i) {
    dateTime = employee.datesUnavailable[i];

    if (getFormattedDate(getNoOffsetDate(dateTime.date)) == getFormattedDate(shift.date)) {
      // Checking if the shift times will overlap (converting times to dates to reuse willOverlap())
      if (willOverlap(getDateFromTime(shift.startTime), getDateFromTime(shift.endTime), getDateFromTime(dateTime.startTime), getDateFromTime(dateTime.endTime))) {
        return false;
      }
    }
  }

  for (var i = 0; i < employee.daysUnavailable.length; ++i) {
    day = employee.daysUnavailable[i];

    if (getDayOfWeek(shift.date) == day.dayOfWeek) {
      // Checking if the shift times will overlap (converting times to dates to reuse willOverlap())
      if (willOverlap(getDateFromTime(shift.startTime), getDateFromTime(shift.endTime), getDateFromTime(day.startTime), getDateFromTime(day.endTime))) {
        return false;
      }
    }
  }

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
        position: shift.position
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
          position: shift.position
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
// OUTPUT: Changed javascript date
function changeDate(numDays, today) {
  return new Date(today.getTime() + numDays * 24 * 60 * 60 * 1000)
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
      '<table class="table table-bordered" id="week' + i + '">' +
      '<thead class="thead-light">' +
      '<tr>' +
      '<th scope="col">Employee</th>' +
      '<th id="monday" scope="col">' +
      'Mon, ' + getFormattedDate(changeDate(i * 7 + 0, currDate), "MMM D") +
      '</th>' +
      '<th id="tuesday" scope="col">' +
      'Tue, ' + getFormattedDate(changeDate(i * 7 + 1, currDate), "MMM D") +
      '</th>' +
      '<th id="wednesday" scope="col">' +
      'Wed, ' + getFormattedDate(changeDate(i * 7 + 2, currDate), "MMM D") +
      '</th>' +
      '<th id="thursday" scope="col">' +
      'Thu, ' + getFormattedDate(changeDate(i * 7 + 3, currDate), "MMM D") +
      '</th>' +
      '<th id="friday" scope="col">' +
      'Fri, ' + getFormattedDate(changeDate(i * 7 + 4, currDate), "MMM D") +
      '</th>' +
      '<th id="saturday" scope="col">' +
      'Sat, ' + getFormattedDate(changeDate(i * 7 + 5, currDate), "MMM D") +
      '</th>' +
      '<th id="sunday" scope="col">' +
      'Sun, ' + getFormattedDate(changeDate(i * 7 + 6, currDate), "MMM D") +
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
      var hoursWorkedId = employee.firstName + employee.lastName + weekNumBody + "HoursWorked";

      $("#week" + i + "Body").append('<tr>' + '<th>' + name + '<br/> <small class="text-muted"><span id="' + hoursWorkedId + '">0</span>/' + employee.maxHoursPerWeek + ' hrs/week</small></th>');

      // looping through and just adding information for individual employees
      for (var j = 0; j < 7; ++j) {


        contentId = employee.firstName + employee.lastName + getFormattedDate(changeDate(i * 7 + j, currDate), "MMMD");

        $("#week" + i + "Body tr:last").append(
          '<td class="notFilled">' +
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
        //currDate = changeDate(1, currDate);
      }


      $("#week" + i + "Body").append('</tr>');
      //currDate = changeDate(-7, currDate); // getting start of week for next employee
    });

    // Adding days to get the next week
    //currDate = changeDate(7, currDate);
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

  $("#createSchedule").on("click", (e) => {
    ipcRenderer.send("showLoadingMessage");


    // Clearing table section 
    $(".table-responsive").remove();


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
    var numResponses = 0;

    // loop through each week
    for (var i = 0; i < weekDiff; ++i) {


      // get shift requirements for each day of the week (formatted from above) (NEED TO FIX, GIVING ALL THE SAME DATE)
      weekShifts = formatWeekShifts(shiftsCopy, changeDate(i * 7, startDateOfWeek), daysOfWeek);

      // create list of employees (each week, in order to keep track of hours worked)
      // var employeeList = formatEmployees(employeesCopy);
      console.log(weekShifts);
      console.log(employeesCopy);

      axios
        .post('https://msn7yd57nh.execute-api.us-east-2.amazonaws.com/default/getOptimalShifts', {
          weekShifts: weekShifts,
          employees: employeesCopy
        })
        .then(res => {
          numResponses++;

          optimalWeekShifts = res.data;

          daysOfWeek.forEach(day => {
            optimalWeekShifts[day].forEach(shift => {
              shift.date = new Date(shift.date)
            })
          })

          allocateWeekShifts(optimalWeekShifts, daysOfWeek);

          calcHoursWorkedInWeek(weekDiff, startDateOfWeek);

          if (numResponses == weekDiff) {
            ipcRenderer.send("doneLoading");
            alertMissingShifts(optimalWeekShifts, weekShifts, daysOfWeek);
          }

        })
        .catch(error => {

          alert("There was a server error while creating your schedule, please try again")
          console.error(error)
        })



      // optimalWeekShifts = optimalWeekShiftCombo(weekShifts, employeesCopy, daysOfWeek);

      //allocateWeekShifts(optimalWeekShifts, daysOfWeek);

      //alertMissingShifts(optimalWeekShifts, weekShifts, daysOfWeek);

      // // REPLACE BELOW WITH IMPROVED ALGORITHM
      // // loop through each day of week and then loop through shift requirements(dont forget special shift requirements)
      // daysOfWeek.forEach((day) => {
      //   weekShifts[day].forEach((shift) => {

      //     if ((shift.date >= getNoOffsetDate(startDate)) && (shift.date <= getNoOffsetDate(endDate))) {
      //       // Removing people from employee list if they dont work for shift
      //       pool = checkPool(shift, employeeList);

      //       // Allocating shifts
      //       employeeList = allocateShift(shift, pool, employeeList, daysOfWeek);

      //       // reset scores
      //       for (var i = 0; i < employeeList.length; ++i) {
      //         employeeList[i].score = 0;
      //       }

      //     };

      //   })

      //   // Resetting number of shifts worked that day
      //   for (var i = 0; i < employeeList.length; ++i) {
      //     employeeList[i].shiftsToday = 0;
      //   }
      // });
    }


    // calcHoursWorkedInWeek(weekDiff, startDateOfWeek);

    $(document).on('change', '.endTime', function () {
      calcHoursWorkedInWeek(weekDiff, startDateOfWeek)
    });

    $(document).on('change', '.startTime', function () {
      calcHoursWorkedInWeek(weekDiff, startDateOfWeek)
    });
  });

  // =======================
  // SAVING SCHEDULE TO DATABASE
  // =======================

  $("#saveSchedule").on("click", e => {
    // Put form data into data structure
    var schedule = {
      startDate: $(".scheduleStart").val(),
      endDate: $(".scheduleEnd").val()
    };

    for (var i = 0; i <= getDaysDiff(schedule.startDate, schedule.endDate); ++i) {
      date = changeDate(i, getNoOffsetDate(schedule.startDate))
      schedule[getFormattedDate(date)] = getShiftsOnDate(date);
    }

    // Send data structure to main process
    ipcRenderer.send("updateSchedule", schedule);
  });



  // Handling response
  ipcRenderer.on("updateScheduleReply", (e, msg) => {
    alert(msg);
  });



  // ==========================
  // LOADING SCHEDULE FROM DATABASE
  // ==========================
  ipcRenderer.send("getScheduleRequest");

  ipcRenderer.on("getScheduleResponse", (e, schedule) => {
    $(".scheduleStart").val(schedule.startDate);
    $(".scheduleEnd").val(schedule.endDate);

    // find number of weeks needed to display
    weekDiff = getWeekDiff(schedule.startDate, schedule.endDate);

    // getting the first day of the week
    // startDateOfWeek = getMonday(formatDate(startDate));
    startDateOfWeek = getMonday(getNoOffsetDate(schedule.startDate));

    // Creating new table
    createTable(weekDiff, startDateOfWeek, daysOfWeek);

    // Allocating all the shifts
    for (var i = 0; i < getDaysDiff(schedule.startDate, schedule.endDate); ++i) {
      date = changeDate(i, getNoOffsetDate(schedule.startDate))

      schedule[getFormattedDate(date)].forEach(shift => {
        giveShift(shift.employee, { date: date, startTime: shift.startTime, endTime: shift.endTime, position: shift.position });
      })
    }

    calcHoursWorkedInWeek(weekDiff, startDateOfWeek);

    // Recalculating hours worked in the week whenever time input changes
    $(document).on('change', '.endTime', function () {
      calcHoursWorkedInWeek(weekDiff, startDateOfWeek)
    });

    $(document).on('change', '.startTime', function () {
      calcHoursWorkedInWeek(weekDiff, startDateOfWeek)
    });
  })

  // Allowing for addition of shifts not generated in the schedule
  $(document).on('mouseenter', 'td.notFilled', function (event) {
    $(this).addClass("cellHover")
    $(this).prepend('<button type="button" class="tdAddShift btn btn-outline-secondary">Add Shift</button>')

    $(".tdAddShift").on("click", (e) => {
      $(this).removeClass("cellHover")
      $(this).removeClass("notFilled");
      $(this).children(".tdAddShift").remove();

      // showing the form if they were selected for shift
      $(this).children(".startTime").show();
      $(this).children(".endTime").show();
      $(this).children(".form-group").children(".form-control").show();
    })

  }).on('mouseleave', 'td.notFilled', function () {
    $(this).removeClass("cellHover")
    $(this).children(".tdAddShift").remove();
  });

});

