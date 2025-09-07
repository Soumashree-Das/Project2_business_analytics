// //v1

// // import { useState, useEffect } from "react";
// // import "./index.css";

// // export default function App() {
// //   const [meals, setMeals] = useState([]);
// //   const [view, setView] = useState("");
// //   const [logs, setLogs] = useState([]); // store A/B events

// //   useEffect(() => {
// //     // Random assignment: 50% grid, 50% list
// //     const randomView = Math.random() < 0.5 ? "grid" : "list";
// //     setView(randomView);

// //     // Log assignment to backend
// //     fetch(`${base_url}/log", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         timestamp: new Date().toISOString(),
// //         event: "assigned_variant",
// //         variant: randomView,
// //       }),
// //     });

// //     // ✅ Fetch meals from API
// //     fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c")
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (data.meals) {
// //           const mealsWithPrice = data.meals.map((meal) => ({
// //             ...meal,
// //             price: (Math.random() * 400 + 100).toFixed(0), // ₹100–₹500
// //           }));
// //           setMeals(mealsWithPrice);
// //         }
// //       })
// //       .catch((err) => console.error(err));
// //   }, []);

// //   // Track clicks on "Order Now"
// //   const handleOrderClick = (meal) => {
// //     fetch(`${base_url}/log", {
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

// //   // Export logs to CSV
// //   const exportToCSV = () => {
// //     const headers = ["timestamp", "event", "variant", "meal"];
// //     const rows = logs.map((log) => [
// //       log.timestamp,
// //       log.event,
// //       log.variant,
// //       log.meal || "",
// //     ]);
// //     const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

// //     const blob = new Blob([csvContent], { type: "text/csv" });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = "ab_test_results.csv";
// //     a.click();
// //   };

// //   return (
// //     <div className="app">
// //       {/* Header */}
// //       <header className="header">
// //         <div className="header-content">
// //           <div className="logo">
// //             <div className="logo-icon">🍴</div>
// //             <h1>Delicious Menu</h1>
// //           </div>
// //         </div>
// //       </header>

// //       {/* View Indicator */}
// //       <div className="view-indicator">
// //         <div className="indicator-content">
// //           <h2 className="view-title">
// //             {view === "grid" ? "🔳 Grid Layout" : "📋 List Layout"}
// //             <span className="meal-count">({meals.length} delicious items)</span>
// //           </h2>
// //           <div className="ab-badge">
// //             A/B Test: {view === "grid" ? "Version A" : "Version B"}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Meals Section */}
// //       <main className="main-content">
// //         {view === "grid" ? (
// //           <div className="meals-grid">
// //             {meals.map((meal) => (
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
// //             {meals.map((meal) => (
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

// //       {/* Footer */}
// //       <footer className="footer">
// //         <div className="footer-content">
// //           🧪 A/B Testing Interface • Assigned View:{" "}
// //           <span className="current-view">
// //             {view.toUpperCase()} ({view === "grid" ? "Version A" : "Version B"})
// //           </span>
// //         </div>
// //         {/* <button onClick={exportToCSV} className="export-btn">⬇ Export Results</button> */}
// //         <button
// //           onClick={() =>
// //             (window.location.href = `${base_url}/download")
// //           }
// //           className="export-btn"
// //         >
// //           ⬇ Download Logs
// //         </button>
// //       </footer>
// //     </div>
// //   );
// // }

// //v2

// // import { useState, useEffect } from "react";
// // import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// // import "./index.css";

// // // Main App Component
// // function MainApp() {
// //   const [meals, setMeals] = useState([]);
// //   const [view, setView] = useState("");
// //   const [logs, setLogs] = useState([]);
// //   const [email, setEmail] = useState("");
// //   const [isValidEmail, setIsValidEmail] = useState(false);
// //   const location = useLocation();

// //   useEffect(() => {
// //     // Check if we're on the special path
// //     if (location.pathname === "/download-csv-a-b-test-project2") {
// //       // Check if email is already in localStorage
// //       const savedEmail = localStorage.getItem('abTestEmail');
// //       if (savedEmail && savedEmail.endsWith('@example.com')) {
// //         setEmail(savedEmail);
// //         setIsValidEmail(true);
// //       }
// //       return; // Don't run the A/B test on this page
// //     }

// //     // Original A/B test code (only run on main page)
// //     const randomView = Math.random() < 0.5 ? "grid" : "list";
// //     setView(randomView);

// //     fetch(`${base_url}/log", {
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
// //         }
// //       })
// //       .catch((err) => console.error(err));
// //   }, [location]);

// //   const handleOrderClick = (meal) => {
// //     fetch(`${base_url}/log", {
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
// //     if (email.endsWith('@example.com')) {
// //       setIsValidEmail(true);
// //       localStorage.setItem('abTestEmail', email);
// //     } else {
// //       alert("Only @example.com emails are allowed to download the CSV.");
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
// //               placeholder="Enter your @example.com email"
// //               required
// //             />
// //             <button type="submit">Verify Email</button>
// //           </form>
// //         ) : (
// //           <div className="download-section">
// //             <p>Access granted for: {email}</p>
// //             <button
// //               onClick={() => (window.location.href = `${base_url}/download")}
// //               className="export-btn"
// //             >
// //               ⬇ Download CSV
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }

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
// //             <span className="meal-count">({meals.length} delicious items)</span>
// //           </h2>
// //           <div className="ab-badge">
// //             A/B Test: {view === "grid" ? "Version A" : "Version B"}
// //           </div>
// //         </div>
// //       </div>

// //       <main className="main-content">
// //         {view === "grid" ? (
// //           <div className="meals-grid">
// //             {meals.map((meal) => (
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
// //             {meals.map((meal) => (
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
// //         <a href="/download-csv-a-b-test-project2" className="download-link">
// //           Admin Access
// //         </a>
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

