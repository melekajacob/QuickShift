// jQuery event handlers for form functionality
// v2 additions:
// 1: Disabling supplementary inputs to prevent redundent inputs
// 2: Once a skill has been added, that skill will be disabled from list to reduce redundent inputs
// 3: Add remove button for all supplementary inputs
// 4: Setting required fields
// 5: Form requirements and validation

// Importing ipcRenderer to allow for communication with main process
const { ipcRenderer } = require("electron");

// Allows jQuery to work
// /* global $ */

// Functions to allow data to be retrieved from form
const classLibrary = require("../public/javascript/classLibrary.js");
const retrieveList = classLibrary.retrieveList;

const retrieveListFromDays = classLibrary.retrieveListFromDays;

const retrieveListFromProlonged = classLibrary.retrieveListFromProlonged;

$(document).ready(() => {
  // Sets the datepicker on the input
  $(".input-group.date").datepicker({
    todayHighlight: true,
    autoclose: true
  });

  //======================
  // FORM FUNCTIONALITY
  //======================

  //ADDING PRIMARY SKILL
  $("#addPrimarySkill").on("click", e => {
    //Getting the currently selected primary skills
    var primarySkill = $(".primarySkills")
      .first()
      .val();

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

    // Setting selected primary skill to new input
    $(".primarySkills")
      .last()
      .val(primarySkill);

    // Resetting input
    $(".primarySkills")
      .first()
      .val("");
  });

  //ADDING SECONDARY SKILL
  $("#addSecondarySkill").on("click", e => {
    // Getting currently selected secondary skill
    var secondarySkill = $(".secondarySkills")
      .first()
      .val();

    // Appending new secondary skill
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

    // Setting value of new secondary skill
    $(".secondarySkills")
      .last()
      .val(secondarySkill);

    // Resetting secondary skill input
    $(".secondarySkills")
      .first()
      .val("");
  });

  //ADDING DAY UNAVAILABLE
  $("#addDayUnavailability").on("click", e => {
    // Getting currently selected day, and times
    var dayUnavailable = $(".dayUnavailable")
      .first()
      .val();
    var startTime = $(".dayUnavailabilityStart")
      .first()
      .val();
    var endTime = $(".dayUnavailabilityEnd")
      .first()
      .val();

    // Appending new day unavailability
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
      .val(dayUnavailable);
    $(".dayUnavailabilityStart")
      .last()
      .val(startTime);
    $(".dayUnavailabilityEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".dayUnavailable")
      .first()
      .val("");
    $(".dayUnavailabilityStart")
      .first()
      .val("");
    $(".dayUnavailabilityEnd")
      .first()
      .val("");
  });

  //ADDING DATE UNAVAILABLE
  $("#addDateUnavailability").on("click", e => {
    //Getting selected date unavailable
    var dateUnavailable = $(".dateUnavailable")
      .first()
      .val();

    // Appending new date (the datepicker doesn't work, its okay b/c version 2 will disable added inputs)
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
      .val(dateUnavailable);

    $(".dateUnavailable")
      .first()
      .val("");
  });

  //ADDING PROLONGED UNAVAILABILITY
  $("#addProlongedUnavailability").on("click", e => {
    // Getting selected times of unavailability
    var startTime = $(".prolongedUnavailabilityStart")
      .first()
      .val();
    var endTime = $(".prolongedUnavailabilityEnd")
      .first()
      .val();

    // Appending new prolonged unavailability
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
      .val(startTime);
    $(".prolongedUnavailabilityEnd")
      .last()
      .val(endTime);

    // Resetting Input
    $(".prolongedUnavailabilityStart")
      .first()
      .val("");
    $(".prolongedUnavailabilityEnd")
      .first()
      .val("");
  });

  //ADDING PREFERRED SHIFTS
  $("#addPreferredShift").on("click", e => {
    //Getting selected preferred shift day and times
    var preferredShift = $(".preferredShift")
      .first()
      .val();
    var startTime = $(".preferredShiftStart")
      .first()
      .val();
    var endTime = $(".preferredShiftEnd")
      .first()
      .val();

    // Appending new preferred shift
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
      .val(preferredShift);
    $(".preferredShiftStart")
      .last()
      .val(startTime);
    $(".preferredShiftEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".preferredShift")
      .first()
      .val("");
    $(".preferredShiftStart")
      .first()
      .val("");
    $(".preferredShiftEnd")
      .first()
      .val("");
  });

  // =================================
  // CREATING NEW EMPLOYEE
  // =================================
  $("#addEmployee").on("click", e => {
    // Retrieving form data
    var newEmployee = {
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      minHoursPerWeek: $("#minHoursPerWeek").val(),
      maxHoursPerWeek: $("#maxHoursPerWeek").val(),
      primarySkills: retrieveList("primarySkills"),
      secondarySkills: retrieveList("secondarySkills"),
      daysUnavailable: retrieveListFromDays(
        "dayUnavailable",
        "dayUnavailabilityStart",
        "dayUnavailabilityEnd"
      ),
      datesUnavailable: retrieveList("dateUnavailable"),
      prolongedUnavailability: retrieveListFromProlonged(
        "prolongedUnavailabilityStart",
        "prolongedUnavailabilityEnd"
      ),
      preferredShifts: retrieveListFromDays(
        "preferredShift",
        "preferredShiftStart",
        "preferredShiftEnd"
      )
    };

    // Sending data to main process to be stored
    ipcRenderer.send("newEmployee", newEmployee);

    // Receiving response and showing success message
  });
});
