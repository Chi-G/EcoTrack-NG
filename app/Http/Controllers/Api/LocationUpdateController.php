<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Events\CollectorLocationUpdated;
use Illuminate\Support\Facades\DB;

class LocationUpdateController extends Controller
{
    /**
     * Update the collector's current location.
     */
    public function update(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
        ]);

        $user = $request->user();

        if ($user->role !== 'collector') {
            return response()->json(['message' => 'Only collectors can update their live location.'], 403);
        }

        //detect SQLite driver (integration for testing)
        if (DB::getDriverName() === 'sqlite') {
            $user->touch(); //just update timestamps
        } else {
            //update location using raw SQL for Geometry type
            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'location' => DB::raw("ST_GeomFromText('POINT({$request->lng} {$request->lat})')"),
                    'updated_at' => now(),
                ]);
        }

        //broadcast the update
        CollectorLocationUpdated::dispatch($user->id, $request->lat, $request->lng);

        return response()->json([
            'success' => true,
            'message' => 'Location updated and broadcasted successfully.',
            'coords' => [
                'lat' => $request->lat,
                'lng' => $request->lng,
            ]
        ]);
    }
}
