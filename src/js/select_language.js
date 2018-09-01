$(function () {

    $('.lang').on('click', function () {
        selected_language = $(this).attr('lang');
        const fs = require('fs');
        fs.appendFileSync('settings.ini','Lang: ' + selected_language + '\r\n');

        const remote = require('electron').remote;
        let w = remote.getCurrentWindow();
        w.close()
    })
    
});