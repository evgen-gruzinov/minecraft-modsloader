<?php
require_once 'db.connect.php';

if (isset($_GET['mversion'])) {
    $minecraft_version = $_GET['mversion'];
    $mods_req = $mysqli->query("SELECT * FROM `modsloader_mods` WHERE `minecraft_version` = '$minecraft_version' ORDER BY `update_date` DESC");
} elseif (isset($_GET['name'])) {
    $mod_name = $_GET['name'];
    $mods_req = $mysqli->query("SELECT * FROM `modsloader_mods` WHERE `name` = '$mod_name' ORDER BY `update_date` DESC");
} else {
    header('Location: http://modsloader.devmonday.ru/functions/mods-list.php');
}

?>


<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Search</title>
</head>
<body style="max-width: 1200px; margin: 10pt auto">

<?php
while ($mod = $mods_req->fetch_assoc()) {
    echo '<div style="display: flex; justify-content: space-between; flex-direction: row">'.
        '<p>'.$mod['name'].'</p>'.
        '<p>'.$mod['minecraft_version'].'</p>'.
        '<p>'.$mod['mod_version'].'</p>'.
        '<p><a href="edit-mod.php?id='.$mod['id'].'">Edit</a></p>'.
        '<p><a href="duplicate.php?id='.$mod['id'].'">Duplicate</a></p>'.
        '</div>';
}
?>

</body>
</html>