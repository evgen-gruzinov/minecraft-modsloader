$(function () {

    $('#version').select2();

    $('.select_version').on('click', function () {
        selected_version = $('#version').val();
        const fs = require('fs');
        fs.appendFileSync('settings.ini','Minecraft Version: ' + selected_version + '\r\n');

        const remote = require('electron').remote;
        let w = remote.getCurrentWindow();
        w.close()
    })

});