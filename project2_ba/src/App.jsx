import { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [view, setView] = useState("");
  const [logs, setLogs] = useState([]); // store A/B events

  useEffect(() => {
    // Random assignment: 50% grid, 50% list
    const randomView = Math.random() < 0.5 ? "grid" : "list";
    setView(randomView);

    // Log assignment to backend
    fetch("http://localhost:5000/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        event: "assigned_variant",
        variant: randomView,
      }),
    });

    // ✅ Fetch meals from API
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c")
      .then((res) => res.json())
      .then((data) => {
        if (data.meals) {
          const mealsWithPrice = data.meals.map((meal) => ({
            ...meal,
            price: (Math.random() * 400 + 100).toFixed(0), // ₹100–₹500
          }));
          setMeals(mealsWithPrice);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Track clicks on "Order Now"
  const handleOrderClick = (meal) => {
    fetch("http://localhost:5000/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        event: "order_click",
        variant: view,
        meal: meal.strMeal,
      }),
    });

    alert(`Ordered: ${meal.strMeal}`);
  };

  // Export logs to CSV
  const exportToCSV = () => {
    const headers = ["timestamp", "event", "variant", "meal"];
    const rows = logs.map((log) => [
      log.timestamp,
      log.event,
      log.variant,
      log.meal || "",
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ab_test_results.csv";
    a.click();
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">🍴</div>
            <h1>Delicious Menu</h1>
          </div>
        </div>
      </header>

      {/* View Indicator */}
      <div className="view-indicator">
        <div className="indicator-content">
          <h2 className="view-title">
            {view === "grid" ? "🔳 Grid Layout" : "📋 List Layout"}
            <span className="meal-count">({meals.length} delicious items)</span>
          </h2>
          <div className="ab-badge">
            A/B Test: {view === "grid" ? "Version A" : "Version B"}
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <main className="main-content">
        {view === "grid" ? (
          <div className="meals-grid">
            {meals.map((meal) => (
              <div key={meal.idMeal} className="meal-card">
                <div className="meal-image-container">
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="meal-image"
                  />
                  <div className="meal-category">{meal.strCategory}</div>
                </div>
                <div className="meal-info">
                  <h3 className="meal-title">{meal.strMeal}</h3>
                  <div className="meal-footer">
                    <span className="meal-price">₹{meal.price}</span>
                    <button
                      className="order-btn"
                      onClick={() => handleOrderClick(meal)}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="meals-list">
            {meals.map((meal) => (
              <div key={meal.idMeal} className="meal-list-item">
                <div className="meal-list-image-container">
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="meal-list-image"
                  />
                </div>
                <div className="meal-list-content">
                  <div className="meal-list-info">
                    <h3 className="meal-list-title">{meal.strMeal}</h3>
                    <span className="meal-list-category">
                      {meal.strCategory}
                    </span>
                  </div>
                  <div className="meal-list-actions">
                    <span className="meal-list-price">₹{meal.price}</span>
                    <button
                      className="order-btn"
                      onClick={() => handleOrderClick(meal)}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          🧪 A/B Testing Interface • Assigned View:{" "}
          <span className="current-view">
            {view.toUpperCase()} ({view === "grid" ? "Version A" : "Version B"})
          </span>
        </div>
        {/* <button onClick={exportToCSV} className="export-btn">⬇ Export Results</button> */}
        <button
          onClick={() =>
            (window.location.href = "http://localhost:5000/download")
          }
          className="export-btn"
        >
          ⬇ Download Logs
        </button>
      </footer>
    </div>
  );
}
