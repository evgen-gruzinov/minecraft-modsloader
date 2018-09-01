<?php

	$mysqli = new mysqli("localhost","e40344_devmonday","cN4bjzHCDhC4Q4Vj6f", "e40344_catpub");
	$mysqli->query('SET NAMES utf8');
	if ($mysqli->connect_error) {
		$error_write = fopen('errors.txt', 'a+');
		fwrite($error_write, $mysqli->connect_error);
		fclose($error_write);
	}