import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, deletePost } from "../../api/postApi";
import CommentSection from "./CommentSection";
import { useAuth } from "../../context/AuthContext";

function PostDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin, userNickname } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        
        const fetchPosts = async () => {
            
            try {
                
                const response = await getPost(id);
                setPost(response.data);
            } catch (err) {

                setError("게시글을 불러오는 데 실패했어요.");
            } finally {
                
                setLoading(false);
            }
        };
        fetchPosts();
    }, [id]);
    
    const handleDelete = async () => {
        
        if (!window.confirm("게시글을 삭제하시겠어요?")) return;
        try {
            
            await deletePost(id);
            navigate(-1);
        } catch (err) {
            
            setError("삭제에 실패했어요.");
        }
    };
    
    if (loading) return (
        
        <p className="text-center text-gray dark:text-gray-400 py-20">
            불러오는 중...
        </p>
    );
    if (error) return (
     
        <p className="text-center text-red-500 py-20">{error}</p>
    );
    if (!post) return null;
    
    const canEdit = isAdmin || post?.author === userNickname;

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
            >
                ← 뒤로가기
            </button>

            <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                {canEdit && (

                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => navigate(`/board/posts/${id}/edit`)}
                            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            편집
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1.5 rounded-lg text-sm border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <span>{post.author}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span>조회 {post.viewCount}</span>
            </div>

            {post.taggedDocumentTitle && (

                <div
                    onClick={() => navigate(`/wiki/documents/${post.taggedDocumentId}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-500 dark:text-orange-400 text-sm cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors mb-6"
                >
                    관련 문서: #{post.taggedDocumentTitle}
                </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {post.content}
            </div>

            <CommentSection postId={id} />
        </div>
    );
}

export default PostDetailPage;