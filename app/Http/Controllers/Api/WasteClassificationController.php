<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WasteClassificationController extends Controller
{
    protected AiService $aiService;

    public function __construct(AiService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Classify waste from an uploaded image.
     */
    public function classify(Request $request)
    {
        $request->validate([
            'image' => 'required|string', // Base64 string
        ]);

        try {
            $result = $this->aiService->classifyWaste($request->image);

            if ($result) {
                return response()->json([
                    'success' => true,
                    'category' => [
                        'id' => $result['category']->id,
                        'name' => $result['category']->name,
                        'slug' => $result['category']->slug,
                        'description' => $result['category']->description,
                        'points_per_kg' => $result['category']->points_per_kg,
                    ],
                    'confidence' => $result['confidence'],
                    'label' => $result['label'],
                    'weight' => $result['weight'] ?? 0.0,
                    'is_mock' => $result['is_mock'] ?? false,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Could not classify image. Please try again or enter manually.',
            ], 422);
        } catch (\Exception $e) {
            Log::error('Classification Controller Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during classification.',
            ], 500);
        }
    }
}
