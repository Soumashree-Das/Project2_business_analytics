import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";

// Get backend URL with fallback for different environments
const getBackendUrl = () => {
  // For production, try environment variable first
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // For development or when VITE_BACKEND_URL is not set
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  
  // For production without explicit backend URL, assume same origin
  return window.location.origin.replace(':3000', ':5000');
};

const base_url = getBackendUrl();
console.log("🔗 Using backend URL:", base_url);

// Main App Component
function MainApp() {
  const [, setMeals] = useState([]);
  const [view, setView] = useState("");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [randomMeals, setRandomMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [backendStatus, setBackendStatus] = useState("unknown");
  const location = useLocation();

  // Dictionary of allowed emails
  const allowedEmails = {
    "admin1@example.com": true,
    "researcher2@example.com": true,
    "analyst3@example.com": true,
    "manager4@example.com": true,
  };

  // Check backend health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${base_url}/health`);
        if (response.ok) {
          setBackendStatus("connected");
          console.log("✅ Backend connection successful");
        } else {
          setBackendStatus("error");
          console.log("❌ Backend returned error status");
        }
      } catch (error) {
        setBackendStatus("offline");
        console.log("❌ Backend connection failed:", error);
      }
    };

    checkBackendHealth();
  }, []);

  useEffect(() => {
    // Check if we're on the special path
    if (location.pathname === "/download-csv-a-b-test-project2") {
      // Check if email is already saved
      const savedEmail = localStorage.getItem("abTestEmail");
      if (savedEmail && allowedEmails[savedEmail]) {
        setEmail(savedEmail);
        setIsValidEmail(true);
      }
      return; // Don't run the A/B test on this page
    }

    // Original A/B test code (only run on main page)
    const randomView = Math.random() < 0.5 ? "grid" : "list";
    setView(randomView);

    // Log the variant assignment
    const logVariantAssignment = async () => {
      try {
        await fetch(`${base_url}/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            event: "assigned_variant",
            variant: randomView,
          }),
        });
      } catch (error) {
        console.error("Failed to log variant assignment:", error);
      }
    };

    logVariantAssignment();

    // Fetch meals from TheMealDB API
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c")
      .then((res) => res.json())
      .then((data) => {
        if (data.meals) {
          const mealsWithPrice = data.meals.map((meal) => ({
            ...meal,
            price: (Math.random() * 400 + 100).toFixed(0),
          }));
          setMeals(mealsWithPrice);

          // Select 12 random meals
          const shuffled = [...mealsWithPrice].sort(() => 0.5 - Math.random());
          setRandomMeals(shuffled.slice(0, 12));
        }
      })
      .catch((err) => console.error("Failed to fetch meals:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleOrderClick = async (meal) => {
    try {
      await fetch(`${base_url}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: "order_click",
          variant: view,
          meal: meal.strMeal,
        }),
      });
    } catch (error) {
      console.error("Failed to log order click:", error);
    }

    alert(`Ordered: ${meal.strMeal}`);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (allowedEmails[email]) {
      setIsValidEmail(true);
      localStorage.setItem("abTestEmail", email);
      setDownloadError("");
    } else {
      alert("This email is not authorized to download the CSV.");
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    setDownloadError("");
    
    try {
      console.log("🔄 Attempting to download from:", `${base_url}/download`);
      
      const response = await fetch(`${base_url}/download`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No data available yet. Try running some A/B tests first.");
        }
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Get the blob and create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "ab_test_results.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log("✅ Download successful");
    } catch (error) {
      console.error("❌ Download failed:", error);
      setDownloadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDownload = () => {
    // Fallback method - direct navigation
    console.log("🔄 Attempting direct download...");
    window.open(`${base_url}/download`, '_blank');
  };

  // If we're on the download page, show email form
  if (location.pathname === "/download-csv-a-b-test-project2") {
    return (
      <div className="download-page">
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Download A/B Test Results</h1>
          
          {/* Backend Status Indicator */}
          <div className={`mb-4 p-3 rounded text-sm ${
            backendStatus === 'connected' ? 'bg-green-100 text-green-800' :
            backendStatus === 'offline' ? 'bg-red-100 text-red-800' :
            backendStatus === 'error' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            Backend Status: {
              backendStatus === 'connected' ? '✅ Connected' :
              backendStatus === 'offline' ? '❌ Offline' :
              backendStatus === 'error' ? '⚠️ Error' :
              '🔄 Checking...'
            }
            <br />
            <small>URL: {base_url}</small>
          </div>

          {!isValidEmail ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter authorized email"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
              >
                Verify Email
              </button>
              <div className="text-sm text-gray-600">
                <p>Authorized emails:</p>
                <ul className="text-xs mt-1">
                  {Object.keys(allowedEmails).map(email => (
                    <li key={email}>• {email}</li>
                  ))}
                </ul>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-green-600 text-center">✅ Access granted for: {email}</p>
              
              {downloadError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <strong>Error:</strong> {downloadError}
                </div>
              )}
              
              <div className="space-y-2">
                <button
                  onClick={handleDownload}
                  disabled={loading || backendStatus !== 'connected'}
                  className={`w-full p-3 rounded transition-colors ${
                    loading || backendStatus !== 'connected'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {loading ? '🔄 Downloading...' : '⬇️ Download CSV (Recommended)'}
                </button>
                
                <button
                  onClick={handleDirectDownload}
                  disabled={backendStatus !== 'connected'}
                  className={`w-full p-3 rounded transition-colors ${
                    backendStatus !== 'connected'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  🔗 Direct Download (Alternative)
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>If download fails, check:</p>
                <ul className="text-xs mt-1">
                  <li>• Backend server is running</li>
                  <li>• Some test data has been generated</li>
                  <li>• No browser popup blockers</li>
                </ul>
              </div>
              
              <a 
                href="/"
                className="block text-center text-blue-500 hover:underline"
              >
                ← Back to A/B Test
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Original A/B test UI
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">🍴</div>
            <h1>Delicious Menu</h1>
          </div>
          {/* Backend status indicator */}
          <div className={`text-sm px-2 py-1 rounded ${
            backendStatus === 'connected' ? 'bg-green-100 text-green-800' :
            backendStatus === 'offline' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {backendStatus === 'connected' ? '🟢' : 
             backendStatus === 'offline' ? '🔴' : '🟡'} Backend
          </div>
        </div>
      </header>

      <div className="view-indicator">
        <div className="indicator-content">
          <h2 className="view-title">
            {view === "grid" ? "🔳 Grid Layout" : "📋 List Layout"}
            <span className="meal-count">
              ({randomMeals.length} delicious items)
            </span>
          </h2>
          <div className="ab-badge">
            A/B Test: {view === "grid" ? "Version A" : "Version B"}
          </div>
        </div>
      </div>

      <main className="main-content">
        {view === "grid" ? (
          <div className="meals-grid">
            {randomMeals.map((meal) => (
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
            {randomMeals.map((meal) => (
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

      <footer className="footer">
        <div className="footer-content">
          🧪 A/B Testing Interface • Assigned View:{" "}
          <span className="current-view">
            {view.toUpperCase()} ({view === "grid" ? "Version A" : "Version B"})
          </span>
        </div>
        <div className="flex flex-col items-center gap-3 mt-10">
          <a
            href="https://forms.gle/1KKz5WKmbNDCwB3y6"
            target="_blank"
            rel="noopener noreferrer"
            className="feedback-btn"
          >
            Fill our Feedback Form
          </a>
        </div>
        <a href="/download-csv-a-b-test-project2" className="download-link">
          Admin Access
        </a>
      </footer>
    </div>
  );
}

// App wrapper with Router
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}



// // //v1

// // // import { useState, useEffect } from "react";
// // // import "./index.css";

// // // export default function App() {
// // //   const [meals, setMeals] = useState([]);
// // //   const [view, setView] = useState("");
// // //   const [logs, setLogs] = useState([]); // store A/B events

// // //   useEffect(() => {
// // //     // Random assignment: 50% grid, 50% list
// // //     const randomView = Math.random() < 0.5 ? "grid" : "list";
// // //     setView(randomView);

// // //     // Log assignment to backend
// // //     fetch(`${base_url}/log", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         timestamp: new Date().toISOString(),
// // //         event: "assigned_variant",
// // //         variant: randomView,
// // //       }),
// // //     });

// // //     // ✅ Fetch meals from API
// // //     fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c")
// // //       .then((res) => res.json())
// // //       .then((data) => {
// // //         if (data.meals) {
// // //           const mealsWithPrice = data.meals.map((meal) => ({
// // //             ...meal,
// // //             price: (Math.random() * 400 + 100).toFixed(0), // ₹100–₹500
// // //           }));
// // //           setMeals(mealsWithPrice);
// // //         }
// // //       })
// // //       .catch((err) => console.error(err));
// // //   }, []);

// // //   // Track clicks on "Order Now"
// // //   const handleOrderClick = (meal) => {
// // //     fetch(`${base_url}/log", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         timestamp: new Date().toISOString(),
// // //         event: "order_click",
// // //         variant: view,
// // //         meal: meal.strMeal,
// // //       }),
// // //     });

// // //     alert(`Ordered: ${meal.strMeal}`);
// // //   };

// // //   // Export logs to CSV
// // //   const exportToCSV = () => {
// // //     const headers = ["timestamp", "event", "variant", "meal"];
// // //     const rows = logs.map((log) => [
// // //       log.timestamp,
// // //       log.event,
// // //       log.variant,
// // //       log.meal || "",
// // //     ]);
// // //     const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

// // //     const blob = new Blob([csvContent], { type: "text/csv" });
// // //     const url = URL.createObjectURL(blob);
// // //     const a = document.createElement("a");
// // //     a.href = url;
// // //     a.download = "ab_test_results.csv";
// // //     a.click();
// // //   };

// // //   return (
// // //     <div className="app">
// // //       {/* Header */}
// // //       <header className="header">
// // //         <div className="header-content">
// // //           <div className="logo">
// // //             <div className="logo-icon">🍴</div>
// // //             <h1>Delicious Menu</h1>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       {/* View Indicator */}
// // //       <div className="view-indicator">
// // //         <div className="indicator-content">
// // //           <h2 className="view-title">
// // //             {view === "grid" ? "🔳 Grid Layout" : "📋 List Layout"}
// // //             <span className="meal-count">({meals.length} delicious items)</span>
// // //           </h2>
// // //           <div className="ab-badge">
// // //             A/B Test: {view === "grid" ? "Version A" : "Version B"}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Meals Section */}
// // //       <main className="main-content">
// // //         {view === "grid" ? (
// // //           <div className="meals-grid">
// // //             {meals.map((meal) => (
// // //               <div key={meal.idMeal} className="meal-card">
// // //                 <div className="meal-image-container">
// // //                   <img
// // //                     src={meal.strMealThumb}
// // //                     alt={meal.strMeal}
// // //                     className="meal-image"
// // //                   />
// // //                   <div className="meal-category">{meal.strCategory}</div>
// // //                 </div>
// // //                 <div className="meal-info">
// // //                   <h3 className="meal-title">{meal.strMeal}</h3>
// // //                   <div className="meal-footer">
// // //                     <span className="meal-price">₹{meal.price}</span>
// // //                     <button
// // //                       className="order-btn"
// // //                       onClick={() => handleOrderClick(meal)}
// // //                     >
// // //                       Order Now
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <div className="meals-list">
// // //             {meals.map((meal) => (
// // //               <div key={meal.idMeal} className="meal-list-item">
// // //                 <div className="meal-list-image-container">
// // //                   <img
// // //                     src={meal.strMealThumb}
// // //                     alt={meal.strMeal}
// // //                     className="meal-list-image"
// // //                   />
// // //                 </div>
// // //                 <div className="meal-list-content">
// // //                   <div className="meal-list-info">
// // //                     <h3 className="meal-list-title">{meal.strMeal}</h3>
// // //                     <span className="meal-list-category">
// // //                       {meal.strCategory}
// // //                     </span>
// // //                   </div>
// // //                   <div className="meal-list-actions">
// // //                     <span className="meal-list-price">₹{meal.price}</span>
// // //                     <button
// // //                       className="order-btn"
// // //                       onClick={() => handleOrderClick(meal)}
// // //                     >
// // //                       Order Now
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </main>

// // //       {/* Footer */}
// // //       <footer className="footer">
// // //         <div className="footer-content">
// // //           🧪 A/B Testing Interface • Assigned View:{" "}
// // //           <span className="current-view">
// // //             {view.toUpperCase()} ({view === "grid" ? "Version A" : "Version B"})
// // //           </span>
// // //         </div>
// // //         {/* <button onClick={exportToCSV} className="export-btn">⬇ Export Results</button> */}
// // //         <button
// // //           onClick={() =>
// // //             (window.location.href = `${base_url}/download")
// // //           }
// // //           className="export-btn"
// // //         >
// // //           ⬇ Download Logs
// // //         </button>
// // //       </footer>
// // //     </div>
// // //   );
// // // }

// // //v2

// // // import { useState, useEffect } from "react";
// // // import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// // // import "./index.css";

// // // // Main App Component
// // // function MainApp() {
// // //   const [meals, setMeals] = useState([]);
// // //   const [view, setView] = useState("");
// // //   const [logs, setLogs] = useState([]);
// // //   const [email, setEmail] = useState("");
// // //   const [isValidEmail, setIsValidEmail] = useState(false);
// // //   const location = useLocation();

// // //   useEffect(() => {
// // //     // Check if we're on the special path
// // //     if (location.pathname === "/download-csv-a-b-test-project2") {
// // //       // Check if email is already in localStorage
// // //       const savedEmail = localStorage.getItem('abTestEmail');
// // //       if (savedEmail && savedEmail.endsWith('@example.com')) {
// // //         setEmail(savedEmail);
// // //         setIsValidEmail(true);
// // //       }
// // //       return; // Don't run the A/B test on this page
// // //     }

// // //     // Original A/B test code (only run on main page)
// // //     const randomView = Math.random() < 0.5 ? "grid" : "list";
// // //     setView(randomView);

// // //     fetch(`${base_url}/log", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         timestamp: new Date().toISOString(),
// // //         event: "assigned_variant",
// // //         variant: randomView,
// // //       }),
// // //     });

// // //     fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c")
// // //       .then((res) => res.json())
// // //       .then((data) => {
// // //         if (data.meals) {
// // //           const mealsWithPrice = data.meals.map((meal) => ({
// // //             ...meal,
// // //             price: (Math.random() * 400 + 100).toFixed(0),
// // //           }));
// // //           setMeals(mealsWithPrice);
// // //         }
// // //       })
// // //       .catch((err) => console.error(err));
// // //   }, [location]);

// // //   const handleOrderClick = (meal) => {
// // //     fetch(`${base_url}/log", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         timestamp: new Date().toISOString(),
// // //         event: "order_click",
// // //         variant: view,
// // //         meal: meal.strMeal,
// // //       }),
// // //     });

// // //     alert(`Ordered: ${meal.strMeal}`);
// // //   };

// // //   const handleEmailSubmit = (e) => {
// // //     e.preventDefault();
// // //     if (email.endsWith('@example.com')) {
// // //       setIsValidEmail(true);
// // //       localStorage.setItem('abTestEmail', email);
// // //     } else {
// // //       alert("Only @example.com emails are allowed to download the CSV.");
// // //     }
// // //   };

// // //   // If we're on the download page, show email form
// // //   if (location.pathname === "/download-csv-a-b-test-project2") {
// // //     return (
// // //       <div className="download-page">
// // //         <h1>Download A/B Test Results</h1>
// // //         {!isValidEmail ? (
// // //           <form onSubmit={handleEmailSubmit} className="email-form">
// // //             <input
// // //               type="email"
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               placeholder="Enter your @example.com email"
// // //               required
// // //             />
// // //             <button type="submit">Verify Email</button>
// // //           </form>
// // //         ) : (
// // //           <div className="download-section">
// // //             <p>Access granted for: {email}</p>
// // //             <button
// // //               onClick={() => (window.location.href = `${base_url}/download")}
// // //               className="export-btn"
// // //             >
// // //               ⬇ Download CSV
// // //             </button>
// // //           </div>
// // //         )}
// // //       </div>
// // //     );
// // //   }

// // //   // Original A/B test UI
// // //   return (
// // //     <div className="app">
// // //       <header className="header">
// // //         <div className="header-content">
// // //           <div className="logo">
// // //             <div className="logo-icon">🍴</div>
// // //             <h1>Delicious Menu</h1>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       <div className="view-indicator">
// // //         <div className="indicator-content">
// // //           <h2 className="view-title">
// // //             {view === "grid" ? "🔳 Grid Layout" : "📋 List Layout"}
// // //             <span className="meal-count">({meals.length} delicious items)</span>
// // //           </h2>
// // //           <div className="ab-badge">
// // //             A/B Test: {view === "grid" ? "Version A" : "Version B"}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <main className="main-content">
// // //         {view === "grid" ? (
// // //           <div className="meals-grid">
// // //             {meals.map((meal) => (
// // //               <div key={meal.idMeal} className="meal-card">
// // //                 <div className="meal-image-container">
// // //                   <img
// // //                     src={meal.strMealThumb}
// // //                     alt={meal.strMeal}
// // //                     className="meal-image"
// // //                   />
// // //                   <div className="meal-category">{meal.strCategory}</div>
// // //                 </div>
// // //                 <div className="meal-info">
// // //                   <h3 className="meal-title">{meal.strMeal}</h3>
// // //                   <div className="meal-footer">
// // //                     <span className="meal-price">₹{meal.price}</span>
// // //                     <button
// // //                       className="order-btn"
// // //                       onClick={() => handleOrderClick(meal)}
// // //                     >
// // //                       Order Now
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <div className="meals-list">
// // //             {meals.map((meal) => (
// // //               <div key={meal.idMeal} className="meal-list-item">
// // //                 <div className="meal-list-image-container">
// // //                   <img
// // //                     src={meal.strMealThumb}
// // //                     alt={meal.strMeal}
// // //                     className="meal-list-image"
// // //                   />
// // //                 </div>
// // //                 <div className="meal-list-content">
// // //                   <div className="meal-list-info">
// // //                     <h3 className="meal-list-title">{meal.strMeal}</h3>
// // //                     <span className="meal-list-category">
// // //                       {meal.strCategory}
// // //                     </span>
// // //                   </div>
// // //                   <div className="meal-list-actions">
// // //                     <span className="meal-list-price">₹{meal.price}</span>
// // //                     <button
// // //                       className="order-btn"
// // //                       onClick={() => handleOrderClick(meal)}
// // //                     >
// // //                       Order Now
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </main>

// // //       <footer className="footer">
// // //         <div className="footer-content">
// // //           🧪 A/B Testing Interface • Assigned View:{" "}
// // //           <span className="current-view">
// // //             {view.toUpperCase()} ({view === "grid" ? "Version A" : "Version B"})
// // //           </span>
// // //         </div>
// // //         <a href="/download-csv-a-b-test-project2" className="download-link">
// // //           Admin Access
// // //         </a>
// // //       </footer>
// // //     </div>
// // //   );
// // // }

// // // // App wrapper with Router
// // // export default function App() {
// // //   return (
// // //     <Router>
// // //       <Routes>
// // //         <Route path="*" element={<MainApp />} />
// // //       </Routes>
// // //     </Router>
// // //   );
// // // }

// // //v4
// // // import { useState, useEffect } from "react";
// // // import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// // // import "./index.css";

// // // // Main App Component
// // // function MainApp() {
// // //   const [meals, setMeals] = useState([]);
// // //   const [view, setView] = useState("");
// // //   const [logs, setLogs] = useState([]);
// // //   const [email, setEmail] = useState("");
// // //   const [isValidEmail, setIsValidEmail] = useState(false);
// // //   const location = useLocation();

// // //   // Dictionary of allowed emails
// // //   const allowedEmails = {
// // //     "admin1@example.com": true,
// // //     "researcher2@example.com": true,
// // //     "analyst3@example.com": true,
// // //     "manager4@example.com": true
// // //   };

// // //   useEffect(() => {
// // //     // Check if we're on the special path
// // //     if (location.pathname === "/download-csv-a-b-test-project2") {
// // //       // Check if email is already in localStorage
// // //       const savedEmail = localStorage.getItem('abTestEmail');
// // //       if (savedEmail && allowedEmails[savedEmail]) {
// // //         setEmail(savedEmail);
// // //         setIsValidEmail(true);
// // //       }
// // //       return; // Don't run the A/B test on this page
// // //     }

// // //     // Original A/B test code (only run on main page)
// // //     const randomView = Math.random() < 0.5 ? "grid" : "list";
// // //     setView(randomView);

// // //     fetch(`${base_url}/log", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         timestamp: new Date().toISOString(),
// // //         event: "assigned_variant",
// // //         variant: randomView,
// // //       }),
// // //     });

// // //     fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c")
// // //       .then((res) => res.json())
// // //       .then((data) => {
// // //         if (data.meals) {
// // //           const mealsWithPrice = data.meals.map((meal) => ({
// // //             ...meal,
// // //             price: (Math.random() * 400 + 100).toFixed(0),
// // //           }));
// // //           setMeals(mealsWithPrice);
// // //         }
// // //       })
// // //       .catch((err) => console.error(err));
// // //   }, [location]);

// // //   const handleOrderClick = (meal) => {
// // //     fetch(`${base_url}/log", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         timestamp: new Date().toISOString(),
// // //         event: "order_click",
// // //         variant: view,
// // //         meal: meal.strMeal,
// // //       }),
// // //     });

// // //     alert(`Ordered: ${meal.strMeal}`);
// // //   };

// // //   const handleEmailSubmit = (e) => {
// // //     e.preventDefault();
// // //     if (allowedEmails[email]) {
// // //       setIsValidEmail(true);
// // //       localStorage.setItem('abTestEmail', email);
// // //     } else {
// // //       alert("This email is not authorized to download the CSV.");
// // //     }
// // //   };

// // //   // If we're on the download page, show email form
// // //   if (location.pathname === "/download-csv-a-b-test-project2") {
// // //     return (
// // //       <div className="download-page">
// // //         <h1>Download A/B Test Results</h1>
// // //         {!isValidEmail ? (
// // //           <form onSubmit={handleEmailSubmit} className="email-form">
// // //             <input
// // //               type="email"
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               placeholder="Enter authorized email"
// // //               required
// // //             />
// // //             <button type="submit">Verify Email</button>
// // //           </form>
// // //         ) : (
// // //           <div className="download-section">
// // //             <p>Access granted for: {email}</p>
// // //             <button
// // //               onClick={() => (window.location.href = `${base_url}/download")}
// // //               className="export-btn"
// // //             >
// // //               ⬇ Download CSV
// // //             </button>
// // //           </div>
// // //         )}
// // //       </div>
// // //     );
// // //   }

// // //   // Original A/B test UI
// // //   return (
// // //     <div className="app">
// // //       <header className="header">
// // //         <div className="header-content">
// // //           <div className="logo">
// // //             <div className="logo-icon">🍴</div>
// // //             <h1>Delicious Menu</h1>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       <div className="view-indicator">
// // //         <div className="indicator-content">
// // //           <h2 className="view-title">
// // //             {view === "grid" ? "🔳 Grid Layout" : "📋 List Layout"}
// // //             <span className="meal-count">({10} delicious items)</span>
// // //           </h2>
// // //           <div className="ab-badge">
// // //             A/B Test: {view === "grid" ? "Version A" : "Version B"}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <main className="main-content">
// // //         {view === "grid" ? (
// // //           <div className="meals-grid">
// // //             {meals.map((meal) => (
// // //               <div key={meal.idMeal} className="meal-card">
// // //                 <div className="meal-image-container">
// // //                   <img
// // //                     src={meal.strMealThumb}
// // //                     alt={meal.strMeal}
// // //                     className="meal-image"
// // //                   />
// // //                   <div className="meal-category">{meal.strCategory}</div>
// // //                 </div>
// // //                 <div className="meal-info">
// // //                   <h3 className="meal-title">{meal.strMeal}</h3>
// // //                   <div className="meal-footer">
// // //                     <span className="meal-price">₹{meal.price}</span>
// // //                     <button
// // //                       className="order-btn"
// // //                       onClick={() => handleOrderClick(meal)}
// // //                     >
// // //                       Order Now
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <div className="meals-list">
// // //             {meals.map((meal) => (
// // //               <div key={meal.idMeal} className="meal-list-item">
// // //                 <div className="meal-list-image-container">
// // //                   <img
// // //                     src={meal.strMealThumb}
// // //                     alt={meal.strMeal}
// // //                     className="meal-list-image"
// // //                   />
// // //                 </div>
// // //                 <div className="meal-list-content">
// // //                   <div className="meal-list-info">
// // //                     <h3 className="meal-list-title">{meal.strMeal}</h3>
// // //                     <span className="meal-list-category">
// // //                       {meal.strCategory}
// // //                     </span>
// // //                   </div>
// // //                   <div className="meal-list-actions">
// // //                     <span className="meal-list-price">₹{meal.price}</span>
// // //                     <button
// // //                       className="order-btn"
// // //                       onClick={() => handleOrderClick(meal)}
// // //                     >
// // //                       Order Now
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </main>

// // //       <footer className="footer">
// // //         <div className="footer-content">
// // //           🧪 A/B Testing Interface • Assigned View:{" "}
// // //           <span className="current-view">
// // //             {view.toUpperCase()} ({view === "grid" ? "Version A" : "Version B"})
// // //           </span>
// // //         </div>
// // //         <a href="/download-csv-a-b-test-project2" className="download-link">
// // //           Admin Access
// // //         </a>
// // //       </footer>
// // //     </div>
// // //   );
// // // }

// // // // App wrapper with Router
// // // export default function App() {
// // //   return (
// // //     <Router>
// // //       <Routes>
// // //         <Route path="*" element={<MainApp />} />
// // //       </Routes>
// // //     </Router>
// // //   );
// // // }
// // import { useState, useEffect } from "react";
// // import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// // import "./index.css";

// // const base_url = import.meta.env.VITE_BACKEND_URL;

// // // Main App Component
// // function MainApp() {
// //   const [, setMeals] = useState([]);
// //   const [view, setView] = useState("");
// //   //const [logs, setLogs] = useState([]);
// //   const [email, setEmail] = useState("");
// //   const [isValidEmail, setIsValidEmail] = useState(false);
// //   const [randomMeals, setRandomMeals] = useState([]);
// //   const location = useLocation();

// //   // Dictionary of allowed emails
// //   const allowedEmails = {
// //     "admin1@example.com": true,
// //     "researcher2@example.com": true,
// //     "analyst3@example.com": true,
// //     "manager4@example.com": true
// //   };

// //   useEffect(() => {
// //     // Check if we're on the special path
// //     if (location.pathname === "/download-csv-a-b-test-project2") {
// //       // Check if email is already in localStorage
// //       const savedEmail = localStorage.getItem('abTestEmail');
// //       if (savedEmail && allowedEmails[savedEmail]) {
// //         setEmail(savedEmail);
// //         setIsValidEmail(true);
// //       }
// //       return; // Don't run the A/B test on this page
// //     }

// //     // Original A/B test code (only run on main page)
// //     const randomView = Math.random() < 0.5 ? "grid" : "list";
// //     setView(randomView);

// //     fetch(`${base_url}/log`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         timestamp: new Date().toISOString(),
// //         event: "assigned_variant",
// //         variant: randomView,
// //       }),
// //     });

// //     fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c")
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (data.meals) {
// //           const mealsWithPrice = data.meals.map((meal) => ({
// //             ...meal,
// //             price: (Math.random() * 400 + 100).toFixed(0),
// //           }));
// //           setMeals(mealsWithPrice);

// //           // Select 10 random meals
// //           const shuffled = [...mealsWithPrice].sort(() => 0.5 - Math.random());
// //           setRandomMeals(shuffled.slice(0, 12));
// //         }
// //       })
// //       .catch((err) => console.error(err));
// //       // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [location]);

// //   const handleOrderClick = (meal) => {
// //     fetch(`${base_url}/log`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         timestamp: new Date().toISOString(),
// //         event: "order_click",
// //         variant: view,
// //         meal: meal.strMeal,
// //       }),
// //     });

// //     alert(`Ordered: ${meal.strMeal}`);
// //   };

// //   const handleEmailSubmit = (e) => {
// //     e.preventDefault();
// //     if (allowedEmails[email]) {
// //       setIsValidEmail(true);
// //       localStorage.setItem('abTestEmail', email);
// //     } else {
// //       alert("This email is not authorized to download the CSV.");
// //     }
// //   };

// //   // If we're on the download page, show email form
// //   if (location.pathname === "/download-csv-a-b-test-project2") {
// //     return (
// //       <div className="download-page">
// //         <h1>Download A/B Test Results</h1>
// //         {!isValidEmail ? (
// //           <form onSubmit={handleEmailSubmit} className="email-form">
// //             <input
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               placeholder="Enter authorized email"
// //               required
// //             />
// //             <button type="submit">Verify Email</button>
// //           </form>
// //         ) : (
// //           <div className="download-section">
// //             <p>Access granted for: {email}</p>
// //             <button
// //               onClick={() => (window.location.href = `${base_url}/download`)}
// //               className="export-btn"
// //             >
// //               ⬇ Download CSV
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     );
// // }

// //   // Original A/B test UI
// //   return (
// //     <div className="app">
// //       <header className="header">
// //         <div className="header-content">
// //           <div className="logo">
// //             <div className="logo-icon">🍴</div>
// //             <h1>Delicious Menu</h1>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="view-indicator">
// //         <div className="indicator-content">
// //           <h2 className="view-title">
// //             {view === "grid" ? "🔳 Grid Layout" : "📋 List Layout"}
// //             <span className="meal-count">({randomMeals.length} delicious items)</span>
// //           </h2>
// //           <div className="ab-badge">
// //             A/B Test: {view === "grid" ? "Version A" : "Version B"}
// //           </div>
// //         </div>
// //       </div>

// //       <main className="main-content">
// //         {view === "grid" ? (
// //           <div className="meals-grid">
// //             {randomMeals.map((meal) => (
// //               <div key={meal.idMeal} className="meal-card">
// //                 <div className="meal-image-container">
// //                   <img
// //                     src={meal.strMealThumb}
// //                     alt={meal.strMeal}
// //                     className="meal-image"
// //                   />
// //                   <div className="meal-category">{meal.strCategory}</div>
// //                 </div>
// //                 <div className="meal-info">
// //                   <h3 className="meal-title">{meal.strMeal}</h3>
// //                   <div className="meal-footer">
// //                     <span className="meal-price">₹{meal.price}</span>
// //                     <button
// //                       className="order-btn"
// //                       onClick={() => handleOrderClick(meal)}
// //                     >
// //                       Order Now
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="meals-list">
// //             {randomMeals.map((meal) => (
// //               <div key={meal.idMeal} className="meal-list-item">
// //                 <div className="meal-list-image-container">
// //                   <img
// //                     src={meal.strMealThumb}
// //                     alt={meal.strMeal}
// //                     className="meal-list-image"
// //                   />
// //                 </div>
// //                 <div className="meal-list-content">
// //                   <div className="meal-list-info">
// //                     <h3 className="meal-list-title">{meal.strMeal}</h3>
// //                     <span className="meal-list-category">
// //                       {meal.strCategory}
// //                     </span>
// //                   </div>
// //                   <div className="meal-list-actions">
// //                     <span className="meal-list-price">₹{meal.price}</span>
// //                     <button
// //                       className="order-btn"
// //                       onClick={() => handleOrderClick(meal)}
// //                     >
// //                       Order Now
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </main>

// //       <footer className="footer">
// //         <div className="footer-content">
// //           🧪 A/B Testing Interface • Assigned View:{" "}
// //           <span className="current-view">
// //             {view.toUpperCase()} ({view === "grid" ? "Version A" : "Version B"})
// //           </span>
// //         </div>
// //         <div className="flex flex-col items-center gap-3 mt-10">
// //           <a
// //             href="https://forms.gle/1KKz5WKmbNDCwB3y6"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="feedback-btn"
// //           >
// //           Fill our Feedback Form
// //           </a>
// //         </div>
// //           <a href="/download-csv-a-b-test-project2" className="download-link">
// //             Admin Access
// //           </a>
// //       </footer>
// //     </div>
// //   );
// // }

// // // App wrapper with Router
// // export default function App() {
// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="*" element={<MainApp />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// import { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";
// import "./index.css";

// const base_url = import.meta.env.VITE_BACKEND_URL;

// // Main App Component
// function MainApp() {
//   const [, setMeals] = useState([]);
//   const [view, setView] = useState("");
//   const [email, setEmail] = useState("");
//   const [isValidEmail, setIsValidEmail] = useState(false);
//   const [randomMeals, setRandomMeals] = useState([]);
//   const location = useLocation();

//   // Dictionary of allowed emails
//   const allowedEmails = {
//     "admin1@example.com": true,
//     "researcher2@example.com": true,
//     "analyst3@example.com": true,
//     "manager4@example.com": true,
//   };

//   useEffect(() => {
//     // Check if we're on the special path
//     if (location.pathname === "/download-csv-a-b-test-project2") {
//       // Check if email is already in localStorage
//       const savedEmail = localStorage.getItem("abTestEmail");
//       if (savedEmail && allowedEmails[savedEmail]) {
//         setEmail(savedEmail);
//         setIsValidEmail(true);
//       }
//       return; // Don't run the A/B test on this page
//     }

//     // Original A/B test code (only run on main page)
//     const randomView = Math.random() < 0.5 ? "grid" : "list";
//     setView(randomView);

//     fetch(`${base_url}/log`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         timestamp: new Date().toISOString(),
//         event: "assigned_variant",
//         variant: randomView,
//       }),
//     });

//     fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.meals) {
//           const mealsWithPrice = data.meals.map((meal) => ({
//             ...meal,
//             price: (Math.random() * 400 + 100).toFixed(0),
//           }));
//           setMeals(mealsWithPrice);

//           // Select 12 random meals
//           const shuffled = [...mealsWithPrice].sort(() => 0.5 - Math.random());
//           setRandomMeals(shuffled.slice(0, 12));
//         }
//       })
//       .catch((err) => console.error(err));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location]);

//   const handleOrderClick = (meal) => {
//     fetch(`${base_url}/log`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         timestamp: new Date().toISOString(),
//         event: "order_click",
//         variant: view,
//         meal: meal.strMeal,
//       }),
//     });

//     alert(`Ordered: ${meal.strMeal}`);
//   };

//   const handleEmailSubmit = (e) => {
//     e.preventDefault();
//     if (allowedEmails[email]) {
//       setIsValidEmail(true);
//       localStorage.setItem("abTestEmail", email);
//     } else {
//       alert("This email is not authorized to download the CSV.");
//     }
//   };

//   // If we're on the download page, show email form
//   if (location.pathname === "/download-csv-a-b-test-project2") {
//     return (
//       <div className="download-page">
//         <h1>Download A/B Test Results</h1>
//         {!isValidEmail ? (
//           <form onSubmit={handleEmailSubmit} className="email-form">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter authorized email"
//               required
//             />
//             <button type="submit">Verify Email</button>
//           </form>
//         ) : (
//           <div className="download-section">
//             <p>Access granted for: {email}</p>
//             {/* <button
//               onClick={() => {
//                 // Directly download the static CSV served from backend's public folder
//                 window.location.href = `${base_url}/ab_test_logs.csv`;
//               }}
//               className="export-btn"
//             >
//               ⬇ Download CSV
//             </button>
//              */}
//             {/* <button
//               onClick={async () => {
//                 try {
//                   const response = await fetch(`${base_url}/download`);
//                   if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                   }

//                   // Create blob and download
//                   const blob = await response.blob();
//                   const url = window.URL.createObjectURL(blob);
//                   const a = document.createElement("a");
//                   a.style.display = "none";
//                   a.href = url;
//                   a.download = "ab_test_results.csv";
//                   document.body.appendChild(a);
//                   a.click();
//                   window.URL.revokeObjectURL(url);
//                   document.body.removeChild(a);
//                 } catch (error) {
//                   console.error("Download failed:", error);
//                   alert("Failed to download CSV. Please try again.");
//                 }
//               }}
//               className="export-btn"
//             >
//               ⬇ Download CSV
//             </button> */}
//             <button
//               onClick={() => {
//                 console.log(
//                   "VITE_BACKEND_URL:",
//                   import.meta.env.VITE_BACKEND_URL
//                 );
//                 console.log("base_url:", base_url);
//                 console.log("Full URL:", `${base_url}/download`);

//                 // Try the download
//                 window.location.href = `${base_url}/download`;
//               }}
//               className="export-btn"
//             >
//               ⬇ Download CSV
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // Original A/B test UI
//   return (
//     <div className="app">
//       <header className="header">
//         <div className="header-content">
//           <div className="logo">
//             <div className="logo-icon">🍴</div>
//             <h1>Delicious Menu</h1>
//           </div>
//         </div>
//       </header>

//       <div className="view-indicator">
//         <div className="indicator-content">
//           <h2 className="view-title">
//             {view === "grid" ? "🔳 Grid Layout" : "📋 List Layout"}
//             <span className="meal-count">
//               ({randomMeals.length} delicious items)
//             </span>
//           </h2>
//           <div className="ab-badge">
//             A/B Test: {view === "grid" ? "Version A" : "Version B"}
//           </div>
//         </div>
//       </div>

//       <main className="main-content">
//         {view === "grid" ? (
//           <div className="meals-grid">
//             {randomMeals.map((meal) => (
//               <div key={meal.idMeal} className="meal-card">
//                 <div className="meal-image-container">
//                   <img
//                     src={meal.strMealThumb}
//                     alt={meal.strMeal}
//                     className="meal-image"
//                   />
//                   <div className="meal-category">{meal.strCategory}</div>
//                 </div>
//                 <div className="meal-info">
//                   <h3 className="meal-title">{meal.strMeal}</h3>
//                   <div className="meal-footer">
//                     <span className="meal-price">₹{meal.price}</span>
//                     <button
//                       className="order-btn"
//                       onClick={() => handleOrderClick(meal)}
//                     >
//                       Order Now
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="meals-list">
//             {randomMeals.map((meal) => (
//               <div key={meal.idMeal} className="meal-list-item">
//                 <div className="meal-list-image-container">
//                   <img
//                     src={meal.strMealThumb}
//                     alt={meal.strMeal}
//                     className="meal-list-image"
//                   />
//                 </div>
//                 <div className="meal-list-content">
//                   <div className="meal-list-info">
//                     <h3 className="meal-list-title">{meal.strMeal}</h3>
//                     <span className="meal-list-category">
//                       {meal.strCategory}
//                     </span>
//                   </div>
//                   <div className="meal-list-actions">
//                     <span className="meal-list-price">₹{meal.price}</span>
//                     <button
//                       className="order-btn"
//                       onClick={() => handleOrderClick(meal)}
//                     >
//                       Order Now
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       <footer className="footer">
//         <div className="footer-content">
//           🧪 A/B Testing Interface • Assigned View:{" "}
//           <span className="current-view">
//             {view.toUpperCase()} ({view === "grid" ? "Version A" : "Version B"})
//           </span>
//         </div>
//         <div className="flex flex-col items-center gap-3 mt-10">
//           <a
//             href="https://forms.gle/1KKz5WKmbNDCwB3y6"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="feedback-btn"
//           >
//             Fill our Feedback Form
//           </a>
//         </div>
//         <a href="/download-csv-a-b-test-project2" className="download-link">
//           Admin Access
//         </a>
//       </footer>
//     </div>
//   );
// }

// // App wrapper with Router
// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="*" element={<MainApp />} />
//       </Routes>
//     </Router>
//   );
// }
