<?php
require_once 'db.connect.php';

$submit = $_POST['submit'];

if (isset($submit)) {

    require_once 'editor-password.php';
    $entered_password = $_POST['user_password'];
    if (password_verify($entered_password, $editor_password_hash)) {
        $mod_name = $mysqli->escape_string($_POST['mod_name']);
        $mod_description_ru = $mysqli->escape_string($_POST['description_ru']);
        $mod_description_en = $mysqli->escape_string($_POST['description_en']);
        $mod_version = $mysqli->escape_string($_POST['mod_version']);
        $version_type = $mysqli->escape_string($_POST['version_type']);
        $mod_logo = $mysqli->escape_string($_POST['mod_logo']);
        $minecraft_version = $mysqli->escape_string($_POST['minecraft_version']);
        $mod_download_link = $mysqli->escape_string($_POST['mod_download_link']);
        $mysqli->query("INSERT INTO `modsloader_mods` (`name`, `description_ru`, `description_en`, `mod_version`,`version_type`, `minecraft_version`, `logo`, `download_link`) VALUE ('$mod_name', '$mod_description_ru', '$mod_description_en', '$mod_version', '$version_type', '$minecraft_version', '$mod_logo', '$mod_download_link')");
        header('Location: http://modsloader.devmonday.ru/functions/mods-list.php');
    }
}
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Adding mod</title>
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
    <input type="text" name="mod_name" id="mod_name" required>
    <label for="description_ru">Mod description - Ru: </label>
    <textarea name="description_ru" id="description_ru" required></textarea>
    <label for="description_en">Mod description - En: </label>
    <textarea name="description_en" id="description_en" required></textarea>

    <label for="minecraft_version">Minecraft version: </label>
    <select name="minecraft_version" id="minecraft_version">
        <optgroup label="1.12">
            <option value="1.12.2">1.12.2</option>
            <option value="1.12.1">1.12.1</option>
            <option value="1.12">1.12</option>
        </optgroup>
        <optgroup label="1.11">
            <option value="1.11.2">1.11.2</option>
            <option value="1.11.1">1.11.1</option>
            <option value="1.11">1.11</option>
        </optgroup>
        <optgroup label="1.10">
            <option value="1.10.2">1.10.2</option>
            <option value="1.10.1">1.10.1</option>
            <option value="1.10">1.10</option>
        </optgroup>
    </select>

    <label for="mod_version">Mod version: </label>
    <input type="text" name="mod_version" id="mod_version" required>
    <label for="version_type">Version type</label>
    <select name="version_type" id="version_type">
        <option value="Regular">Regular</option>
        <option value="Beta">Beta</option>
        <option value="Alpha">Alpha</option>
    </select>
    <label for="mod_logo">Mod logo: </label>
    <input type="text" name="mod_logo" id="mod_logo" required>
    <label for="mod_download_link">Mod download link: </label>
    <input type="text" name="mod_download_link" id="mod_download_link" required ><br><br>
    <label for="user_password">Editor password: </label>
    <input type="password" name="user_password" id="user_password" required> <br>

    <input type="submit" name="submit">
</form>

</body>
</html>
