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
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$request = Request::capture();

// Fix for subdirectory deployment on LiteSpeed/Hostinger
$prefix = '/ecotrack';
if (str_starts_with($request->server->get('REQUEST_URI'), $prefix)) {
    $request->server->set('REQUEST_URI', substr($request->server->get('REQUEST_URI'), strlen($prefix)) ?: '/');
}

$app->handleRequest($request);
