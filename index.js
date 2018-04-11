const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  mainWindow.on("close", () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add new Todo"
  });

  addWindow.loadURL(`file://${__dirname}/add.html`);

  addWindow.on("closed", () => (addWindow = null));
}

ipcMain.on("todo:add", (event, todo) => {
  mainWindow.webContents.send("todo:add", todo);
  addWindow.close();
});

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        click() {
          createAddWindow();
        }
      },{
        label:"Clear Todo"
      },
      {
        label: "Quit",
        accelerator: "CommandOrControl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform === "darwin") {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "View",
    submenu: [
      {
        role: "reload"
      },
      {
        label: "Toggle Developer tools",
        accelerator:
          process.platform === "darwin" ? "Command+Alt+I" : "Control+Shift+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
