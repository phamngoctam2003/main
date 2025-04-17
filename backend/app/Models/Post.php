<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';
    use HasFactory;


    protected $fillable = [
        'title',
        'category_id',
        'image',
        'outstanding',
        'content',
        'short_content',
        'user_id',
        'views',
    ];
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tag', 'post_id', 'tag_id');
    }
    public function comments()
    {
        return $this->hasMany(Comment::class)->where('status', 'approved')
        ->orderBy('id', 'desc')
        ->limit(5);
    }
    public function category()
{
    return $this->belongsTo(Category::class);
}
}
