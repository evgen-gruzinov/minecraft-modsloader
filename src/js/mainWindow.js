const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const url = require('url');


let minecraftVersion;
let language;
let installedModsFile;
let modDescription;
let modVersionType;
let modVersion;
let modInfo;
let additionalClass;
let additionalInfo;
let modButton;
let modFileName;
let modDownloadPath;
let deleteModName;
let deleteModPath;
let additionalFileInfo;
let modInstalledVersion;
let downloadText;
let downloadLink;
let deleteModText;
let modInstalled;
let length;
let temp;
let testStr;
let fullStr;
let versionStart;
let versionLength;

let write_file;
let complete = false;
let content_length = 0;
let downloaded_bytes = 0;
let percent;
let remote_file;
let local_file;
let request;

const Downloader = function () {
  this.set_remote_file = function (file) {
    remote_file = file;
    local_file = path.basename(remote_file);
  };
  this.set_local_file = function (file) {
    local_file = file;
  };
  this.run = function () {
    this.download(remote_file, local_file, 0);
  };

  this.download = function (remote, local, num) {
    console.log(remote);
    if (num > 10) {
      console.log('Too many redirects');
    }
    const self = this;
    const redirect = false;
    let new_remote = null;
    const write_to_file = false;
    let write_file_ready = false;
    percent = 0;
    const u = url.parse(remote);
    const opts = {
      host: u.hostname,
      port: u.port,
      path: u.pathname,
    };
    if (remote.indexOf('https') === 0) {
      request = https.get(opts, (response) => {
        console.log(response.headers);
        switch (response.statusCode) {
          case 200:
            content_length = response.headers['content-length'];
            break;
          case 302:
            new_remote = response.headers.location;
            self.download(new_remote, local_file, num + 1);
            return;
            break;
          case 404:
            console.log('File Not Found');
            break;
          default:
            request.abort();
            return;
        }
        response.on('data', (chunk) => {
          if (!write_file_ready) {
            write_file = fs.createWriteStream(local_file);
            write_file_ready = true;
          }
          write_file.write(chunk);
          downloaded_bytes += chunk.length;
          percent = parseInt((downloaded_bytes / content_length) * 100);
          $('.installing_mod').text(`${percent}%`);
        });
        response.on('end', () => {
          complete = true;
          write_file.end();
        });
      });
    } else {
      request = http.get(opts, (response) => {
        console.log(response.headers);
        switch (response.statusCode) {
          case 200:
            content_length = response.headers['content-length'];
            break;
          case 302:
            new_remote = response.headers.location;
            self.download(new_remote, local_file, num + 1);
            return;
            break;
          case 404:
            console.log('File Not Found');
          default:
            request.abort();
            return;
        }
        response.on('data', (chunk) => {
          if (!write_file_ready) {
            write_file = fs.createWriteStream(local_file);
            write_file_ready = true;
          }
          write_file.write(chunk);
          downloaded_bytes += chunk.length;
          percent = parseInt((downloaded_bytes / content_length) * 100);
          $('.installing_mod').text(`${percent}%`);
        });
        response.on('end', () => {
          complete = true;
          write_file.end();
        });
      });
    request.on('error', (e) => {
      console.log(`Got error: ${e}`);
    });
    }
  };
};


