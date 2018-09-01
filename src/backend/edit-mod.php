<?php
require_once 'db.connect.php';

$mod_id = $_GET['id'];
$submit = $_POST['submit'];

$mod_arr = $mysqli->query("SELECT * FROM `modsloader_mods` WHERE `id` = $mod_id")->fetch_assoc();

$mod_name = $mod_arr['name'];
$mod_description_ru = $mod_arr['description_ru'];
$mod_description_en = $mod_arr['description_en'];
$mod_version = $mod_arr['mod_version'];
$mod_logo = $mod_arr['logo'];
$mod_download_link = $mod_arr['download_link'];

if (isset($submit)) {
    require_once 'editor-password.php';
    $entered_password = $_POST['user_password'];
    if (password_verify($entered_password, $editor_password_hash)) {
        if ($mod_name !== $_POST['mod_name']) {
            $mod_name = $mysqli->escape_string($_POST['mod_name']);
            $mysqli->query("UPDATE `modsloader_mods` SET `name` = '$mod_name' WHERE `id` = $mod_id");
        }
        if ($mod_description_ru !== $_POST['description_ru']) {
            $mod_description_ru = $mysqli->escape_string($_POST['description_ru']);
            $mysqli->query("UPDATE `modsloader_mods` SET `description_ru` = '$mod_description_ru' WHERE `id` = $mod_id");
        }
        if ($mod_description_en !== $_POST['description_en']) {
            $mod_description_en = $mysqli->escape_string($_POST['description_en']);
            $mysqli->query("UPDATE `modsloader_mods` SET `description_en` = '$mod_description_en' WHERE `id` = $mod_id");
        }
        if ($mod_version !== $_POST['mod_version']) {
            $mod_version = $mysqli->escape_string($_POST['mod_version']);
            $mysqli->query("UPDATE `modsloader_mods` SET `mod_version` = '$mod_version' WHERE `id` = $mod_id");
        }
        if ($mod_logo !== $_POST['mod_logo']) {
            $mod_logo = $mysqli->escape_string($_POST['mod_logo']);
            $mysqli->query("UPDATE `modsloader_mods` SET `logo` = '$mod_logo' WHERE `id` = $mod_id");
        }
        if ($mod_download_link !== $_POST['mod_download_link']) {
            $mod_download_link = $mysqli->escape_string($_POST['mod_download_link']);
            $mysqli->query("UPDATE `modsloader_mods` SET `download_link` = '$mod_download_link' WHERE `id` = $mod_id");
        }
    }

    header('Location: http://modsloader.devmonday.ru/functions/mods-list.php');
}

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Editing mod</title>
    <style>
        form {
            text-align: center;
        }
        label {
            margin: 5pt 0 2pt;
            display: block;
        }
        input {
            width: 250pt;
        }
        textarea {
            width: 350pt;
        }
    </style>
</head>
<body>

<form target="_self" method="post">
    <label for="mod_name">Mod name: </label>
    <input type="text" name="mod_name" id="mod_name" required value="<?php echo $mod_name ?>">
    <label for="description_ru">Mod description - Ru: </label>
    <textarea name="description_ru" id="description_ru" required><?php echo $mod_description_ru ?></textarea>
    <label for="description_en">Mod description - En: </label>
    <textarea name="description_en" id="description_en" required><?php echo $mod_description_en ?></textarea>
    <label for="mod_version">Mod version: </label>
    <input type="text" name="mod_version" id="mod_version" required value="<?php echo $mod_version ?>">
    <label for="mod_logo">Mod logo: </label>
    <input type="text" name="mod_logo" id="mod_logo" required value="<?php echo $mod_logo ?>">
    <label for="mod_download_link">Mod download link: </label>
    <input type="text" name="mod_download_link" id="mod_download_link" required value="<?php echo $mod_download_link ?>"><br><br>

    <label for="user_password">Editor password: </label>
    <input type="password" name="user_password" id="user_password" required> <br>

    <input type="submit" name="submit">
</form>

</body>
</html>
