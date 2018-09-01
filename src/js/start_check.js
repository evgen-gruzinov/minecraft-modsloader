const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

const BrowserWindow = electron.remote.BrowserWindow;

function startMain() {
  let need_icon = `${__dirname}../icons/`;

  if (process.platform === 'win32') {
    need_icon = `${need_icon}win.ico`;
  } else if (process.platform === 'darwin') {
    need_icon = `${need_icon}mac.ico`;
  }

  const mainWindow = new BrowserWindow({
    height: 750,
    width: 625,
    show: true,
    autoHideMenuBar: true,
    icon: need_icon,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../pages/mainWindow.html'),
    protocol: 'file:',
    slashes: true,
  }));
}

let started = false;
let lang_setting_opened = false;
let lang_isset = 'no';
let version_setting_opened = false;
let version_isset = 'no';
let circles = 0;

while (started === false && circles < 5) {
  let settings = fs.readFileSync('settings.ini').toString().split('\n');
  settings.forEach((str) => {
    if (str.indexOf('Lang') === 0) {
      console.log('Lang exist');
      lang_isset = 'yes';
    } else if (str.indexOf('Minecraft Version') === 0) {
      console.log('Version exist');
      version_isset = 'yes';
    }
  });
  if (lang_isset === 'yes' && version_isset === 'yes') {
    started = true;
        // alert('Starting...');
    startMain();
  } else if (lang_isset === 'no') {
    if (lang_setting_opened === false) {
      const select_language_window = new BrowserWindow({
        height: 125,
        width: 350,
        resizable: true,
        movable: false,
        minimizable: false,
        autoHideMenuBar: true,
      });
      select_language_window.loadURL(url.format({
        pathname: path.join(__dirname, '../pages/select_language.html'),
        protocol: 'file:',
        slashes: true,
      }));
      lang_setting_opened = true;
    } else {
      setTimeout(console.log('Waiting...'), 5000);
    }
  } else if (version_isset === 'no' && version_setting_opened === false) {
        /* version_isset = 'yes';
        console.log('Version create'); */

    if (version_setting_opened === false) {
      const select_version_window = new BrowserWindow({
        height: 300,
        width: 450,
        resizable: true,
        movable: false,
        minimizable: false,
        autoHideMenuBar: true,
      });
      select_version_window.loadURL(url.format({
        pathname: path.join(__dirname, '../pages/select_version.html'),
        protocol: 'file:',
        slashes: true,
      }));
      version_setting_opened = true;
    } else {
      setTimeout(console.log('Waiting...'), 5000);
    }
  }
}

