<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;

class PostsController extends Controller
{
    public function getAllPosts($id = null)
    {
        if ($id) {
            $post = Post::select('posts.*', 'categories.name as category_name', 'users.name as user_name')
                ->join('categories', 'posts.category_id', '=', 'categories.id')
                ->join('users', 'posts.user_id', '=', 'users.id')
                ->where('posts.id', $id)
                ->first();
            if ($post) {
                return response()->json($post);
            } else {
                return response()->json(['message' => 'Posts not found'], 404);
            }
        } else {
            $posts = Post::select('posts.*', 'categories.name as category_name', 'users.name as user_name')
                ->join('categories', 'posts.category_id', '=', 'categories.id')
                ->join('users', 'posts.user_id', '=', 'users.id')
                ->orderBy('posts.id', 'desc')
                ->get();
            return response()->json($posts);
        }
    }

    public function getAllPostsUser($id = null)
    {
        if ($id) {
            $post = Post::select('posts.*', 'categories.name as category_name', 'users.name as user_name')
                ->join('categories', 'posts.category_id', '=', 'categories.id')
                ->join('users', 'posts.user_id', '=', 'users.id')
                ->where('posts.id', $id)
                ->first();
            if ($post) {
                return response()->json($post);
            } else {
                return response()->json(['message' => 'Posts not found'], 404);
            }
        } else {
            $posts = Post::select('posts.*', 'categories.name as category_name', 'users.name as user_name')
                ->join('categories', 'posts.category_id', '=', 'categories.id')
                ->join('users', 'posts.user_id', '=', 'users.id')
                ->orderBy('posts.id', 'desc')
                ->where('posts.status', 'approved')
                ->get();
            return response()->json($posts);
        }
    }

    public function create(Request $request)
    {

        $validateData = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'outstanding' => 'boolean',
            'tags' => 'array',  // mảng chứa các tag_id
            'tags.*' => 'exists:tags,id',
            'short_content' => 'required|string',
            'category_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        try {

            $path = $request->file('image')->store('uploads');
            $validateData['image'] = $path;
            $post = Post::create($validateData);
            if ($request->has('tags')) {
                $post->tags()->sync($request->tags); // Sync thẻ với bài viết
            }

            return response()->json(['message' => 'Thêm bài viết thành công', 'status' => 200, 'posts' => $post], 200);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Thêm danh mục thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'image' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'outstanding' => 'integer',
            'tags' => 'array',  // mảng chứa các tag_id
            'tags.*' => 'exists:tags,id',
            'category_id' => 'required|integer',
            'short_content' => 'required|string',
        ]);

        try {
            $post = Post::findOrFail($id);

            if ($request->hasFile('image')) {
                // Xóa hình ảnh cũ nếu tồn tại
                if ($post->image && Storage::exists($post->image)) {
                    Storage::delete($post->image);
                }

                $data['image'] = $request->file('image')->store('uploads');
            } else {
                $data['image'] = $post->image;
            }

            if ($request->has('tags')) {
                $post->tags()->sync($request->tags); // Sync thẻ với bài viết
            }

            $post->update($data);
            return response()->json(['message' => 'Cập nhật Bài Viết thành công', 'status' => 200], 200);
        } catch (ModelNotFoundException  $e) {
            return response()->json(['message' => 'Không tìm thấy Bài Viết: ' . $e->getMessage(), 'status' => 'error'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật Bài Viết thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                $posts = Post::whereIn('id', $ids)->get();
                foreach ($posts as $post) {
                    $post->tags()->detach(); // Xóa các tag liên quan
                    if ($post->image && Storage::exists($post->image)) {
                        Storage::delete($post->image);
                    }
                }
                Post::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa Bài Viết thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                if ($e->getCode() == '23000') {
                    return response()->json(['message' => 'Không thể xóa Bài Viết vì có dữ liệu liên quan', 'status' => 'error'], 400);
                }
                return response()->json(['message' => 'Xóa danh mục thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa danh mục thất bại', 'status' => 'error'], 400);
        }
    }

    public function getFeaturedPosts()
    {
        $posts = Post::select('id', 'title', 'image')
            ->where('status', 'approved')
            ->where('outstanding', 1)
            ->orderBy('id', 'desc')
            ->take(5)
            ->get();

        if ($posts->isEmpty()) {
            return response()->json(['message' => 'No featured posts found'], 404);
        }

        return response()->json($posts);
    }
    public function getPostsByHomeCategory(Request $request)
    {
        $validatedData = $request->validate([
            'category_id' => 'required|integer',
        ]);
    
        $categoryId = $validatedData['category_id'];
    
        $posts = Post::with('category')
            ->where('category_id', $categoryId)
            ->where('status', 'approved')
            ->orderBy('id', 'desc')
            ->take(10) 
            ->get(['id', 'title', 'content', 'image', 'updated_at', 'category_id']); 
    
        return response()->json($posts);
    }

    public function getPostsCategory($id)
{
    $posts = Post::with('category:id,name,description')
        ->where('category_id', $id)
        ->where('status', 'approved')
        ->orderBy('id', 'desc')
        ->select('id', 'title', 'category_id', 'image', 'content')
        ->get();

    return response()->json($posts);
}


    public function updateViews(request $request)
    {
        $id = $request->id;
        $post = Post::find($id);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        $post->increment('views');
        return response()->json(['message' => 'Views updated successfully', $post->id, 'views' => $post->views]);
    }
    public function postlimit8()
    {
        $posts = Post::select('id', 'title', 'updated_at', 'image')
            ->orderBy('views', 'desc')
            ->take(8)
            ->get();
        return response()->json($posts);
    }

    public function updateStatus(request $request)
    {
        $validatedData = $request->validate([
            'status' => 'required',
        ]);
        $id = $request->id;
        $posts = Post::where('id', $id);
        $data = $validatedData['status'];
        $posts->update(['status' => $data]);
        return response()->json(['message' => 'Cập nhật trạng thái thành công', 'status' => 200], 200);
    }

    public function countPosts()
    {
        $totalPosts = Post::count();
        $totalViews = Post::sum('views');
        $totalApprovedPosts = Post::where('status', 'approved')->count();
        return response()->json([
            'total_approved_posts' => $totalApprovedPosts,
            'total_posts' => $totalPosts,
            'total_views' => $totalViews,
        ]);
    }

    public function show($id)
    {
        $post = Post::with('comments.user')->findOrFail($id);
        return response()->json($post, 200);
    }
}
