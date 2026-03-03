<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Events\PickupScheduled;
use App\Http\Requests\Api\SchedulePickupRequest;
use App\Models\WastePickup;
use App\Services\RewardService;
use Illuminate\Http\Request;

class WastePickupController extends Controller
{
    protected RewardService $rewardService;

    public function __construct(RewardService $rewardService)
    {
        $this->rewardService = $rewardService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = WastePickup::with(['resident', 'collector', 'category']);

        if ($user->role === 'resident') {
            $query->where('resident_id', $user->id);
        } elseif ($user->role === 'collector') {
            $query->where(function ($q) use ($user) {
                $q->where('collector_id', $user->id)
                  ->orWhere('status', 'pending');
            });
        }

        return response()->json($query->latest()->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SchedulePickupRequest $request)
    {
        $pickup = WastePickup::create([
            'resident_id' => $request->user()->id,
            'category_id' => $request->category_id,
            'scheduled_at' => $request->scheduled_at,
            'status' => 'pending',
            'weight_kg' => $request->weight_kg,
        ]);

        PickupScheduled::dispatch($pickup);

        return response()->json([
            'success' => true,
            'message' => 'Waste pickup scheduled successfully.',
            'data' => $pickup->load('category'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(WastePickup $wastePickup)
    {
        $this->authorizeAccess($wastePickup);

        return response()->json($wastePickup->load(['resident', 'collector', 'category']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WastePickup $wastePickup)
    {
        $this->authorizeAccess($wastePickup);

        $request->validate([
            'status' => 'required|in:assigned,in_transit,completed,cancelled',
            'collector_id' => 'nullable|exists:users,id',
            'weight_kg' => 'nullable|numeric|min:0.1',
        ]);

        // Only collectors can assign themselves and update to in_transit/completed
        if ($request->user()->role === 'collector') {
            if ($request->status === 'assigned' && !$wastePickup->collector_id) {
                $wastePickup->collector_id = $request->user()->id;
            }
        }

        $wastePickup->update($request->only(['status', 'weight_kg', 'collector_id']));

        if ($wastePickup->status === 'completed' && !$wastePickup->completed_at) {
            $wastePickup->update(['completed_at' => now()]);
            $this->rewardService->awardPoints($wastePickup);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pickup updated successfully.',
            'data' => $wastePickup->load(['resident', 'collector', 'category']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WastePickup $wastePickup)
    {
        if (auth()->user()->id !== $wastePickup->resident_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($wastePickup->status !== 'pending') {
            return response()->json(['message' => 'Only pending pickups can be cancelled.'], 400);
        }

        $wastePickup->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Pickup cancelled successfully.',
        ]);
    }

    protected function authorizeAccess(WastePickup $pickup)
    {
        $user = auth()->user();
        
        if ($user->role === 'admin') return;

        if ($user->id === $pickup->resident_id || $user->id === $pickup->collector_id || ($user->role === 'collector' && $pickup->status === 'pending')) {
            return;
        }

        abort(403, 'Unauthorized access to this pickup.');
    }
}
