<?php

namespace App\Listeners;

use App\Events\PickupScheduled;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use App\Notifications\NewPickupAvailable;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotifyNearestCollectors implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(PickupScheduled $event): void
    {
        $pickup = $event->pickup;
        
        // Find all collectors
        // In Phase 7 (Location & Logistics), we will implement spatial routing to notify ONLY the nearest collectors.
        // For now, we notify all active collectors to ensure the system loop is functional.
        $collectors = User::where('role', 'collector')->get();

        foreach ($collectors as $collector) {
            Log::info("Dispatching Real-time Notification to Collector {$collector->name} for pickup #{$pickup->id}");
            
            $collector->notify(new NewPickupAvailable($pickup));
        }
    }
}
