import { useEffect, useState } from "react";
import {
  getCategoriesRequest,
  createCategoryRequest,
  deleteCategoryRequest,
} from "../../services/categoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: 0,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategoriesRequest();
        setCategories(data);
      } catch {
        setError("No se pudieron cargar las categorías.");
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "type" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const newCategory = await createCategoryRequest(form);

      setCategories((prev) => [...prev, newCategory]);

      setForm({
        name: "",
        type: 0,
      });
    } catch {
      setError("No se pudo crear la categoría.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que querés eliminar esta categoría?");

    if (!confirmed) return;

    setError("");

    try {
      await deleteCategoryRequest(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "No se pudo eliminar la categoría."
      );
    }
  };

  return (
    <div>
      <h1 className="mb-4">Categorías</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value={1}>Ingreso</option>
              <option value={2}>Gasto</option>
            </select>
          </div>

          <div className="col-md-2">
            <button className="btn btn-dark w-100" type="submit">
              Agregar
            </button>
          </div>
        </div>
      </form>

      <ul className="list-group">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {cat.name} —{" "}
              <strong>{cat.type === 1 ? "Ingreso" : "Gasto"}</strong>
            </span>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(cat.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}