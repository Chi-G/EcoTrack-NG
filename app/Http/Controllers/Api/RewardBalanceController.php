<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use Illuminate\Http\Request;

class RewardBalanceController extends Controller
{
    /**
     * Get the current user's reward balance and transaction history.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $balance = Reward::where('user_id', $user->id)
            ->where('transaction_type', 'earned')
            ->sum('points') - 
            Reward::where('user_id', $user->id)
            ->where('transaction_type', 'redeemed')
            ->sum('points');

        $transactions = Reward::where('user_id', $user->id)
            ->latest()
            ->paginate(15);

        return response()->json([
            'balance' => (float)$balance,
            'transactions' => $transactions
        ]);
    }

    public function redeem(Request $request)
    {
        $request->validate([
            'points' => 'required|integer|min:100',
            'type' => 'required|string|in:eco-cash,voucher'
        ]);

        $user = $request->user();
        
        $balance = Reward::where('user_id', $user->id)
            ->where('transaction_type', 'earned')
            ->sum('points') - 
            Reward::where('user_id', $user->id)
            ->where('transaction_type', 'redeemed')
            ->sum('points');

        if ($balance < $request->points) {
            return response()->json(['message' => 'Insufficient points balance.'], 422);
        }

        Reward::create([
            'user_id' => $user->id,
            'points' => $request->points,
            'transaction_type' => 'redeemed',
            'description' => "Redeemed for " . ucfirst($request->type)
        ]);

        return response()->json([
            'message' => 'Redemption successful!',
            'new_balance' => $balance - $request->points
        ]);
    }
}
