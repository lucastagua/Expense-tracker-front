import { useEffect, useState } from "react";
import { getSummaryRequest } from "../../services/dashboardService";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getSummaryRequest();
        setSummary(data);
      } catch {
        setError("No se pudo cargar el dashboard.");
      }
    };

    loadSummary();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!summary) {
    return <div>Cargando dashboard...</div>;
  }

  return (
    <>
      <h1 className="mb-4">Dashboard</h1>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Ingresos</h5>
              <p className="fs-4 mb-0">${summary.totalIncome}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Gastos</h5>
              <p className="fs-4 mb-0">${summary.totalExpense}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Balance</h5>
              <p className="fs-4 mb-0">${summary.balance}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}