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

$(document).ready(() => {
  // Sets the datepicker on the input
  $(".input-group.date").datepicker({
    todayHighlight: true,
    autoclose: true
  });

  $("#addMondayShift").on("click", e => {
    //Getting the required skill and start and end times
    var requiredSkill = $(".mondayRequiredSkill")
      .first()
      .val();
    var startTime = $(".mondayShiftStart")
      .first()
      .val();
    var endTime = $(".mondayShiftEnd")
      .first()
      .val();

    // Appending new required skill
    $("#mondayShiftSection").append(
      '<div class="form-row px-0 mx-0">' +
        '<div class="form-group col-md-12 px-0 mx-0">' +
        '<select class="form-control mondayRequiredSkill px-0 mx-0">' +
        '<option selected disable hidden value="">Required Skill</option>' +
        '<option value="Prescription Processing"' +
        ">Prescription Processing</option" +
        ">" +
        '<option value="Medication Counting">Medication Counting</option>' +
        '<option value="Cashier">Cashier</option>' +
        "</select>" +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="mondayShiftStart">Start Time</label>' +
        '<input type="time" class="form-control mondayShiftStart" />' +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="mondayShiftEnd">End Time</label>' +
        '<input type="time" class="form-control mondayShiftEnd" />' +
        "</div>" +
        '<div class="form-group col-md-12 text-center">' +
        '<button class="btn btn-danger removeShift">' +
        "Remove Shift" +
        "</button>" +
        "</div>" +
        "</div>" +
        "<hr />" +
        "</div>"
    );

    // Setting selected required shift
    $(".mondayRequiredSkill")
      .last()
      .val(requiredSkill);
    $(".mondayShiftStart")
      .last()
      .val(startTime);
    $(".mondayShiftEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".mondayRequiredSkill")
      .first()
      .val("");
    $(".mondayShiftStart")
      .first()
      .val("");
    $(".mondayShiftEnd")
      .first()
      .val("");
  });

  $("#addTuesdayShift").on("click", e => {
    //Getting the required skill and start and end times
    var requiredSkill = $(".tuesdayRequiredSkill")
      .first()
      .val();
    var startTime = $(".tuesdayShiftStart")
      .first()
      .val();
    var endTime = $(".tuesdayShiftEnd")
      .first()
      .val();

    // Appending new required skill
    $("#tuesdayShiftSection").append(
      '<div class="form-row px-0 mx-0">' +
        '<div class="form-group col-md-12 px-0 mx-0">' +
        '<select class="form-control tuesdayRequiredSkill px-0 mx-0">' +
        '<option selected disable hidden value="">Required Skill</option>' +
        '<option value="Prescription Processing"' +
        ">Prescription Processing</option" +
        ">" +
        '<option value="Medication Counting">Medication Counting</option>' +
        '<option value="Cashier">Cashier</option>' +
        "</select>" +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="tuesdayShiftStart">Start Time</label>' +
        '<input type="time" class="form-control tuesdayShiftStart" />' +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="tuesdayShiftEnd">End Time</label>' +
        '<input type="time" class="form-control tuesdayShiftEnd" />' +
        "</div>" +
        '<div class="form-group col-md-12 text-center">' +
        '<button class="btn btn-danger removeShift">' +
        "Remove Shift" +
        "</button>" +
        "</div>" +
        "</div>" +
        "<hr />" +
        "</div>"
    );

    // Setting selected required shift
    $(".tuesdayRequiredSkill")
      .last()
      .val(requiredSkill);
    $(".tuesdayShiftStart")
      .last()
      .val(startTime);
    $(".tuesdayShiftEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".tuesdayRequiredSkill")
      .first()
      .val("");
    $(".tuesdayShiftStart")
      .first()
      .val("");
    $(".tuesdayShiftEnd")
      .first()
      .val("");
  });

  $("#addWednesdayShift").on("click", e => {
    //Getting the required skill and start and end times
    var requiredSkill = $(".wednesdayRequiredSkill")
      .first()
      .val();
    var startTime = $(".wednesdayShiftStart")
      .first()
      .val();
    var endTime = $(".wednesdayShiftEnd")
      .first()
      .val();

    // Appending new required skill
    $("#wednesdayShiftSection").append(
      '<div class="form-row px-0 mx-0">' +
        '<div class="form-group col-md-12 px-0 mx-0">' +
        '<select class="form-control wednesdayRequiredSkill px-0 mx-0">' +
        '<option selected disable hidden value="">Required Skill</option>' +
        '<option value="Prescription Processing"' +
        ">Prescription Processing</option" +
        ">" +
        '<option value="Medication Counting">Medication Counting</option>' +
        '<option value="Cashier">Cashier</option>' +
        "</select>" +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="wednesdayShiftStart">Start Time</label>' +
        '<input type="time" class="form-control wednesdayShiftStart" />' +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="wednesdayShiftEnd">End Time</label>' +
        '<input type="time" class="form-control wednesdayShiftEnd" />' +
        "</div>" +
        '<div class="form-group col-md-12 text-center">' +
        '<button class="btn btn-danger removeShift">' +
        "Remove Shift" +
        "</button>" +
        "</div>" +
        "</div>" +
        "<hr />" +
        "</div>"
    );

    // Setting selected required shift
    $(".wednesdayRequiredSkill")
      .last()
      .val(requiredSkill);
    $(".wednesdayShiftStart")
      .last()
      .val(startTime);
    $(".wednesdayShiftEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".wednesdayRequiredSkill")
      .first()
      .val("");
    $(".wednesdayShiftStart")
      .first()
      .val("");
    $(".wednesdayShiftEnd")
      .first()
      .val("");
  });

  $("#addThursdayShift").on("click", e => {
    //Getting the required skill and start and end times
    var requiredSkill = $(".thursdayRequiredSkill")
      .first()
      .val();
    var startTime = $(".thursdayShiftStart")
      .first()
      .val();
    var endTime = $(".thursdayShiftEnd")
      .first()
      .val();

    // Appending new required skill
    $("#thursdayShiftSection").append(
      '<div class="form-row px-0 mx-0">' +
        '<div class="form-group col-md-12 px-0 mx-0">' +
        '<select class="form-control thursdayRequiredSkill px-0 mx-0">' +
        '<option selected disable hidden value="">Required Skill</option>' +
        '<option value="Prescription Processing"' +
        ">Prescription Processing</option" +
        ">" +
        '<option value="Medication Counting">Medication Counting</option>' +
        '<option value="Cashier">Cashier</option>' +
        "</select>" +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="thursdayShiftStart">Start Time</label>' +
        '<input type="time" class="form-control thursdayShiftStart" />' +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="thursdayShiftEnd">End Time</label>' +
        '<input type="time" class="form-control thursdayShiftEnd" />' +
        "</div>" +
        '<div class="form-group col-md-12 text-center">' +
        '<button class="btn btn-danger removeShift">' +
        "Remove Shift" +
        "</button>" +
        "</div>" +
        "</div>" +
        "<hr />" +
        "</div>"
    );

    // Setting selected required shift
    $(".thursdayRequiredSkill")
      .last()
      .val(requiredSkill);
    $(".thursdayShiftStart")
      .last()
      .val(startTime);
    $(".thursdayShiftEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".thursdayRequiredSkill")
      .first()
      .val("");
    $(".thursdayShiftStart")
      .first()
      .val("");
    $(".thursdayShiftEnd")
      .first()
      .val("");
  });

  $("#addFridayShift").on("click", e => {
    //Getting the required skill and start and end times
    var requiredSkill = $(".fridayRequiredSkill")
      .first()
      .val();
    var startTime = $(".fridayShiftStart")
      .first()
      .val();
    var endTime = $(".fridayShiftEnd")
      .first()
      .val();

    // Appending new required skill
    $("#fridayShiftSection").append(
      '<div class="form-row px-0 mx-0">' +
        '<div class="form-group col-md-12 px-0 mx-0">' +
        '<select class="form-control fridayRequiredSkill px-0 mx-0">' +
        '<option selected disable hidden value="">Required Skill</option>' +
        '<option value="Prescription Processing"' +
        ">Prescription Processing</option" +
        ">" +
        '<option value="Medication Counting">Medication Counting</option>' +
        '<option value="Cashier">Cashier</option>' +
        "</select>" +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="fridayShiftStart">Start Time</label>' +
        '<input type="time" class="form-control fridayShiftStart" />' +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="fridayShiftEnd">End Time</label>' +
        '<input type="time" class="form-control fridayShiftEnd" />' +
        "</div>" +
        '<div class="form-group col-md-12 text-center">' +
        '<button class="btn btn-danger removeShift">' +
        "Remove Shift" +
        "</button>" +
        "</div>" +
        "</div>" +
        "<hr />" +
        "</div>"
    );

    // Setting selected required shift
    $(".fridayRequiredSkill")
      .last()
      .val(requiredSkill);
    $(".fridayShiftStart")
      .last()
      .val(startTime);
    $(".fridayShiftEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".fridayRequiredSkill")
      .first()
      .val("");
    $(".fridayShiftStart")
      .first()
      .val("");
    $(".fridayShiftEnd")
      .first()
      .val("");
  });

  $("#addSaturdayShift").on("click", e => {
    //Getting the required skill and start and end times
    var requiredSkill = $(".saturdayRequiredSkill")
      .first()
      .val();
    var startTime = $(".saturdayShiftStart")
      .first()
      .val();
    var endTime = $(".saturdayShiftEnd")
      .first()
      .val();

    // Appending new required skill
    $("#saturdayShiftSection").append(
      '<div class="form-row px-0 mx-0">' +
        '<div class="form-group col-md-12 px-0 mx-0">' +
        '<select class="form-control saturdayRequiredSkill px-0 mx-0">' +
        '<option selected disable hidden value="">Required Skill</option>' +
        '<option value="Prescription Processing"' +
        ">Prescription Processing</option" +
        ">" +
        '<option value="Medication Counting">Medication Counting</option>' +
        '<option value="Cashier">Cashier</option>' +
        "</select>" +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="saturdayShiftStart">Start Time</label>' +
        '<input type="time" class="form-control saturdayShiftStart" />' +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="saturdayShiftEnd">End Time</label>' +
        '<input type="time" class="form-control saturdayShiftEnd" />' +
        "</div>" +
        '<div class="form-group col-md-12 text-center">' +
        '<button class="btn btn-danger removeShift">' +
        "Remove Shift" +
        "</button>" +
        "</div>" +
        "</div>" +
        "<hr />" +
        "</div>"
    );

    // Setting selected required shift
    $(".saturdayRequiredSkill")
      .last()
      .val(requiredSkill);
    $(".saturdayShiftStart")
      .last()
      .val(startTime);
    $(".saturdayShiftEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".saturdayRequiredSkill")
      .first()
      .val("");
    $(".saturdayShiftStart")
      .first()
      .val("");
    $(".saturdayShiftEnd")
      .first()
      .val("");
  });

  $("#addSundayShift").on("click", e => {
    //Getting the required skill and start and end times
    var requiredSkill = $(".sundayRequiredSkill")
      .first()
      .val();
    var startTime = $(".sundayShiftStart")
      .first()
      .val();
    var endTime = $(".sundayShiftEnd")
      .first()
      .val();

    // Appending new required skill
    $("#sundayShiftSection").append(
      '<div class="form-row px-0 mx-0">' +
        '<div class="form-group col-md-12 px-0 mx-0">' +
        '<select class="form-control sundayRequiredSkill px-0 mx-0">' +
        '<option selected disable hidden value="">Required Skill</option>' +
        '<option value="Prescription Processing"' +
        ">Prescription Processing</option" +
        ">" +
        '<option value="Medication Counting">Medication Counting</option>' +
        '<option value="Cashier">Cashier</option>' +
        "</select>" +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="sundayShiftStart">Start Time</label>' +
        '<input type="time" class="form-control sundayShiftStart" />' +
        "</div>" +
        '<div class="form-group col-md-12">' +
        '<label for="sundayShiftEnd">End Time</label>' +
        '<input type="time" class="form-control sundayShiftEnd" />' +
        "</div>" +
        '<div class="form-group col-md-12 text-center">' +
        '<button class="btn btn-danger removeShift">' +
        "Remove Shift" +
        "</button>" +
        "</div>" +
        "</div>" +
        "<hr />" +
        "</div>"
    );

    // Setting selected required shift
    $(".sundayRequiredSkill")
      .last()
      .val(requiredSkill);
    $(".sundayShiftStart")
      .last()
      .val(startTime);
    $(".sundayShiftEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".sundayRequiredSkill")
      .first()
      .val("");
    $(".sundayShiftStart")
      .first()
      .val("");
    $(".sundayShiftEnd")
      .first()
      .val("");
  });

  // Add special shift
  $("#addSpecialShift").on("click", e => {
    //Getting the required skill and start and end times
    var specialShiftDate = $(".specialShiftDate")
      .first()
      .val();

    var requiredSkill = $(".specialShiftRequiredSkill")
      .first()
      .val();
    var startTime = $(".specialShiftStart")
      .first()
      .val();
    var endTime = $(".specialShiftEnd")
      .first()
      .val();

    // Appending new required skill
    $("#specialShiftSection").append(
      '<div class="form-row">' +
        '<div class="form-group col-md-4">' +
        '<div class="input-group date">' +
        "<input" +
        ' type="text"' +
        ' class="form-control dateInput specialShiftDate"' +
        ' aria-describedby="calenderIcon"' +
        "/>" +
        '<div class="input-group-append">' +
        '<span class="input-group-text" id="calenderIcon"' +
        '><i class="fas fa-calendar-alt"></i' +
        "></span>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="form-group col-md-3">' +
        '<select class="form-control specialShiftRequiredSkill">' +
        '<option selected disable hidden value="">Required Skill</option>' +
        '<option value="Prescription Processing"' +
        ">Prescription Processing</option" +
        ">" +
        '<option value="Medication Counting">Medication Counting</option>' +
        '<option value="Cashier">Cashier</option>' +
        "</select>" +
        "</div>" +
        '<div class="form-group col-md-2">' +
        '<input type="time" class="form-control specialShiftStart" />' +
        "</div>" +
        '<div class="form-group col-md-2">' +
        '<input type="time" class="form-control specialShiftEnd" />' +
        "</div>" +
        '<div class="form-group col-md-1">' +
        '<button class="btn btn-danger removeSpecialShift">' +
        "Remove Shift" +
        "</button>" +
        "</div>" +
        "</div>"
    );

    // Setting selected special shift
    $(".specialShiftDate")
      .last()
      .val(specialShiftDate);
    $(".specialShiftRequiredSkill")
      .last()
      .val(requiredSkill);
    $(".specialShiftStart")
      .last()
      .val(startTime);
    $(".specialShiftEnd")
      .last()
      .val(endTime);

    // Resetting inputs
    $(".specialShiftDate")
      .first()
      .val("");
    $(".specialShiftRequiredSkill")
      .first()
      .val("");
    $(".specialShiftStart")
      .first()
      .val("");
    $(".specialShiftEnd")
      .first()
      .val("");
  });

  // Allowing functionality of removing a special shift
  $(document).on("click", "button.removeSpecialShift", e => {
    // Getting the form row using parentNode twice!!
    e.target.parentNode.parentNode.remove();
  });

  $(document).on("click", "button.removeShift", e => {
    var id = e.target.parentNode.parentNode.parentNode.id;

    // Must remove last horizontal line (was having problems including <hr> into parent div)
    $("#" + id + " hr")
      .last()
      .remove();

    // Getting the form row using parentNode twice!!
    e.target.parentNode.parentNode.remove();
  });

  // ===================
  // SAVING SHIFTS TO DATABASE
  // ===================
  $("#saveShifts").on("click", e => {
    // Put form data into data structure
    var shifts = {
      monday: retrieveListFromShifts("monday"),
      tuesday: retrieveListFromShifts("tuesday"),
      wednesday: retrieveListFromShifts("wednesday"),
      thursday: retrieveListFromShifts("thursday"),
      friday: retrieveListFromShifts("friday"),
      saturday: retrieveListFromShifts("saturday"),
      sunday: retrieveListFromShifts("sunday"),
      specialShifts: retrieveListFromSpecialShifts()
    };

    //console.log(shifts);

    // Send data structure to main process
    ipcRenderer.send("updateShifts", shifts);
  });

  // Handling response
  ipcRenderer.on("updateShiftsReply", (e, msg) => {
    alert(msg);
  });

  // ========================
  // CHECKING FOR EXISTING SHIFT AND INPUTTING IT
  // ========================
  // Send a request to get a shift if it exists
  ipcRenderer.send("getShiftRequest");

  // Accept the response
  ipcRenderer.on("getShiftResponse", (e, shifts) => {
    // Adding special shifts
    shifts.specialShifts.forEach(shift => {
      // Setting values
      $(".specialShiftDate")
        .first()
        .val(shift.date);
      $(".specialShiftRequiredSkill")
        .first()
        .val(shift.requiredSkill);
      $(".specialShiftStart")
        .first()
        .val(shift.startTime);
      $(".specialShiftEnd")
        .first()
        .val(shift.endTime);

      // Setting off click event for that the day
      $("#addSpecialShift").click();
    });

    // Removing id and shifts from keys because they aren't needed right now
    var keys = Object.keys(shifts);
    var keys = keys.filter(function(value, index, arr) {
      return value != "_id" && value != "specialShifts";
    });

    // Looping through each day and inputting into form
    keys.forEach(dayOfWeek => {
      shifts[dayOfWeek].forEach(shift => {
        // Setting values
        $("." + dayOfWeek + "RequiredSkill")
          .first()
          .val(shift.requiredSkill);
        $("." + dayOfWeek + "ShiftStart")
          .first()
          .val(shift.startTime);
        $("." + dayOfWeek + "ShiftEnd")
          .first()
          .val(shift.endTime);

        // Setting off click event for that the day
        $("#add" + capitalize(dayOfWeek) + "Shift").click();
      });
    });
  });
});
