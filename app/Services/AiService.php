<?php

namespace App\Services;

use App\Models\WasteCategory;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = (string) config('services.google.ai_key', env('GOOGLE_AI_API_KEY', ''));
    }

    /**
     * Classify waste using Gemini 1.5 Flash.
     */
    public function classifyWaste(string $imageContent): ?array
    {
        if (empty($this->apiKey)) {
            Log::warning('Gemini AI API key is missing. Using mock classification.');
            return $this->getMockClassification();
        }

        try {
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$this->apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => "Classify the waste in this image into exactly one of these categories: plastic, paper, glass, metal, organic, e-waste. Also, estimate the weight of the waste in kilograms (e.g., 0.5, 1.2, 5.0) based on typical density and volume. Return ONLY a valid JSON object with 'category' and 'weight' keys. Example: {\"category\": \"plastic\", \"weight\": 0.5}"
                            ],
                            [
                                'inline_data' => [
                                    'mime_type' => 'image/jpeg',
                                    'data' => $this->prepareImage($imageContent)
                                ]
                            ]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $rawText = $response->json('candidates.0.content.parts.0.text');
                
                // Extract JSON if Gemini wraps it in markdown code blocks
                if (preg_match('/```json\s*(.*?)\s*```/s', $rawText, $matches)) {
                    $rawText = $matches[1];
                }
                
                $data = json_decode(trim($rawText), true);
                $categorySlug = isset($data['category']) ? trim(strtolower($data['category'])) : 'unknown';
                $weight = isset($data['weight']) ? (float)$data['weight'] : 0.0;
                
                $category = WasteCategory::where('slug', $categorySlug)->first();
                if ($category) {
                    return [
                        'category' => $category,
                        'confidence' => 0.99,
                        'label' => ucfirst($categorySlug),
                        'weight' => $weight
                    ];
                }

                return $this->fallbackMapping($categorySlug, $weight);
            }

            if ($response->status() === 403) {
                Log::error('Gemini API Error: 403 Forbidden. Check if your API key is restricted or if your region is supported.');
            } else {
                Log::error('Gemini API Error: ' . $response->status() . ' - ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('AI Service Exception: ' . $e->getMessage());
        }

        return $this->getMockClassification();
    }

    protected function fallbackMapping(string $text, float $weight = 0.0): ?array
    {
        $categories = ['plastic', 'paper', 'glass', 'metal', 'organic', 'e-waste'];
        foreach ($categories as $slug) {
            if (str_contains($text, $slug)) {
                $category = WasteCategory::where('slug', $slug)->first();
                if ($category) {
                    return [
                        'category' => $category,
                        'confidence' => 0.9,
                        'label' => ucfirst($slug),
                        'weight' => $weight
                    ];
                }
            }
        }
        return null;
    }

    protected function prepareImage(string $imageContent): string
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $imageContent)) {
            return preg_replace('/^data:image\/(\w+);base64,/', '', $imageContent);
        }

        // If it's a file path, read it and encode it
        if (file_exists($imageContent)) {
            return base64_encode(file_get_contents($imageContent));
        }

        return $imageContent;
    }

    protected function getMockClassification(): array
    {
        $categories = WasteCategory::all();
        if ($categories->isEmpty()) {
             return [
                'category' => null,
                'confidence' => 0,
                'label' => 'No categories found'
            ];
        }
        $random = $categories->random();

        return [
            'category' => $random,
            'confidence' => 0.95,
            'label' => 'Mocked ' . $random->name,
            'weight' => 1.5,
            'is_mock' => true
        ];
    }
}
