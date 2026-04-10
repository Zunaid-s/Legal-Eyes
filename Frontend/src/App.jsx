import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Upload from "./pages/Upload";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* DaisyUI Navbar */}
        <div className="navbar bg-base-300 shadow-lg px-5">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl font-bold">MyProject</Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Routes Configuration */}
        <Routes>
          <Route path="/" element={<div className="p-10"><h1>Welcome to Home Page</h1></div>} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;