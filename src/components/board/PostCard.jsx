import { useNavigate } from "react-router-dom";

function PostCard({ post }) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/board/posts/${post.id}`)}
            className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-sm transition-all"
        >
            <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {post.title}
                </h3>
                <span className="text-sm text-gray-400 dark:text-gray-500 shrink-0">
                    댓글 {post.commentCount}
                </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{post.author}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>조회 {post.viewCount}</span>
                {post.taggedDocumentTitle && (

                    <span className="ml-1 text-orange-500 dark:text-orange-400">
                        #{post.taggedDocumentTitle}
                    </span>
                )}
            </div>
        </div>
    );
}

export default PostCard;