import './App.css'
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import About from "./pages/About.jsx";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';

function Layout() {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <Home />
                },
                {
                    path: 'contact',
                    element: <Contact />
                },
                {
                    path: 'about',
                    element: <About />
                }
            ]
        }
    ])

    return (
        <RouterProvider router={router} />
    )
}

export default App
