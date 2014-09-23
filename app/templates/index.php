<!--
This file is required by the PHP dev server so that it doesn't return 
a 404 response when using this dir as a document root.
Also if this file is not here when using this directory as a document root, 
then PHP_SELF and SCRIPT_NAME in the $_SERVER superglobal
are equivilent to the REQUEST_URI which messes up SlimPHP route matching.
-->