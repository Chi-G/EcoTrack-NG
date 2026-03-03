<?php

use App\Http\Controllers\ProfileController;
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
    }
    return Inertia::render('Resident/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:resident'])->prefix('resident')->name('resident.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Resident/Dashboard');
    })->name('dashboard');
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
});

require __DIR__.'/auth.php';
