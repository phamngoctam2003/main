<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostTag extends Model
{
    protected $table = 'post_tag';

    protected $fillable = ['post_id', 'tag_id'];
    use HasFactory;
}
