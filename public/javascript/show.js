const { ipcRenderer } = require("electron");

// Allows jQuery to work
// /* global $ */

// Functions to allow data to be retrieved from form
const retrieveList = require("../public/javascript/classLibrary.js")
  .retrieveList;

const retrieveListFromDays = require("../public/javascript/classLibrary.js")
  .retrieveListFromDays;

const retrieveListFromProlonged = require("../public/javascript/classLibrary.js")
  .retrieveListFromProlonged;

ipcRenderer.once("showEmployee", (e, employee) => {
  // Setting Name of employee
  $(".card-header.text-white").html(
    "<h2>" + employee.firstName + " " + employee.lastName + "</h2>"
  );

  $("#firstName").val(employee.firstName);
  $("#lastName").val(employee.lastName);

  // Setting min and max hours
  $("#minHoursPerWeek").val(employee.minHoursPerWeek);
  $("#maxHoursPerWeek").val(employee.maxHoursPerWeek);

  // Setting primary skills
  $(".primarySkills").val(employee.primarySkills[0]);

  if (employee.primarySkills.length > 1) {
    for (var i = 1; i < employee.primarySkills.length; i++) {
      $("#primarySkillsSection").append(
        '<div class="form-row">' +
          '<div class="form-group col-md-10">' +
          "<select" +
          ' class="form-control primarySkills"' +
          ">" +
          '<option selected disable hidden value=""' +
          ">Select Primary Skills</option" +
          ">" +
          '<option value="Prescription Processing"' +
          ">Prescription Processing</option" +
          ">" +
          '<option value="Medication Counting"' +
          ">Medication Counting</option" +
          ">" +
          '<option value="Cashier">Cashier</option>' +
          "</select>" +
          "</div>" +
          "</div>"
      );

      $(".primarySkills")
        .last()
        .val(employee.primarySkills[i]);
    }
  }

  // Setting secondary skills
  $(".secondarySkills").val(employee.secondarySkills[0]);

  // If more than one secondary skills, append
  if (employee.secondarySkills.length > 1) {
    for (var i = 1; i < employee.secondarySkills.length; i++) {
      $("#secondarySkillsSection").append(
        '<div class="form-row">' +
          '<div class="form-group col-md-10">' +
          '<select class="form-control secondarySkills">' +
          '<option selected disable hidden value=""' +
          ">Select Secondary Skills</option" +
          ">" +
          '<option value="Prescription Processing"' +
          ">Prescription Processing</option" +
          ">" +
          '<option value="Medication Counting"' +
          ">Medication Counting</option" +
          ">" +
          '<option value="Cashier">Cashier</option>' +
          "</select>" +
          "</div>" +
          "</div>"
      );

      $(".secondarySkills")
        .last()
        .val(employee.secondarySkills[i]);
    }
  }

  // Setting days unavailable
  $(".dayUnavailable").val(employee.daysUnavailable[0].dayOfWeek);

  $(".dayUnavailabilityStart").val(employee.daysUnavailable[0].startTime);

  $(".dayUnavailabilityEnd").val(employee.daysUnavailable[0].endTime);

  // If more than one secondary skills, append
  if (employee.daysUnavailable.length > 1) {
    for (var i = 1; i < employee.daysUnavailable.length; i++) {
      $("#dayUnavailabilitySection").append(
        '<div class="form-row">' +
          '<div class="form-group col-md-6">' +
          "<select" +
          ' class="form-control dayUnavailable"' +
          ">" +
          '<option selected disable hidden value=""' +
          ">Select Day of the Week</option" +
          ">" +
          '<option value="Monday">Monday</option>' +
          '<option value="Tuesday">Tuesday</option>' +
          '<option value="Wednesday">Wednesday</option>' +
          '<option value="Thursday">Thursday</option>' +
          '<option value="Friday">Friday</option>' +
          '<option value="Saturday">Saturday</option>' +
          '<option value="Sunday">Sunday</option>' +
          "</select>" +
          "</div>" +
          '<div class="form-group col-md-2">' +
          "<input" +
          ' type="time"' +
          ' class="form-control dayUnavailabilityStart"' +
          "/>" +
          "</div>" +
          '<div class="form-group col-md-2">' +
          "<input" +
          ' type="time"' +
          ' class="form-control dayUnavailabilityEnd"' +
          "/>" +
          "</div>" +
          "</div>"
      );

      // Setting value of new day unavailability
      $(".dayUnavailable")
        .last()
        .val(employee.daysUnavailable[i].dayOfWeek);
      $(".dayUnavailabilityStart")
        .last()
        .val(employee.daysUnavailable[i].startTime);
      $(".dayUnavailabilityEnd")
        .last()
        .val(employee.daysUnavailable[i].endTime);
    }
  }

  // Setting dates unavailable
  $(".dateUnavailable").val(employee.datesUnavailable[0]);

  // If more than one secondary skills, append
  if (employee.datesUnavailable > 1) {
    for (var i = 1; i < employee.datesUnavailable.length; i++) {
      $("#dateUnavailableSection").append(
        '<div class="form-row">' +
          '<div class="form-group col-md-10">' +
          '<div class="input-group date">' +
          "<input" +
          ' type="text"' +
          ' class="form-control dateInput dateUnavailable"' +
          ' aria-describedby="calenderIcon"' +
          "/>" +
          '<div class="input-group-append">' +
          '<span class="input-group-text" id="calenderIcon"' +
          '><i class="fas fa-calendar-alt"></i' +
          "></span>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
      );

      $(".dateUnavailable")
        .last()
        .val(employee.datesUnavailable[i]);
    }
  }

  // Setting prolonged unavailability
  $(".prolongedUnavailabilityStart").val(
    employee.prolongedUnavailability[0].startTime
  );

  $(".prolongedUnavailabilityEnd").val(
    employee.prolongedUnavailability[0].endTime
  );

  // If more than one secondary skills, append
  if (employee.prolongedUnavailability > 1) {
    for (var i = 1; i < employee.prolongedUnavailability.length; i++) {
      // Appending new prolonged unavailability if more than 1
      $("#prolongedUnavailabilitySection").append(
        '<div class="form-row">' +
          '<div class="form-group col-md-5">' +
          '<div class="input-group date">' +
          "<input" +
          ' type="text"' +
          ' class="form-control dateInput prolongedUnavailabilityStart"' +
          "/>" +
          '<div class="input-group-append">' +
          '<span class="input-group-text" id="calenderIcon"' +
          '><i class="fas fa-calendar-alt"></i' +
          "></span>" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<div class="form-group col-md-5">' +
          '<div class="input-group date">' +
          "<input" +
          ' type="text"' +
          ' class="form-control dateInput prolongedUnavailabilityEnd"' +
          ' aria-describedby="calenderIcon"' +
          "/>" +
          '<div class="input-group-append">' +
          '<span class="input-group-text" id="calenderIcon"' +
          '><i class="fas fa-calendar-alt"></i' +
          "></span>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
      );

      // Setting selected times
      $(".prolongedUnavailabilityStart")
        .last()
        .val(employee.prolongedUnavailability[i].startTime);
      $(".prolongedUnavailabilityEnd")
        .last()
        .val(employee.prolongedUnavailability[i].endTime);
    }
  }

  // Setting preferred shifts
  $(".preferredShift").val(employee.preferredShifts[0].dayOfWeek);

  $(".preferredShiftStart").val(employee.preferredShifts[0].startTime);

  $(".preferredShiftEnd").val(employee.preferredShifts[0].endTime);

  // If more than one preferred shift, append
  if (employee.preferredShifts.length > 1) {
    for (var i = 1; i < employee.preferredShifts.length; i++) {
      $("#preferredShiftSection").append(
        '<div class="form-row">' +
          '<div class="form-group col-md-6">' +
          '<select class="form-control preferredShift">' +
          '<option selected disable hidden value=""' +
          ">Select Day of the Week</option" +
          ">" +
          '<option value="Monday">Monday</option>' +
          '<option value="Tuesday">Tuesday</option>' +
          '<option value="Wednesday">Wednesday</option>' +
          '<option value="Thursday">Thursday</option>' +
          '<option value="Friday">Friday</option>' +
          '<option value="Saturday">Saturday</option>' +
          '<option value="Sunday">Sunday</option>' +
          "</select>" +
          "</div>" +
          '<div class="form-group col-md-2">' +
          '<input type="time" class="form-control preferredShiftStart" />' +
          "</div>" +
          '<div class="form-group col-md-2">' +
          '<input type="time" class="form-control preferredShiftEnd" />' +
          "</div>" +
          "</div>"
      );

      // Setting selected preferred shift and time
      $(".preferredShift")
        .last()
        .val(employee.preferredShifts[i].dayOfWeek);
      $(".preferredShiftStart")
        .last()
        .val(employee.preferredShifts[i].startTime);
      $(".preferredShiftEnd")
        .last()
        .val(employee.preferredShifts[i].endTime);
    }
  }
});

$("updateEmployee").on("click", e => {
  // Get data from form
  // Send data to main process
});
