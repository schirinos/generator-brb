<?php 
// www/routing.php
if (preg_match('/\.(?:png|jpg|jpeg|gif)$/', $_SERVER["REQUEST_URI"])) {
    return false;
} else {
	// Mimic what .htaccess rewrite does by forcing script name to always be
	// the file we are executing as our front controller and
	// changing php self to 
	$_SERVER['SCRIPT_NAME'] = '/bootstrap.php';
	$_SERVER['PHP_SELF'] = strpos($_SERVER['PHP_SELF'], '/bootstrap.php') === 0 ? $_SERVER['PHP_SELF'] : '/bootstrap.php'.$_SERVER['PHP_SELF'];

    include __DIR__ . '/bootstrap.php';
}