$(document).ready(() => {
  const settings = fs.readFileSync('settings.ini').toString().split('\n');
  settings.forEach((str) => {
    if (str.indexOf('Lang') === 0) {
      language = str.substr(6, 2);
    } else if (str.indexOf('Minecraft Version') === 0) {
      minecraftVersion = str.substr(19);
    }
  });

  installedModsFile = fs.readFileSync('installed_mods.ini').toString().split('\n');

  $.post('http://modsloader.devmonday.ru/functions/get.mods.php', { minecraft_version: minecraftVersion }, (returned) => {
    const modsData = JSON.parse(returned);
    $.each(modsData, (orderId, modData) => {
      if (language === 'ru') {
        modDescription = modData.description_ru;
        downloadText = 'Загрузить';
      } else {
        modDescription = modData.description_en;
        downloadText = 'Download';
      }

      modVersionType = modData.version_type;
      if (modVersionType !== 'Regular') {
        additionalFileInfo = `_${modVersionType}`;
      } else {
        additionalFileInfo = '';
      }
      temp = modData.name;
      modFileName = `${temp.replace(/\s/g, '') + additionalFileInfo}.jar`;
      downloadLink = modData.download_link;
      modVersion = modData.mod_version;
      modInstalled = false;
      installedModsFile.forEach((str) => {
        length = str.length - 1;
        testStr = str.substr(0, length);

        if (testStr.indexOf(modFileName) === 0 && length > 0) {
          modInstalled = true;
          fullStr = str;
        }
      });

      if (modInstalled) {
        versionStart = fullStr.indexOf(':') + 2;
        modInstalledVersion = fullStr.substr(versionStart);
        versionLength = modInstalledVersion.length - 1;
        modInstalledVersion = modInstalledVersion.substr(0, versionLength);
        if (modVersion !== modInstalledVersion) {
          additionalClass = 'need-update';
        } else {
          additionalClass = 'installed';
        }
      } else {
        modButton = `<button class="download_mod" file_name="${modFileName}" download_link="${downloadLink}" version="${modVersion}">${downloadText}</button>`;
        additionalClass = '';
      }
      if (additionalClass === 'need-update') {
        additionalInfo = '<b class="additional-info">';
        if (language === 'ru') {
          additionalInfo += 'Доступно обновление';
        } else {
          additionalInfo += 'Update available';
        }
        additionalInfo += `: ${modInstalledVersion} => ${modVersion}</b>`;
        modButton = `<button class="download_mod" file_name="${modFileName}" download_link="${downloadLink}" version="${modVersion}">${downloadText}</button>`;
      } else if (additionalClass === 'installed') {
        additionalInfo = '';
        if (language === 'ru') {
          deleteModText = 'Удалить';
        } else {
          deleteModText = 'Delete';
        }
        modButton = `<div class="delete_mod" file_name="${modFileName}">${deleteModText}</div>`;
      } else {
        modButton = `<button class="download_mod" file_name="${modFileName}" download_link="${downloadLink}" version="${modVersion}">${downloadText}</button>`;
        additionalInfo = '';
      }

      modInfo = `<div class="mods-info-block ${additionalClass}">` + `<img class="mod-logo" src="${modData.logo}" alt="">` +
                `<h2 class="mod-title">${modData.name} - ${modData.version_type}</h2>` +
                '<div class="opening-arrow" opened="no"><img src="../imgs/arrow-right.svg" alt=""></div>' +
                '<div class="additional_block"><hr>' +
                `<p class="mod-description">${modDescription}</p>${
                    additionalInfo
                }<hr>${
                modButton
                }</div></div>`;
      $('.mods-list').append(modInfo);
      $('body').css('background', '#ffffff');
      $('.mods-list').css('background', '#ffffff');
    });
  });
  $('.mods-list').on('click', '.mods-info-block .opening-arrow', function () {
    const status = $(this).attr('opened');
    if (status === 'no') {
      $(this).parent().find('.additional_block').slideDown();
      $(this).find('img').rotate({ animateTo: 90 });
      $(this).attr('opened', 'yes');
    } else {
      $(this).parent().find('.additional_block').slideUp();
      $(this).find('img').rotate({ animateTo: 0 });
      $(this).attr('opened', 'no');
    }
  });
  $('.mods-list').on('click', '.mods-info-block .additional_block .download_mod', function () {
    modFileName = $(this).attr('file_name');
    modVersion = $(this).attr('version');
    modDownloadPath = `C:/Users/${process.env.USERNAME}/AppData/Roaming/.minecraft/mods/${modFileName}`;
    downloadLink = $(this).attr('download_link');
    $(this).removeClass('download_mod').addClass('installing_mod');

    if (downloadLink.indexOf('https') === 0) {
      https.get(downloadLink, (response) => {
        if (response.headers.location !== undefined) {
          downloadLink = response.headers.location;
        }
        const Download = new Downloader();
        Download.set_remote_file(downloadLink);
        Download.set_local_file(modDownloadPath);
        Download.run();
      });
    } else {
      http.get(downloadLink, (response) => {
        if (response.headers.location !== undefined) {
          remote_file = response.headers.location;
        }
        const Download = new Downloader();
        Download.set_remote_file(downloadLink);
        Download.set_local_file(modDownloadPath);
        Download.run();
      });
    }

    installedModsFile = fs.readFileSync('installed_mods.ini').toString().split('\n');
    installedModsFile.forEach((str) => {
      length = str.length - 1;
      testStr = str.substr(0, length);
      if (testStr.indexOf(modFileName) !== 0 && testStr !== '') {
        fs.appendFileSync('installed_mods_temp.ini', `${testStr}\r\n`);
      }
    });
    fs.unlinkSync('installed_mods.ini');
    try {
      fs.accessSync('installed_mods_temp.ini', fs.constants.W_OK);
    } catch (err) {
      fs.writeFileSync('installed_mods_temp.ini', '');
      console.log('Created');
    }
    fs.renameSync('installed_mods_temp.ini', 'installed_mods.ini');

    fs.appendFileSync('installed_mods.ini', `${modFileName}: ${modVersion}\r\n`);

    const downloadCheck = setInterval(() => {
      if ($('.installing_mod').text() === '100%') {
        clearInterval(downloadCheck);
        if (language === 'ru') {
          deleteModText = 'Удалить';
        } else {
          deleteModText = 'Delete';
        }
        $('.installing_mod').parent('.additional_block').children('.additional-info').empty();
        $('.installing_mod').parent('.additional_block').parent('.mods-info-block').removeClass('need-update').addClass('installed');
        $('.installing_mod').parent('.additional_block').parent('.mods-info-block').find('.opening-arrow').attr('opened', 'no');
        $('.installing_mod').parent('.additional_block').parent('.mods-info-block').find('img').rotate({ animateTo: 0 });
        $('.installing_mod').parent('.additional_block').slideUp();
        $('.installing_mod').replaceWith(`<div class="delete_mod" file_name="${modFileName}">${deleteModText}</div>`);
      }
    }, 1500);
  });
  $('.mods-list').on('click', '.mods-info-block .additional_block .delete_mod', function () {
    deleteModName = $(this).attr('file_name');
    deleteModPath = `C:/Users/${process.env.USERNAME}/AppData/Roaming/.minecraft/mods/${deleteModName}`;
    installedModsFile = fs.readFileSync('installed_mods.ini').toString().split('\n');
    installedModsFile.forEach((str) => {
      length = str.length - 1;
      testStr = str.substr(0, length);
      if (testStr.indexOf(deleteModName) !== 0 && testStr !== '') {
        fs.appendFileSync('installed_mods_temp.ini', `${testStr}\r\n`);
      }
    });
    try {
      fs.unlinkSync(deleteModPath);
    } catch (e) {
      console.log(e);
    }
    fs.unlinkSync('installed_mods.ini');
    try {
      fs.accessSync('installed_mods_temp.ini', fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.writeFileSync('installed_mods_temp.ini', '');
      console.log('Created');
    }
    fs.renameSync('installed_mods_temp.ini', 'installed_mods.ini');
    $(this).parent('.additional_block').slideUp();
    $(this).parent('.additional_block').parent('.mods-info-block').find('.opening-arrow').attr('opened', 'no');
    $(this).parent('.additional_block').parent('.mods-info-block').find('img').rotate({ animateTo: 0 });
    $(this).parent('.additional_block').parent('.mods-info-block').removeClass('installed');
    $(this).replaceWith(`<button class="download_mod" file_name="${modFileName}" download_link="${downloadLink}" version="${modVersion}">${downloadText}</button>`);
  });
});
