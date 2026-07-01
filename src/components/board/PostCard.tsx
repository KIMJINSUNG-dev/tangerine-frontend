import { useNavigate } from "react-router-dom";
import type { Post } from "../../types";

interface PostCardProps {

    post: Post;
}

function PostCard({ post }: PostCardProps) {

    const navigate = useNavigate();

    return (

        <div
            onClick={() => navigate(`/board/posts/${post.id}`)}
            className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-sm transition-all"
        >
            <div className="flex items-center gap-2 mb-1">
                {post.boardType === "NOTICE" && (

                    <span className="text-xs font-medium text-orange-500 bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded-full">
                        공지
                    </span>
                )}
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.title}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {post.author} · {new Date(post.createdAt).toLocaleDateString()} · 조회 {post.viewCount}
                {post.commentCount > 0 && ` · 댓글 ${post.commentCount}`}
            </p>
            {post.taggedDocumentTitle && (

                <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                    #{post.taggedDocumentTitle}
                </p>
            )}
        </div>
    );
}

export default PostCard;