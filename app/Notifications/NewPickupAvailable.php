<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewPickupAvailable extends Notification
{
    use Queueable;

    protected $pickup;

    /**
     * Create a new notification instance.
     */
    public function __construct($pickup)
    {
        $this->pickup = $pickup;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'pickup_id' => $this->pickup->id,
            'category' => $this->pickup->category->name,
            'scheduled_at' => $this->pickup->scheduled_at,
            'address' => $this->pickup->resident->address,
            'message' => "New " . ($this->pickup->category->name ?? 'Waste') . " pickup available!"
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): \Illuminate\Notifications\Messages\BroadcastMessage
    {
        return new \Illuminate\Notifications\Messages\BroadcastMessage([
            'pickup_id' => $this->pickup->id,
            'message' => "New pickup available near you!"
        ]);
    }
}
