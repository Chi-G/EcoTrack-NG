<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\WastePickup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ResidentDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Analytics: User's personal last 7 days of collection
        $analytics = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $analytics[] = [
                'date' => $date->format('M d'),
                'waste' => WastePickup::where('resident_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->where('status', 'completed')
                    ->sum('weight_kg'),
                'points' => WastePickup::where('resident_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->where('status', 'completed')
                    ->sum('points_awarded'),
            ];
        }

        return Inertia::render('Resident/Dashboard', [
            'analytics' => $analytics,
        ]);
    }
}
