<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCreateMiddleware
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

        $allowedRoles = ['editor', 'admin'];

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json(['message' => 'Bạn không có quyền thêm dữ liệu!'], 403);
        }

        return $next($request);
    }
}
