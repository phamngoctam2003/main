<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostTag;

class PostTagController extends Controller
{
    public function getPostTags($id = null){
        if ($id) {
            $post = PostTag::where( 'post_id', $id)
            ->take(9)
            ->get();
            if ($post) {
                return response()->json($post);
            } else {
                return response()->json(['message' => 'Posts not found'], 404);
            }
        } else {
            $posts = PostTag::orderBy('id', 'desc')->get();
            return response()->json($posts);
        }
    }


}
