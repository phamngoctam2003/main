import { Link } from "react-router-dom";
export function slide(){
    <div className="flex gap-5">
    <div className="grid-ttp">
        {posts.map((post) => (
            <ul className="space-y-4 first-ppt" key={post.id}>
                <li className="bg-white cursor-pointer hover:bg-gray-100">
                    <Link to="/chitiet">
                        <img
                            src={post.url}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                        <div className="text-content">
                            <h3 className="">{post.title}</h3>
                            <p className="">{post.content}</p>
                        </div>
                    </Link>
                </li>
            </ul>
        ))}
    </div>
</div>
}