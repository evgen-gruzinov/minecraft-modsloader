<?php

require_once 'db.connect.php';

$mods_req = $mysqli->query("SELECT * FROM `modsloader_mods` ORDER BY `update_date` DESC");

$mod_name = $mod_arr['name'];
$mod_description_ru = $mod_arr['description_ru'];
$mod_description_en = $mod_arr['description_en'];
$mod_version = $mod_arr['mod_version'];
$mod_logo = $mod_arr['logo'];
$mod_download_link = $mod_arr['download_link'];

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mods list</title>
</head>
<body style="max-width: 1200px; margin: 10pt auto">

<?php
    while ($mod = $mods_req->fetch_assoc()) {
        echo '<div style="display: flex; justify-content: space-between; flex-direction: row">'.
        '<p><a href="search.php?name='.$mod['name'].'">'.$mod['name'].'</a></p>'.
        '<p><a href="search.php?mversion='.$mod['minecraft_version'].'">'.$mod['minecraft_version'].'</a></p>'.
        '<p>'.$mod['version_type'].': '.$mod['mod_version'].'</p>'.
        '<p><a href="edit-mod.php?id='.$mod['id'].'">Edit</a></p>'.
        '<p><a href="duplicate.php?id='.$mod['id'].'">Duplicate</a></p>'.
        '</div>';
    }
?>

</body>
</html>


