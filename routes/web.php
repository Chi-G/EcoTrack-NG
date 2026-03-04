<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\RewardBalanceController;
use App\Http\Controllers\Api\WastePickupController;
use App\Http\Controllers\Api\LocationUpdateController;
use App\Http\Controllers\Api\CollectorStatsController;
use App\Models\WasteCategory;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->role === 'collector') {
        return redirect()->route('collector.dashboard');
    } elseif ($user->role === 'recycler') {
        return redirect()->route('recycler.dashboard');
    } elseif ($user->role === 'resident') {
        return redirect()->route('resident.dashboard');
    }
    return redirect('/');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:resident'])->prefix('resident')->name('resident.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Resident/Dashboard');
    })->name('dashboard');
    Route::get('/history', function () {
        return Inertia::render('Resident/History');
    })->name('history');
    Route::get('/rewards', function () {
        return Inertia::render('Resident/Rewards');
    })->name('rewards');
    Route::get('/stats', function () {
        return Inertia::render('Resident/Stats');
    })->name('stats');
});

Route::middleware(['auth', 'verified', 'role:collector'])->prefix('collector')->name('collector.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Collector/Dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified', 'role:recycler'])->prefix('recycler')->name('recycler.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Recycler/Dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Internal API routes (Session authenticated)
    Route::prefix('api')->group(function () {
        Route::get('/waste-categories', function () {
            return WasteCategory::all();
        });
        Route::get('/rewards/balance', [RewardBalanceController::class, 'index']);
        Route::post('/rewards/redeem', [RewardBalanceController::class, 'redeem']);
        Route::get('/collector/stats', [CollectorStatsController::class, 'index']);
        Route::patch('/waste-pickups/{waste_pickup}/verify', [WastePickupController::class, 'verify']);
        Route::apiResource('waste-pickups', WastePickupController::class);
        Route::post('/location/update', [LocationUpdateController::class, 'update']);
    });
});

require __DIR__.'/auth.php';
