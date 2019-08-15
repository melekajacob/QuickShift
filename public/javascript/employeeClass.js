function Employee(
  firstName,
  lastName,
  primarySkills,
  secondarySkills,
  dayUnavailability,
  dateUnavailability,
  prolongedUnavailability,
  preferredShifts
) {
  this.firstName = firstName;
  this.lastName = lastName;

  this.primarySkills = primarySkills; // list of primary skills
  this.secondarySkills = secondarySkills;

  this.dayUnavailability = dayUnavailability;
  this.dateUnavailability = dateUnavailability;
  this.prolongedUnavailability = prolongedUnavailability;

  this.preferredShifts = preferredShifts;

  this.getAttributeObject = () => {
    // Returns the attributes of employee as an object
  };

  this.addToDatabase = () => {
    // creating object with employee data
    // sending using ipcRenderer (over new employee channel)
    // Return success message
  };

  this.updateInDatabase = () => {
    // creating object with employee data
    // sending using ipcRenderer (over updated employee channel)
    // Return success message
  };

  this.deleteFromDatabase = () => {
    // send name to main process using ipcRenderer (over delete employee channel)
    // Return success message
  };
}

module.exports = Employee;
