// Allows for employees to be retrieved from database and loaded into page
// v2 Additions: 
// 1: Add confirmation of deletion and logic associated with it 

// Importing ipcRenderer to allow for communication with main process
const { ipcRenderer } = require("electron");

// Allows jQuery to work
// /* global $ */

// Helper function for returning a string form of the employees' skills
function getStringOfSkills(skillsList) {
  str = "";

  skillsList.forEach(skill => {
    str += skill;
    str += ", ";
  });

  return str.slice(0, str.length - 2);
}

$(document).ready(() => {
  // Sending request for list of employees
  ipcRenderer.send("employeeList");

  // Receiving list of employees and displaying them to screen
  ipcRenderer.on("employeeListReply", (e, employees) => {
    employees.forEach(employee => {
      $("#employeeList").append(
        '<div class="col-md-4 mb-4">' +
          '<div class="card border-0 shadow">' +
          '<div class="card-body text-center">' +
          '<h2 class="card-title mb-0">' +
          employee.firstName +
          " " +
          employee.lastName +
          "</h2><hr>" +
          '<div class="card-text text-black-50"><b>Minimum Hours Per Week:</b> ' +
          employee.minHoursPerWeek +
          "</div>" +
          '<div class="card-text text-black-50"><b>Maximum Hours Per Week:</b> ' +
          employee.maxHoursPerWeek +
          "</div>" +
          '<div class="card-text text-black-50"><b>Primary Skills:</b> ' +
          getStringOfSkills(employee.primarySkills) +
          "</div>" +
          '<div class="card-text text-black-50"><b>Secondary Skills:</b> ' +
          getStringOfSkills(employee.secondarySkills) +
          "</div>" +
          "<div>" +
          "<a id=" +
          employee._id +
          ' class="showEmployee btn btn-warning mt-3 mb-1 text-white ">Show Details/Update</a>' +
          "<a id=" +
          employee._id +
          ' class="btn btn-danger text-white deleteEmployee">Delete Employee</a>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
      );
    });
  });

  $(document).on("click", "a.showEmployee", e => {
    // Getting the id of the employee
    var id = e.target.id;

    // Sending id to main process
    ipcRenderer.send("showEmployeeRequest", id);
  });

  $(document).on("click", "a.deleteEmployee", e => {
    // Getting the id of the employee
    var id = e.target.id;

    // Sending id to main process
    ipcRenderer.send("deleteEmployeeRequest", id);
  });
});
