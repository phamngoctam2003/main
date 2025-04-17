<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\Tag;
class TagsController extends Controller
{
    public function getAllTags($id = null)
    {
        if($id){
            $tag = Tag::find($id);
            if ($tag) {
                return response()->json($tag);
            } else {
                return response()->json(['message' => 'Tag not found'], 404);
            }
        }else{
            $tags = Tag::all();
            return response()->json($tags);
        }
    }

    public function create(Request $request){
        $data = $request->validate([
            'name' => 'required|string',
        ]);
        try {
            $tag = Tag::create($data);
            return response()->json(['message' => 'Thêm Thẻ thành công', 'status' => 200, 'category' => $tag], 200);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Thêm Thẻ thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
        }
    }


    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Tag::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa Thẻ thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                if($e->getCode() == '23000') {
                    return response()->json(['message' => 'Không thể xóa Thẻ vì có dữ liệu liên quan', 'status' => 'error'], 400);
                }
                return response()->json(['message' => 'Xóa Thẻ thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa Thẻ thất bại', 'status' => 'error'], 400);
        }
    }

    public function update(Request $request, $id){
        $data = $request->validate([
            'name' => 'required|string',
        ]);
        try {
            $tag = Tag::findOrFail($id);
            $tag->update($data);
            return response()->json(['message' => 'Cập nhật Thẻ thành công', 'status' => 200], 200);
        } catch (ModelNotFoundException  $e) {
            return response()->json(['message' => 'Không tìm thấy Thẻ: ' . $e->getMessage(), 'status' => 'error'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật Thẻ thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }


    public function getTagHot(Request $request)
    {
        $validatedData = $request->validate([
            'tag_id' => 'required|integer',
        ]);
        $tagId = $validatedData['tag_id'];
        $tag = Tag::find($tagId);
        if (!$tag) {
        return response()->json(['error' => 'Tag not found'], 404);
    }
        $posts = $tag->posts()
        ->where('status', 'approved')
        ->take(9)
        ->orderBy('id', 'desc')->get();
        return response()->json($posts);
    }
    public function getAllTagHot(Request $request)
    {
        $validatedData = $request->validate([
            'tag_id' => 'required|integer',
        ]);
        $tagId = $validatedData['tag_id'];
        $tag = Tag::find($tagId);
        if (!$tag) {
        return response()->json(['error' => 'Tag not found'], 404);
    }
        $posts = $tag->posts()
        ->where('status', 'approved')
        ->orderBy('id', 'desc')->get();
        return response()->json($posts);
    }
}
