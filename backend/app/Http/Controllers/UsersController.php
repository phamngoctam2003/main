<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UsersController extends Controller
{
    public function index()
    {
        $data = User::all();
        return response()->json($data);
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                User::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa Tài Khoản thành công', 'status' => 200], 200);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Xóa tài khoản thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa tài khoản thất bại: Không có ID hợp lệ', 'status' => 'error'], 400);
        }
    }

    public function updateStatus(request $request)
    {
        $validatedData = $request->validate([
            'status' => 'required',
        ]);
        $id = $request->id;
        $posts = User::where('id', $id);
        $data = $validatedData['status'];
        $posts->update(['status' => $data]);
        return response()->json(['message' => 'Cập nhật trạng thái thành công', 'status' => 200], 200);
    }

    public function updateRole(request $request)
    {
        $validatedData = $request->validate([
            'role' => 'required',
        ]);
        $id = $request->id;
        $posts = User::where('id', $id);
        $data = $validatedData['role'];
        $posts->update(['role' => $data]);
        return response()->json(['message' => 'Cập nhật vai trò thành công', 'status' => 200], 200);
    }
    public function getAccount(request $request)
    {
        $id = $request->id;
        $data = User::where('id', $id)->first();
        return response()->json($data);
    }

    public function ChangePassword(Request $request)
    {
        $validatedData = $request->validate([
            'oldPassword' => 'required',
            'newPassword' => 'required|min:6',
        ]);

        $id = $request->userID;
        $user = User::find($id);

        if (!$user || !Hash::check($request->oldPassword, $user->password)) {
            return response()->json(['message' => 'Mật khẩu cũ không đúng!'], 400);
        }

        // Cập nhật mật khẩu mới
        $user->update(['password' => Hash::make($validatedData['newPassword'])]); // Mã hóa mật khẩu mới
        return response()->json(['message' => 'Cập nhật mật khẩu thành công', 'status' => 200], 200);
    }

    public function updateAccount(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
    
        $user = User::find($request->id);
        if (!$user) {
            return response()->json([
                'message' => 'Người dùng không tồn tại',
                'status' => 'error'
            ], 404);
        }
    
        if ($request->hasFile('image')) {
            // Xóa hình ảnh cũ nếu có
            if ($user->image && Storage::exists($user->image)) {
                Storage::delete($user->image);
            }
            $data['image'] = $request->file('image')->store('uploads');
        } else {
            $data['image'] = $user->image;
        }
    
        $user->update($data);
        return response()->json([
            'message' => 'Cập nhật tài khoản thành công',
            'status' => 200
        ]);
    }
    
    
}
