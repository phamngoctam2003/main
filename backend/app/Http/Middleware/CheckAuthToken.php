<?php

namespace App\Http\Middleware;

use Tymon\JWTAuth\Facades\JWTAuth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAuthToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? $request->cookie('user-info');
        if ($token) {
            try {
                JWTAuth::setToken($token); 
                $user = JWTAuth::parseToken()->authenticate();
                if ($user) {
                    $role = $user->role;
                    if ($role == 'admin'|| $role == 'editor' || $role == 'moderator') {
                        return $next($request);
                    } else {
                        return response()->json(['message' => 'Bạn không có quyền thực hiện hành động này!'], 403);
                    }
                }else {
                    return response()->json(['message' => 'Người dùng không hợp lệ!'], 401);
                }
            } catch (\Exception $e) {
                return response()->json(['message' => 'Token không hợp lệ!'], 401);
            }
        }
        return response()->json(['message' => 'Bạn không có quyền thực hiện hành động này!'], 401);
    }
}
