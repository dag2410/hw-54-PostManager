import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../services/postsService";

function EditPost() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
  });
  const [error, setError] = useState(null); 

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await getPostById(id);
        if (res.data && res.data.data) {
          console.log(res.data.data);
          setForm(res.data.data); 
        } else {
          throw new Error("Không tìm thấy dữ liệu bài viết.");
        }
      } catch (error) {
        console.error("Không tìm thấy bài viết:", error);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      }
    }

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    if (!form.title || !form.description || !form.content) {
      setError("Vui lòng điền đầy đủ các trường!");
      return;
    }

    try {
      await updatePost(id, form);
      alert("Cập nhật thành công!");
      navigate("/");
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật:",
        error.response?.data || error.message || error
      );
      setError("Cập nhật thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Sửa bài viết</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tiêu đề</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mô tả</label>
          <input
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Nội dung</label>
          <textarea
            className="form-control"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  );
}

export default EditPost;
