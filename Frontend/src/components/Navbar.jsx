import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar bg-base-300 shadow-lg px-5">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold uppercase">Legal Eyes</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 font-semibold">
          <li><Link to="/upload">Upload</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </div>
  );
}