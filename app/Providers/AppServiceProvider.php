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
        if ($this->app->environment('production', 'staging')) {
            $appUrl = config('app.url');

            // Ensure the subdirectory is included in the forced URL if configured for forahia.com
            if (str_contains($appUrl, 'forahia.com') && !str_contains($appUrl, '/ecotrack')) {
                $appUrl = rtrim($appUrl, '/') . '/ecotrack';
            }

            URL::forceRootUrl($appUrl);
            config(['app.asset_url' => $appUrl]);

            if (str_starts_with($appUrl, 'https')) {
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
