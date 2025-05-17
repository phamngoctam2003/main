<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUDMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth('api')->user(); // Lấy người dùng đã xác thực
        
        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập!'], 401);
        }

        $allowedRoles = ['editor', 'moderator', 'admin'];

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json(['message' => 'Bạn không có quyền sử dụng chức năng này!'], 403);
        }

        return $next($request);
    }
}
