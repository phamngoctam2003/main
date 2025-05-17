<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth('api')->user(); // Lấy người dùng đã xác thực
        
        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập!'], 401);
        }

        $allowedRoles = ['admin'];

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json(['message' => 'Bạn không có quyền quản lý chức năng này!', 
                'role' => $user->role
        ], 403);
        }

        return $next($request);
    }
}
