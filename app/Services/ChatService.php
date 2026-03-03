<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.google.ai_key');
    }

    /**
     * Send a message to Gemini and get a response.
     * 
     * @param string $message The user's query.
     * @param array $history Previous messages for context.
     * @return string AI response.
     */
    public function sendMessage(string $message, array $history = []): string
    {
        try {
            $systemInstruction = "You are the EcoTrack-NG Assistant, a friendly and professional expert in waste management and sustainability in Nigeria. 
            You help users with scheduling pickups, understanding rewards (tokens), and classifying waste. 
            Keep your answers concise, helpful, and encourage recycling.
            If asked about technical platform issues, advise users to contact support.";

            $contents = [];
            
            //add history if present
            foreach ($history as $chat) {
                $contents[] = [
                    'role' => $chat['role'] === 'user' ? 'user' : 'model',
                    'parts' => [['text' => $chat['content']]]
                ];
            }

            //add current message
            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => $message]]
            ];

            $response = Http::post("{$this->baseUrl}?key={$this->apiKey}", [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 1,
                    'topP' => 1,
                    'maxOutputTokens' => 512,
                ],
            ]);

            if ($response->failed()) {
                Log::error('Gemini API failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
            }

            return $response->json('candidates.0.content.parts.0.text') ?? "I couldn't generate a response. How else can I help you?";

        } catch (\Exception $e) {
            Log::error('Error in ChatService: ' . $e->getMessage());
            return "Something went wrong. I'm here to help, but let's try that again.";
        }
    }
}
