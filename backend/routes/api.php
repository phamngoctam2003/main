<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\TagsController;
use App\Http\Controllers\PostTagController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\CommentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('/getaccount', [UsersController::class, 'getAccount']);
Route::post('/changepassword', [UsersController::class, 'ChangePassword']);
Route::post('/updateaccount', [UsersController::class, 'updateAccount']);
Route::post('/getpost/test', [PostsController::class, 'getPostsByHomeCategory']);
Route::get('/getpost/countposts', [PostsController::class, 'countPosts']);
Route::get('/comments/countcomments', [CommentController::class, 'countComments']);

Route::post('getpost/alltaghot', [TagsController::class, 'getAllTagHot']);

Route::post('register', [AuthController::class, 'register'])->name('register');
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::get('getpost/getfeatured', [PostsController::class, 'getFeaturedPosts']);
Route::post('getpost/getcategorytravel', [PostsController::class, 'getPostsByHomeCategory']);
Route::get('getpost/getpostcategory/{id}', [PostsController::class, 'getPostsCategory']);
Route::get('getpost/detail/{id}', [PostsController::class, 'show']);
Route::post('getpost/taghot', [TagsController::class, 'getTagHot']);
Route::get('getposttag/{id?}', [PostTagController::class, 'getPostTags']);
Route::post('/getpost/updateviewcount', [PostsController::class, 'updateViews']);
Route::get('/getpost/postlimit8', [PostsController::class, 'postlimit8']);
Route::get('callnav/{id?}', [CategoriesController::class, 'getAllCategories']);
Route::get('getpostfull/{id?}', [PostsController::class, 'getAllPostsUser']);

Route::middleware(['auth:api', 'check.admin'])->group(function () {

    Route::get('users', [UsersController::class, 'index']);
    Route::post('users/delete', [UsersController::class, 'destroy']);
    Route::post('users/updatestatus', [UsersController::class, 'updateStatus']);
    Route::post('users/updaterole', [UsersController::class, 'updateRole']);
// comment
    Route::get('/comments', [CommentController::class, 'index']);
    Route::post('/comments/delete', [CommentController::class, 'destroy']);
    Route::post('/comments/update/{id}', [CommentController::class, 'update']);
    Route::get('/comments/getcomment/{id}', [CommentController::class, 'getComment']);
    Route::post('/comments/updatestatus', [CommentController::class, 'updateStatus']);
    

});

Route::middleware(['check.auth.token'])->group(function () {
    Route::get('getcategory/{id?}', [CategoriesController::class, 'getAllCategories']);
    Route::get('getpost/{id?}', [PostsController::class, 'getAllPosts']);
    // tags
    Route::get('gettag/{id?}', [TagsController::class, 'getAllTags']);
});

Route::middleware(['auth:api', 'check.update.delete'])->group(function () {
    Route::post('getpost/delete', [PostsController::class, 'destroy']);
    Route::post('getpost/update/{id}', [PostsController::class, 'update']);
    Route::post('getpost/updatestatus', [PostsController::class, 'updateStatus']);
    Route::post('getpost/create', [PostsController::class, 'create']);

    Route::post('getcategory/update/{id}', [CategoriesController::class, 'update']);
    Route::post('getcategory/delete', [CategoriesController::class, 'destroy']);
    Route::post('getcategory/create', [CategoriesController::class, 'create']);

    Route::post('gettag/create', [TagsController::class, 'create']);
    Route::post('gettag/delete', [TagsController::class, 'destroy']);
    Route::post('gettag/update/{id}', [TagsController::class, 'update']);
});

Route::middleware(['auth:api'])->group(function () {
    Route::post('/posts/commentadd', [CommentController::class, 'store']); 
});