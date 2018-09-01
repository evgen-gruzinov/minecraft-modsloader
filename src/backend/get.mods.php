<?php

require_once "db.connect.php";

$minecraft_version = $_POST['minecraft_version'];

$minecraft_version = str_replace(array("\r\n", "\r", "\n"), '',  strip_tags($minecraft_version));

$query = $mysqli->query("SELECT * FROM `modsloader_mods` WHERE `minecraft_version` = '$minecraft_version' ORDER BY `name` ASC ");
$returned = [];

while ($mod_data = $query->fetch_assoc()) {
    $returned[] = $mod_data;
}

$returned = json_encode($returned);

echo ($returned);