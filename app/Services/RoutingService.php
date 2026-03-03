<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RoutingService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.openrouteservice.org';

    public function __construct()
    {
        $this->apiKey = config('services.openroute.key');
    }

    /**
     * Calculate an optimized route for a set of coordinates.
     * 
     * @param array $coordinates Array of [longitude, latitude] pairs.
     * @return array Optimized indices of the input coordinates.
     */
    public function optimizeRoute(array $coordinates): array
    {
        if (count($coordinates) <= 2) {
            return range(0, count($coordinates) - 1);
        }

        try {
            //get Distance/Time Matrix from ORS
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/v2/matrix/driving-car", [
                'locations' => $coordinates,
                'metrics' => ['duration'],
                'units' => 'm'
            ]);

            if ($response->failed()) {
                Log::error('OpenRouteService Matrix API failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return range(0, count($coordinates) - 1); //fallback to original order
            }

            $matrix = $response->json('durations');
            return $this->solveTSP($matrix);

        } catch (\Exception $e) {
            Log::error('Error in RoutingService: ' . $e->getMessage());
            return range(0, count($coordinates) - 1);
        }
    }

    /**
     * A simple Nearest Neighbor implementation for the Traveling Salesman Problem.
     * 
     * @param array $matrix Duration matrix from ORS.
     * @return array Optimized sequence of indices.
     */
    protected function solveTSP(array $matrix): array
    {
        $count = count($matrix);
        $visited = [0]; //start at the first point (collector's start)
        $unvisited = range(1, $count - 1);

        $current = 0;
        while (!empty($unvisited)) {
            $nearest = -1;
            $minDist = INF;

            foreach ($unvisited as $index) {
                $dist = $matrix[$current][$index] ?? INF;
                if ($dist < $minDist) {
                    $minDist = $dist;
                    $nearest = $index;
                }
            }

            if ($nearest !== -1) {
                $visited[] = $nearest;
                $unvisited = array_values(array_filter($unvisited, fn($i) => $i !== $nearest));
                $current = $nearest;
            } else {
                break;
            }
        }

        return $visited;
    }
}
