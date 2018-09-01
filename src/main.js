const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const { app, BrowserWindow, Menu } = electron;

let startCheck;

let need_icon = `${__dirname}icons/`;

if (process.platform === 'win32') {
  need_icon = `${need_icon}win.ico`;
} else if (process.platform === 'darwin') {
  need_icon = `${need_icon}mac.ico`;
}

// Create basic menu template
const mainMenuTemplate = [
  {
    label: 'App',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
                // Quit app when click
        click() {
          app.quit();
        },
      },
    ],
  },
];

// Add development block in menu if app in development mode
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'DevTool',
        accelerator: 'CmdOrCtrl+D',
                // Toggle Chrome DevTools when click
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: 'reload',
      },
    ],

  });
}

// Start application
app.on('ready', () => {
  fs.access('settings.ini', (err) => {
    if (err) {
      fs.writeFileSync('settings.ini', '');
    }
  });
  fs.access('installed_mods.ini', (err) => {
    if (err) {
      fs.writeFileSync('installed_mods.ini', '');
    }
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  startCheck = new BrowserWindow({
    height: 700,
    width: 500,
    icon: need_icon,
    show: true,
  });

  startCheck.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/loading.html'),
    protocol: 'file:',
    slashes: true,
  }));
});
