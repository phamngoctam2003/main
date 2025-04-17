<?php

namespace App\Http\Controllers;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoriesController extends Controller
{
    public function getAllCategories($id = null)
    {
        if ($id) {
            $category = Category::select('id', 'name')->find($id);
            if ($category) {
                return response()->json($category);
            } else {
                return response()->json(['message' => 'Category not found'], 404);
            }
        } else {
            $categories = Category::select('id', 'name')
            ->orderBy('id', 'desc')
            ->get();
            return response()->json($categories);
        }
    }
    public function create(Request $request){
        $data = $request->validate([
            'name' => 'required|string',
            'description' => '',
        ]);
        try {
            $category = Category::create($data);
            return response()->json(['message' => 'Thêm Danh Mục thành công', 'status' => 200, 'category' => $category], 200);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Thêm danh mục thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
        }
    }


    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Category::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa Danh Mục thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                if($e->getCode() == '23000') {
                    return response()->json(['message' => 'Không thể xóa danh mục vì có dữ liệu liên quan', 'status' => 'error'], 400);
                }
                return response()->json(['message' => 'Xóa danh mục thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa danh mục thất bại', 'status' => 'error'], 400);
        }
    }

    public function update(Request $request, $id){
        $data = $request->validate([
            'name' => 'required|string',
            'description' => '',
        ]);
        try {
            $category = Category::findOrFail($id);
            $category->update($data);
            return response()->json(['message' => 'Cập nhật Danh Muc thành công', 'status' => 200], 200);
        } catch (ModelNotFoundException  $e) {
            return response()->json(['message' => 'Không tìm thấy danh mục: ' . $e->getMessage(), 'status' => 'error'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật danh mục thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
}
