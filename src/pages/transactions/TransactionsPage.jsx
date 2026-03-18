import { useEffect, useMemo, useState } from "react";
import { getCategoriesRequest } from "../../services/categoryService";
import {
  createTransactionRequest,
  deleteTransactionRequest,
  getTransactionsRequest,
} from "../../services/transactionService";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    type: 2,
    notes: "",
    categoryId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionsData, categoriesData] = await Promise.all([
          getTransactionsRequest(),
          getCategoriesRequest(),
        ]);

        setTransactions(transactionsData.items ?? []);
        setCategories(categoriesData);
      } catch {
        setError("No se pudieron cargar las transacciones.");
      }
    };

    loadData();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => cat.type === Number(form.type));
  }, [categories, form.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setForm((prev) => ({
        ...prev,
        type: Number(value),
        categoryId: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "categoryId"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        description: form.description,
        amount: Number(form.amount),
        date: `${form.date}T00:00:00`,
        type: Number(form.type),
        notes: form.notes,
        categoryId: Number(form.categoryId),
      };

      const newTransaction = await createTransactionRequest(payload);

      setTransactions((prev) => [newTransaction, ...prev]);

      setForm({
        description: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        type: 2,
        notes: "",
        categoryId: "",
      });
    } catch (err) {
      console.log("ERROR CREATE TRANSACTION:", err?.response?.data);

      const apiError = err?.response?.data;

      if (apiError?.errors) {
        const firstError = Object.values(apiError.errors)?.flat()?.[0];
        setError(firstError || "No se pudo crear la transacción.");
      } else {
        setError(apiError?.message || "No se pudo crear la transacción.");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que querés eliminar esta transacción?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteTransactionRequest(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "No se pudo eliminar la transacción."
      );
    }
  };

  return (
    <div>
      <h1 className="mb-4">Transacciones</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Nueva transacción</h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Descripción</label>
                <input
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Ej: Compra supermercado"
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Monto</label>
                <input
                  className="form-control"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Fecha</label>
                <input
                  className="form-control"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Tipo</label>
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
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Notas</label>
                <textarea
                  className="form-control"
                  name="notes"
                  rows="2"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <button className="btn btn-dark" type="submit">
                  Guardar transacción
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Listado</h5>

          {transactions.length === 0 ? (
            <p>No hay transacciones todavía.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.description}</td>
                    <td>{t.type === 1 ? "Ingreso" : "Gasto"}</td>
                    <td>{t.categoryName}</td>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>${t.amount}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(t.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}