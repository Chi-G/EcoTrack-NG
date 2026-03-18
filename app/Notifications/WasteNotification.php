<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WasteNotification extends Notification
{
    use Queueable;

    protected $pickup;
    protected $type;
    protected $message;

    /**
     * Create a new notification instance.
     */
    public function __construct($pickup, $type, $message)
    {
        $this->pickup = $pickup;
        $this->type = $type;
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
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
            'type' => $this->type,
            'message' => $this->message,
            'title' => $this->getTitle(),
        ];
    }

    protected function getTitle()
    {
        switch ($this->type) {
            case 'new_schedule': return 'New Waste Pickup Scheduled';
            case 'assigned': return 'Collector Assigned';
            case 'completed': return 'Pickup Completed';
            case 'delivered': return 'Waste Delivered to Center';
            default: return 'Waste Update';
        }
    }
}