// //v4
// // import { useState, useEffect } from "react";
// // import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// // import "./index.css";

// // // Main App Component
// // function MainApp() {
// //   const [meals, setMeals] = useState([]);
// //   const [view, setView] = useState("");
// //   const [logs, setLogs] = useState([]);
// //   const [email, setEmail] = useState("");
// //   const [isValidEmail, setIsValidEmail] = useState(false);
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

// //     fetch(`${base_url}/log", {
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
// //         }
// //       })
// //       .catch((err) => console.error(err));
// //   }, [location]);

// //   const handleOrderClick = (meal) => {
// //     fetch(`${base_url}/log", {
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
// //               onClick={() => (window.location.href = `${base_url}/download")}
// //               className="export-btn"
// //             >
// //               ⬇ Download CSV
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }

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
// //             <span className="meal-count">({10} delicious items)</span>
// //           </h2>
// //           <div className="ab-badge">
// //             A/B Test: {view === "grid" ? "Version A" : "Version B"}
// //           </div>
// //         </div>
// //       </div>

// //       <main className="main-content">
// //         {view === "grid" ? (
// //           <div className="meals-grid">
// //             {meals.map((meal) => (
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
// //             {meals.map((meal) => (
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
// //         <a href="/download-csv-a-b-test-project2" className="download-link">
// //           Admin Access
// //         </a>
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
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import "./index.css";

// const base_url = import.meta.env.VITE_BACKEND_URL;

// // Main App Component
// function MainApp() {
//   const [, setMeals] = useState([]);
//   const [view, setView] = useState("");
//   //const [logs, setLogs] = useState([]);
//   const [email, setEmail] = useState("");
//   const [isValidEmail, setIsValidEmail] = useState(false);
//   const [randomMeals, setRandomMeals] = useState([]);
//   const location = useLocation();

//   // Dictionary of allowed emails
//   const allowedEmails = {
//     "admin1@example.com": true,
//     "researcher2@example.com": true,
//     "analyst3@example.com": true,
//     "manager4@example.com": true
//   };

//   useEffect(() => {
//     // Check if we're on the special path
//     if (location.pathname === "/download-csv-a-b-test-project2") {
//       // Check if email is already in localStorage
//       const savedEmail = localStorage.getItem('abTestEmail');
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

//           // Select 10 random meals
//           const shuffled = [...mealsWithPrice].sort(() => 0.5 - Math.random());
//           setRandomMeals(shuffled.slice(0, 12));
//         }
//       })
//       .catch((err) => console.error(err));
//       // eslint-disable-next-line react-hooks/exhaustive-deps
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
//       localStorage.setItem('abTestEmail', email);
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
//             <button
//               onClick={() => (window.location.href = `${base_url}/download`)}
//               className="export-btn"
//             >
//               ⬇ Download CSV
//             </button>
//           </div>
//         )}
//       </div>
//     );
// }

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
//             <span className="meal-count">({randomMeals.length} delicious items)</span>
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
//           Fill our Feedback Form
//           </a>
//         </div>
//           <a href="/download-csv-a-b-test-project2" className="download-link">
//             Admin Access
//           </a>
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

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";

const base_url = import.meta.env.VITE_BACKEND_URL;

// Main App Component
function MainApp() {
  const [, setMeals] = useState([]);
  const [view, setView] = useState("");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [randomMeals, setRandomMeals] = useState([]);
  const location = useLocation();

  // Dictionary of allowed emails
  const allowedEmails = {
    "admin1@example.com": true,
    "researcher2@example.com": true,
    "analyst3@example.com": true,
    "manager4@example.com": true,
  };

  useEffect(() => {
    // Check if we're on the special path
    if (location.pathname === "/download-csv-a-b-test-project2") {
      // Check if email is already in localStorage
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

    fetch(`${base_url}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        event: "assigned_variant",
        variant: randomView,
      }),
    });

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
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleOrderClick = (meal) => {
    fetch(`${base_url}/log`, {
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

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (allowedEmails[email]) {
      setIsValidEmail(true);
      localStorage.setItem("abTestEmail", email);
    } else {
      alert("This email is not authorized to download the CSV.");
    }
  };

  // If we're on the download page, show email form
  if (location.pathname === "/download-csv-a-b-test-project2") {
    return (
      <div className="download-page">
        <h1>Download A/B Test Results</h1>
        {!isValidEmail ? (
          <form onSubmit={handleEmailSubmit} className="email-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter authorized email"
              required
            />
            <button type="submit">Verify Email</button>
          </form>
        ) : (
          <div className="download-section">
            <p>Access granted for: {email}</p>
            {/* <button
              onClick={() => {
                // Directly download the static CSV served from backend's public folder
                window.location.href = `${base_url}/ab_test_logs.csv`;
              }}
              className="export-btn"
            >
              ⬇ Download CSV
            </button>
             */}
            {/* <button
              onClick={async () => {
                try {
                  const response = await fetch(`${base_url}/download`);
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  // Create blob and download
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
                } catch (error) {
                  console.error("Download failed:", error);
                  alert("Failed to download CSV. Please try again.");
                }
              }}
              className="export-btn"
            >
              ⬇ Download CSV
            </button> */}
            <button
              onClick={() => {
                console.log(
                  "VITE_BACKEND_URL:",
                  import.meta.env.VITE_BACKEND_URL
                );
                console.log("base_url:", base_url);
                console.log("Full URL:", `${base_url}/download`);

                // Try the download
                window.location.href = `${base_url}/download`;
              }}
              className="export-btn"
            >
              ⬇ Download CSV
            </button>
          </div>
        )}
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
