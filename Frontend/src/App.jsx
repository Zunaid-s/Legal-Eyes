import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Upload from "./pages/Upload";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      {}
      <div className="min-h-screen bg-base-100 text-base-content font-sans">
        
        {}
        <Navbar />
        {}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {}
            <Route 
              path="/" 
              element={
                <div className="hero mt-20">
                  <div className="hero-content text-center">
                    <div className="max-w-md">
                      <h1 className="text-5xl font-bold text-primary">Legal Eyes</h1>
                      <p className="py-6 text-lg">
                        Welcome to the next generation legal document management system. 
                        Secure, fast, and intelligent.
                      </p>
                      <button className="btn btn-primary">Get Started</button>
                    </div>
                  </div>
                </div>
              } 
            />

            {}
            <Route path="/upload" element={<Upload />} />
            {}
            <Route path="/contact" element={<Contact />} />
            {}
            <Route 
              path="*" 
              element={
                <div className="text-center mt-20">
                  <h2 className="text-4xl font-bold">404 - Page Not Found</h2>
                </div>
              } 
            />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;