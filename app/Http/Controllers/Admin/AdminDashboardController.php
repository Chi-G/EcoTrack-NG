<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WastePickup;
use App\Models\RecyclingCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_waste_kg' => WastePickup::where('status', 'completed')->sum('weight_kg'),
            'total_points_awarded' => WastePickup::where('status', 'completed')->sum('points_awarded'),
            'active_residents' => User::where('role', 'resident')->count(),
            'active_collectors' => User::where('role', 'collector')->count(),
            'total_centers' => RecyclingCenter::count(),
        ];

        $recentPickups = WastePickup::with(['resident', 'collector', 'category', 'recyclingCenter'])
            ->latest()
            ->take(10)
            ->get();

        $centers = RecyclingCenter::withCount(['collectors', 'recyclers'])->get(); 

        // Analytics: Last 7 days of collection
        $analytics = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $analytics[] = [
                'date' => $date->format('M d'),
                'waste' => WastePickup::whereDate('created_at', $date)
                    ->where('status', 'completed')
                    ->sum('weight_kg'),
                'points' => WastePickup::whereDate('created_at', $date)
                    ->where('status', 'completed')
                    ->sum('points_awarded'),
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentPickups' => $recentPickups,
            'centers' => $centers,
            'analytics' => $analytics,
        ]);
    }

    public function centers(Request $request)
    {
        return Inertia::render('Admin/Centers', [
            'centers' => RecyclingCenter::withCount(['collectors', 'recyclers'])->get(),
            'filters' => $request->only('tab'),
        ]);
    }

    public function users(Request $request)
    {
        $query = User::with('recyclingCenter');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('center')) {
            $query->where('recycling_center_id', $request->center);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Users', [
            'users' => $query->paginate(10)->withQueryString(),
            'centers' => RecyclingCenter::all(),
            'filters' => $request->only(['role', 'search', 'center']),
        ]);
    }

    public function updateCenter(Request $request, RecyclingCenter $center)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $center->update($validated);
        return back()->with('success', 'Hub updated successfully.');
    }

    public function deleteCenter(RecyclingCenter $center)
    {
        // Nullify center for related users
        User::where('recycling_center_id', $center->id)->update(['recycling_center_id' => null]);
        
        $center->delete();
        return back()->with('success', 'Hub deleted successfully.');
    }

    public function deleteUser(User $user)
    {
        $user->delete();
        return back()->with('success', 'User deleted successfully.');
    }

    public function assignUserToCenter(Request $request, User $user)
    {
        $request->validate([
            'recycling_center_id' => 'required|exists:recycling_centers,id',
        ]);

        $user->update([
            'recycling_center_id' => $request->recycling_center_id,
        ]);

        return back()->with('success', "User {$user->name} assigned to center successfully.");
    }
}
