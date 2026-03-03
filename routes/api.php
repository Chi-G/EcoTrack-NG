<?php

use App\Http\Controllers\Api\WasteClassificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/waste/classify', [WasteClassificationController::class, 'classify'])
    ->middleware('auth:sanctum');
