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
        $this->apiKey = (string) config('services.google.vision_key', '');
    }

    /**
     * Classify waste from a base64 encoded image or URL.
     *
     * @param string $imageContent Base64 or URL
     * @return array|null
     */
    public function classifyWaste(string $imageContent): ?array
    {
        if (empty($this->apiKey)) {
            Log::warning('Google Vision API key is missing. Using mock classification.');
            return $this->getMockClassification();
        }

        try {
            $response = Http::post("https://vision.googleapis.com/v1/images:annotate?key={$this->apiKey}", [
                'requests' => [
                    [
                        'image' => [
                            'content' => $this->prepareImage($imageContent),
                        ],
                        'features' => [
                            ['type' => 'LABEL_DETECTION', 'maxResults' => 10],
                        ],
                    ],
                ],
            ]);

            if ($response->successful()) {
                $labels = $response->json('responses.0.labelAnnotations');
                return $this->mapLabelsToCategory($labels);
            }

            Log::error('Google Vision API Error: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('AI Service Exception: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Map Vision API labels to internal WasteCategories.
     */
    protected function mapLabelsToCategory(?array $labels): ?array
    {
        if (empty($labels)) return null;

        $categoryMap = [
            'plastic' => ['plastic', 'bottle', 'polyethylene', 'container'],
            'paper' => ['paper', 'cardboard', 'newspaper', 'book'],
            'glass' => ['glass', 'bottle', 'jar', 'transparent'],
            'metal' => ['metal', 'aluminum', 'can', 'iron', 'steel'],
            'organic' => ['food', 'fruit', 'vegetable', 'plant', 'organic'],
            'e-waste' => ['electronic', 'battery', 'phone', 'computer', 'cable'],
        ];

        foreach ($labels as $label) {
            $description = strtolower($label['description']);
            
            foreach ($categoryMap as $slug => $keywords) {
                foreach ($keywords as $keyword) {
                    if (str_contains($description, $keyword)) {
                        $category = WasteCategory::where('slug', $slug)->first();
                        if ($category) {
                            return [
                                'category' => $category,
                                'confidence' => $label['score'],
                                'label' => $label['description']
                            ];
                        }
                    }
                }
            }
        }

        return null;
    }

    protected function prepareImage(string $imageContent): string
    {
        //check if it's already base64 or a path
        if (preg_match('/^data:image\/(\w+);base64,/', $imageContent)) {
            return preg_replace('/^data:image\/(\w+);base64,/', '', $imageContent);
        }

        return $imageContent;
    }

    protected function getMockClassification(): array
    {
        $categories = WasteCategory::all();
        $random = $categories->random();

        return [
            'category' => $random,
            'confidence' => 0.95,
            'label' => 'Mocked ' . $random->name,
            'is_mock' => true
        ];
    }
}
