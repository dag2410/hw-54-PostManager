import { useEffect, useState } from "react";
import { deletePost, getPosts } from "../services/postsService";
import { createPostComment, getPostComments } from "../services/postsService";
import { useNavigate } from "react-router-dom";

function PostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState({});

  const [newComment, setNewComment] = useState({
    name: "",
    content: "",
  });

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await getPostComments(postId);
      setComments((prev) => ({
        ...prev,
        [postId]: res.data.data,
      }));
    } catch (error) {
      console.error("Không thể tải bình luận:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có muốn xóa bài viết này")) {
      try {
        await deletePost(id);
        fetchPost();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleViewComments = (postId) => {
    setActivePost((prevPostId) => {
      if (prevPostId === postId) {
        return null;
      } else {
        fetchComments(postId);
        return postId;
      }
    });
  };

  const handleCommentChange = (e) => {
    setNewComment({ ...newComment, [e.target.name]: e.target.value });
  };

  const handleSubmitComment = async (e, postId) => {
    e.preventDefault();
    const { name, content } = newComment;

    if (!name || !content) {
      alert("Vui lòng điền đầy đủ thông tin bình luận.");
      return;
    }

    try {
      await createPostComment(postId, { name, content });
      setNewComment({ name: "", content: "" });
      fetchComments(postId);
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Danh sách bài viết</h1>
      <div className="row">
        {posts.map((post) => (
          <div className="mb-3" key={post.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Title: {post.title}</h5>
                <h6 className="card-subtitle mb-2">
                  Description: {post.description}
                </h6>
                <p className="card-text">Content: {post.content}</p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate(`/edit-post/${post.id}`)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    Xóa
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => handleViewComments(post.id)}
                  >
                    {activePost === post.id ? "Ẩn Bình luận" : "Xem Bình luận"}
                  </button>
                </div>

                {activePost === post.id && (
                  <div className="mt-3">
                    <h6>Thêm bình luận:</h6>
                    <form
                      onSubmit={(e) => handleSubmitComment(e, post.id)}
                      className="d-flex flex-column gap-3"
                    >
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newComment.name}
                        onChange={handleCommentChange}
                        placeholder="Họ và tên"
                        required
                      />
                      <textarea
                        className="form-control"
                        name="content"
                        value={newComment.content}
                        onChange={handleCommentChange}
                        placeholder="Nội dung bình luận"
                        required
                      />
                      <button type="submit" className="btn btn-primary">
                        Gửi bình luận
                      </button>
                    </form>

                    <h6 className="mt-4">Danh sách bình luận:</h6>
                    {comments[post.id] && comments[post.id].length > 0 ? (
                      <ul>
                        {comments[post.id].map((comment) => (
                          <li key={comment.id}>
                            <strong>{comment.name}</strong>: {comment.content}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Chưa có bình luận.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
