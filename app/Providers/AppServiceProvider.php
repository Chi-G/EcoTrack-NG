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
        $appUrl = config('app.url');

        if (app()->environment('production', 'staging')) {
            // Adjust the request URI to strip the subdirectory prefix if present
            // This ensures Laravel's router can match the base routes correctly
            $prefix = '/ecotrack';
            $currentUri = request()->getRequestUri();
            if (str_starts_with($currentUri, $prefix)) {
                $newUri = substr($currentUri, strlen($prefix)) ?: '/';
                request()->server->set('REQUEST_URI', $newUri);
            }

            // Ensure the subdirectory is included in the forced URL if it's missing but we're at the live domain
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
