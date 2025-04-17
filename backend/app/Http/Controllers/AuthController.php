<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Hello World!']);
    }
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => 'reader',
        ]);
        $token = JWTAuth::fromUser($user);

        // Return the response with token
        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
    public function login(Request $request)
    {
        $data = User::where('email', $request->email)->first();
        if (!$data || !Hash::check($request->password, $data->password)) {
            return response()->json([
                'message' => 'password không chính xác',
            ], 401);
        } else {
            $token = JWTAuth::fromUser($data);
            return response()->json([
                'data' => $data,
                'token' => $token,
            ]);
        }
    }
}
