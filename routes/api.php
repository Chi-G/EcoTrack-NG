<?php

use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\WasteClassificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/waste/classify', [WasteClassificationController::class, 'classify']);
    //AI Integration
    Route::post('/ai/chat', [ChatController::class, 'chat']);
});
