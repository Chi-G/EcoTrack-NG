<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use App\Events\PickupScheduled;
use App\Listeners\NotifyNearestCollectors;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        Event::listen(
            PickupScheduled::class,
            NotifyNearestCollectors::class,
        );
    }
}
