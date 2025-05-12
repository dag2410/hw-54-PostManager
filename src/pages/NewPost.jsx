import { useState } from "react";
import { createPost } from "../services/postsService";
import { useNavigate } from "react-router-dom";

function NewPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = "Tiêu đề là bắt buộc";
    if (!form.description) errs.description = "Mô tả là bắt buộc";
    if (!form.content) errs.content = "Nội dung là bắt buộc";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createPost(form);
      alert("Tạo bài viết thành công!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Tạo bài viết thất bại!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tạo bài viết mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-control"
          />
          {errors.title && <div className="text-danger">{errors.title}</div>}
        </div>

        <div className="mb-3">
          <label>Mô tả</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
          />
          {errors.description && (
            <div className="text-danger">{errors.description}</div>
          )}
        </div>

        <div className="mb-3">
          <label>Nội dung</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="form-control"
          />
          {errors.content && (
            <div className="text-danger">{errors.content}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Tạo bài viết
        </button>
      </form>
    </div>
  );
}

export default NewPost;
