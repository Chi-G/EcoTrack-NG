<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
$app = require __DIR__.'/../bootstrap/app.php';

$request = Request::capture();

// Fix for subdirectory deployment on LiteSpeed/Hostinger
// We inform Laravel that the application is running in the /ecotrack subdirectory
// This prevents Inertia from redirecting the browser URL to the root domain
$prefix = '/ecotrack';
if (str_starts_with($request->server->get('REQUEST_URI'), $prefix)) {
    $request->setBaseUrl($prefix);
}

$app->handleRequest($request);
