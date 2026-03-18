<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Events\PickupScheduled;
use App\Notifications\WasteNotification;
use App\Models\User;
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
                // Show pickups already assigned to this collector
                $q->where('collector_id', $user->id)
                  // OR show pending pickups that match the collector's assigned center
                  ->orWhere(function ($sub) use ($user) {
                      $sub->where('status', 'pending')
                          ->where('recycling_center_id', $user->recycling_center_id);
                  });
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
            'recycling_center_id' => $request->recycling_center_id,
            'scheduled_at' => $request->scheduled_at,
            'status' => 'pending',
            'weight_kg' => $request->weight_kg,
        ]);

        PickupScheduled::dispatch($pickup);

        // Notify only collectors assigned to this center
        $collectors = User::where('role', 'collector')
            ->where('recycling_center_id', $request->recycling_center_id)
            ->get();
            
        foreach ($collectors as $collector) {
            $collector->notify(new WasteNotification($pickup, 'new_schedule', "New waste pickup scheduled in your area for {$pickup->recyclingCenter->name}"));
        }

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

        if ($wastePickup->isDirty('status') || $request->has('status')) {
            if ($wastePickup->status === 'assigned') {
                $wastePickup->resident->notify(new WasteNotification($wastePickup, 'assigned', "A collector has been assigned to your pickup."));
            } elseif ($wastePickup->status === 'in_transit') {
                $wastePickup->resident->notify(new WasteNotification($wastePickup, 'in_transit', "Collector is on the way to your address."));
            }
        }

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
    public function verify(Request $request, WastePickup $wastePickup)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        if ($wastePickup->collector_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. You are not the assigned collector.'], 403);
        }

        $token = trim($request->token);
        $finalPickup = $wastePickup;

        // Smart Verification: If the token doesn't match the specific pickup ID, 
        // check if it matches ANY other active pickup assigned to this collector.
        if ($wastePickup->verification_token !== $token) {
            $matchingPickup = WastePickup::where('verification_token', $token)
                ->where('collector_id', $request->user()->id)
                ->whereIn('status', ['assigned', 'in_transit'])
                ->first();

            if ($matchingPickup) {
                $finalPickup = $matchingPickup;
            } else {
                $other = WastePickup::where('verification_token', $token)->first();
                $message = $other 
                    ? "Wrong QR Code. This code is for Pickup #{$other->id}." 
                    : "Invalid verification token. Please ensure you are scanning the correct resident's code.";
                
                \Log::info('Verification Fail', [
                    'requested_id' => $wastePickup->id,
                    'scanned_token' => $token,
                    'matched_other_id' => $other->id ?? null
                ]);

                return response()->json(['message' => $message], 422);
            }
        }

        if ($finalPickup->status === 'completed') {
            return response()->json(['message' => 'Pickup already completed.'], 400);
        }

        $finalPickup->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $this->rewardService->awardPoints($finalPickup);

        $finalPickup->resident->notify(new WasteNotification(
            $finalPickup, 
            'completed', 
            "Your waste pickup #{$finalPickup->id} has been verified and completed. You earned {$finalPickup->points_awarded} points!"
        ));

        return response()->json([
            'success' => true,
            'message' => "Pickup #{$finalPickup->id} verified and completed successfully.",
            'id' => $finalPickup->id
        ]);
    }

    public function verifyAny(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $token = trim($request->token);

        $pickup = WastePickup::where('verification_token', $token)
            ->where('collector_id', $request->user()->id)
            ->whereIn('status', ['assigned', 'in_transit'])
            ->first();

        if (!$pickup) {
            $other = WastePickup::where('verification_token', $token)->first();
            $message = $other 
                ? "Wrong QR Code. This code is for Pickup #{$other->id}." 
                : "Invalid verification token. Please ensure you are scanning the correct resident's code.";
            
            return response()->json(['message' => $message], 422);
        }

        $pickup->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $this->rewardService->awardPoints($pickup);

        $pickup->resident->notify(new WasteNotification(
            $pickup, 
            'completed', 
            "Your waste pickup #{$pickup->id} has been verified and completed. You earned {$pickup->points_awarded} points!"
        ));

        return response()->json([
            'success' => true,
            'message' => "Pickup #{$pickup->id} verified and completed successfully.",
            'id' => $pickup->id
        ]);
    }

    public function markAsDelivered(Request $request, WastePickup $wastePickup)
    {
        $user = $request->user();

        if ($user->role !== 'recycler') {
            return response()->json(['message' => 'Only recyclers can receive deliveries.'], 403);
        }

        if (!$user->recycling_center_id) {
            return response()->json(['message' => 'You are not assigned to a recycling center.'], 403);
        }

        if ($wastePickup->status !== 'completed') {
            return response()->json(['message' => 'Pickup must be completed by collector before delivery.'], 400);
        }

        if ($wastePickup->delivered_at) {
            return response()->json(['message' => 'Pickup already delivered to a center.'], 400);
        }

        $wastePickup->update([
            'recycling_center_id' => $user->recycling_center_id,
            'delivered_at' => now(),
            'status' => 'delivered'
        ]);

        $wastePickup->collector->notify(new WasteNotification($wastePickup, 'delivered', "Waste from {$wastePickup->resident->name} has been received by the recycling center."));
        $wastePickup->resident->notify(new WasteNotification($wastePickup, 'delivered', "Your waste has been successfully delivered to the recycling center."));

        return back()->with('success', 'Delivery received and verified successfully.');
    }
}
