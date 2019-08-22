// Modules
const { app, BrowserWindow, ipcMain } = require("electron");
var Datastore = require("nedb");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Initializing employee datastore (employee collection)
var employeeDB = new Datastore({
  filename: app.getPath("userData") + "/employees.db",
  autoload: true
});

// employeeDB.remove({}, { multi: true }, (err, employees) => {});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: { nodeIntegration: true }
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("./views/home.html");

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on("ready", createWindow);

// Listens for new employee from renderer process
ipcMain.on("newEmployee", (e, newEmployee) => {
  employeeDB.insert(newEmployee, function(err, newEmployee) {
    if (err) {
      console.log(err);
    } else {
      console.log("====NEW EMPLOYEE INFO====");
      console.log(newEmployee);
      mainWindow.loadFile("./views/employeeList.html");
    }
  });
});

// Listens for new employee list
ipcMain.on("employeeList", e => {
  employeeDB.find({}, (err, employees) => {
    if (err) {
      console.log(err);
    } else {
      // Replying to renderer process with full list of employees
      e.reply("employeeListReply", employees);
    }
  });
});

// Listens for the showing of a new employee
ipcMain.on("showEmployeeRequest", (e, id) => {
  // Retrieving employee from database
  employeeDB.findOne({ _id: id }, (err, employee) => {
    if (err) {
      console.log("ERROR OCCURRED DURING SHOWING:" + err);
    } else {
      mainWindow.loadFile("./views/show.html");
      mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send("showEmployee", employee);
      });
    }
  });
});

// Listens for an update to an employee
ipcMain.on("updateEmployee", (e, updatedEmployee) => {
  employeeDB.update(
    { _id: updatedEmployee.id },
    updatedEmployee.updatedEmployee,
    {},
    (err, numReplaced) => {
      if (err) {
        console.log("ERROR OCCURRED DURING UPDATING:" + err);
      } else {
        console.log("=====NUM REPLACED:=====");
        console.log(numReplaced);

        console.log("=====UPDATED EMPLOYEE:=====");
        console.log(updatedEmployee.updatedEmployee);

        mainWindow.loadFile("./views/employeeList.html");
      }
    }
  );
});

// Deleting an employee
ipcMain.on("deleteEmployeeRequest", (e, id) => {
  employeeDB.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err) {
      console.log("ERROR DURING DELETION: " + err);
    } else {
      console.log("DELETE SUCCESSFUL");

      // Routing back to the list of employees
      mainWindow.loadFile("./views/employeeList.html");
    }
  });
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
