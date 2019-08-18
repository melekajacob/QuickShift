// Modules
const { app, BrowserWindow, ipcMain } = require("electron");
var Datastore = require("nedb");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

console.log(app.getPath("userData"));

// Initializing employee datastore (employee collection)
var employeeDB = new Datastore({
  filename: app.getPath("userData") + "/employees.db",
  autoload: true
});

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
  mainWindow.webContents.openDevTools();

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
      console.log(newEmployee);
    }
  });
});

// Listens for new employee list 
ipcMain.on("employeeList", (e) => {
  employeeDB.find({}, (err, employees) => {
    if(err) {
      console.log(err)
    }
    else {
      // Replying to renderer process with full list of employees
      e.reply("employeeListReply", employees)
    }
    
  })
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
