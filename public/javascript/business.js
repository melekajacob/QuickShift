// Importing ipcRenderer to allow for communication with main process
const { ipcRenderer } = require("electron");

// Allows jQuery to work
// /* global $ */

const classLibrary = require("../public/javascript/classLibrary.js");
const retrieveList = classLibrary.retrieveList;
const getOpeningHours = classLibrary.getOpeningHours;

$(document).ready(() => {
  // ==============================
  // Handling new business skill
  // ==============================
  $("#addBusinessSkill").on("click", e => {
    //Getting the inputted business skill
    var businessSkill = $(".businessSkill")
      .first()
      .val();

    $("#businessSkillsSection").append(
      '<div class="form-row">' +
        '<div class="form-group col-md-10">' +
        '<input type="text" class="form-control businessSkill">' +
        "</div>" +
        '<div class="form-group col-md-2">' +
        "<button" +
        ' class="btn btn-danger removeBusinessSkill"' +
        ' type="button"' +
        ">" +
        "Remove Skill" +
        "</button>" +
        "</div>" +
        "</div>"
    );

    // Setting inputted business skill to new input
    $(".businessSkill")
      .last()
      .val(businessSkill);

    // Resetting input
    $(".businessSkill")
      .first()
      .val("");
  });

  // ==============================
  // Removing Skills
  // ==============================
  $(document).on("click", "button.removeBusinessSkill", e => {
    // Getting the form row using parentNode twice!!
    e.target.parentNode.parentNode.remove();
  });

  // ==============================
  // Handling Saved Changes (sending to main process)
  // ==============================
  $("#saveBusinessInfo").on("click", e => {
    var businessInfo = {
      monday: getOpeningHours("monday"),
      tuesday: getOpeningHours("tuesday"),
      wednesday: getOpeningHours("wednesday"),
      thursday: getOpeningHours("thursday"),
      friday: getOpeningHours("friday"),
      saturday: getOpeningHours("saturday"),
      sunday: getOpeningHours("sunday"),
      skills: retrieveList("businessSkill")
    };

    ipcRenderer.send("updateBusinessInfo", businessInfo);
  });

  // ==============================
  // Handling Response
  // ==============================
  ipcRenderer.on("updateBusinessInfoResponse", (e, msg) => {
    alert(msg);
  });

   // ==============================
  // Checking if any existing business information and insert
  // ==============================
});
