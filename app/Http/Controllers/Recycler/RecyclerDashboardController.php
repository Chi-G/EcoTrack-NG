<?php

namespace App\Http\Controllers\Recycler;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\WastePickup;
use App\Models\WasteCategory;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecyclerDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $center = $user->recyclingCenter;

        if (!$center) {
            return Inertia::render('Recycler/Dashboard', [
                'center' => null,
                'inventory' => [],
                'recentDeliveries' => [],
                'stats' => [
                    'total_weight' => 0,
                    'total_pickups' => 0,
                ]
            ]);
        }

        // Get inventory summary
        $inventory = WasteCategory::with(['pickups' => function($query) use ($center) {
            $query->where('recycling_center_id', $center->id)
                  ->whereNotNull('delivered_at');
        }])->get()->map(function($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'total_weight' => $category->pickups->sum('weight_kg'),
                'last_update' => $category->pickups->max('delivered_at'),
            ];
        });

        // Get recent deliveries
        $recentDeliveries = WastePickup::with(['collector', 'category'])
            ->where('recycling_center_id', $center->id)
            ->whereNotNull('delivered_at')
            ->latest('delivered_at')
            ->limit(10)
            ->get();

        // Get pending deliveries (completed by collector but not yet received at center)
        $pendingDeliveries = WastePickup::with(['collector', 'category', 'resident'])
            ->where('status', 'completed')
            ->whereNull('delivered_at')
            ->latest('completed_at')
            ->get();

        // Overall stats
        $stats = [
            'total_weight' => $inventory->sum('total_weight'),
            'total_pickups' => WastePickup::where('recycling_center_id', $center->id)
                ->whereNotNull('delivered_at')
                ->count(),
            'pending_deliveries_count' => $pendingDeliveries->count(),
        ];

        return Inertia::render('Recycler/Dashboard', [
            'center' => $center,
            'inventory' => $inventory,
            'recentDeliveries' => $recentDeliveries,
            'pendingDeliveries' => $pendingDeliveries,
            'stats' => $stats,
        ]);
    }
}
