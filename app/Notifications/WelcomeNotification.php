<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;

    /**
     * Create a new notification instance.
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'broadcast', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Welcome to EcoTrack-NG!')
                    ->greeting('Hello ' . $this->user->name . '!')
                    ->line('Thank you for joining Nigeria\'s smartest recycling network.')
                    ->line('You are registered as a ' . ucfirst($this->user->role) . '.')
                    ->action('Go to Dashboard', url('/dashboard'))
                    ->line('Start earning rewards for every gram you recycle!');
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'Welcome to the platform, ' . $this->user->name . '!',
            'role' => $this->user->role,
            'type' => 'registration_success'
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Welcome to EcoTrack-NG!',
            'user_id' => $this->user->id,
            'role' => $this->user->role,
        ];
    }
}
