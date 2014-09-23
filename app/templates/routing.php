<?php 
// This file handles routing for the PHP dev webserver.
// Configured to serve most static assets and pass through most other requests
// to be handled by our front controller script.
if (preg_match('/\.(?:png|jpg|jpeg|gif)$/', $_SERVER["REQUEST_URI"])) {
    return false;
} else {
    include __DIR__ . '/bootstrap.php';
}