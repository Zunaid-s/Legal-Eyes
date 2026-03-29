import React from 'react'
import './App.css'
import Contact from "./contact.jsx";
import Home from "./home.jsx";
import About from "./about.jsx";
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      page: "home"
    }
  }

  changePage(newPage) {
      this.setState({
          page: newPage
      });
  }
  render() {
    return (
        <div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-2 border-black" onClick={()=>{this.changePage("home")}}>Home</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-2 border-black" onClick={()=>{this.changePage("about")}}>About</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-2 border-black" onClick={()=>{this.changePage("contact")}}>Contact</button>

            {this.state.page === "home" && <Home />}
            {this.state.page === "about" && <About />}
            {this.state.page === "contact" && <Contact />}
        </div>
    )
  }
}


export default App
