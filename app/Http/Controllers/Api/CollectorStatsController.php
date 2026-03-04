<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WastePickup;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CollectorStatsController extends Controller
{
    /**
     * Get performance metrics for the logged-in collector.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'collector') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = Carbon::today();

        $todayStats = WastePickup::where('collector_id', $user->id)
            ->where('status', 'completed')
            ->whereDate('completed_at', $today)
            ->selectRaw('count(*) as count, sum(weight_kg) as total_weight')
            ->first();

        $activeAssigned = WastePickup::where('collector_id', $user->id)
            ->whereIn('status', ['assigned', 'in_transit'])
            ->count();

        $pendingAvailable = WastePickup::where('status', 'pending')
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'today_completed' => (int) ($todayStats->count ?? 0),
                'today_weight' => round((float) ($todayStats->total_weight ?? 0), 1),
                'active_assigned' => $activeAssigned,
                'pending_available' => $pendingAvailable,
            ]
        ]);
    }
}
