<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Database\QueryException;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string|min:5|max:1000',
        ]);

        Comment::create([
            'post_id' => $request->post_id,
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return response()->json(['message' => 'Bình luận thành công!', 'status' => 200]);
    }

    public function getComment($id)
    {
        if ($id) {
            $comment = Comment::with('user', 'post')->find($id);
            if ($comment) {
                return response()->json($comment);
            } else {
                return response()->json(['message' => 'Bình luận không tồn tại'], 404);
            }
        }
    }
    public function index()
    {
        $comments = Comment::with('user', 'post')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($comments);
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Comment::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa bình luận thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                return response()->json([
                    'message' => 'Không thể xóa bình luận: ' . $e->getMessage(),
                    'status' => 'error'
                ], 500);
            }
        }
        return response()->json(['message' => 'Xóa bình luận thất bại', 'status' => 'error'], 400);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'content' => 'required|string',
        ]);
        try {
            $comment = Comment::find($id);
            if ($comment) {
                $comment->update($data);
                return response()->json(['message' => 'Cập nhật bình luận thành công', 'status' => 200], 200);
            } else {
                return response()->json(['message' => 'Bình luận không tồn tại', 'status' => 'error'], 404);
            }
        } catch (QueryException $e) {
            return response()->json(['message' => 'Cập nhật bình luận thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
        }
    }

    public function updateStatus(request $request)
    {
        $validatedData = $request->validate([
            'status' => 'required',
        ]);
        $id = $request->id;
        $Comment = Comment::where('id', $id);
        $data = $validatedData['status'];
        $Comment->update(['status' => $data]);
        return response()->json(['message' => 'Cập nhật trạng thái thành công', 'status' => 200], 200);
    }

    public function countComments()
    {
        $totalComments = Comment::count();
        $totalApprovedComment = Comment::where('status', 'approved')->count();
        return response()->json([
            'total_approved_comments' => $totalApprovedComment,
            'total_comment' => $totalComments,
        ]);
    }


}
