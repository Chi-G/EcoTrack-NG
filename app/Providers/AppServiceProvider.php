<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use App\Events\PickupScheduled;
use App\Listeners\NotifyNearestCollectors;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;
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
        if (app()->environment('production', 'staging')) {
            URL::forceRootUrl(config('app.url'));
            if (str_contains(config('app.url'), 'https')) {
                URL::forceScheme('https');
            }
        }

        Vite::prefetch(concurrency: 3);
        
        Event::listen(
            PickupScheduled::class,
            NotifyNearestCollectors::class,
        );
    }
}
