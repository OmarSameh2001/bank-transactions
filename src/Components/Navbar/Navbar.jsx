import React from "react";

export default function Navbar() {
  return (
    <div style={{backgroundColor: "#c8f1ff", padding: "10px", display: "flex", alignItems: "center"}}>
      <img src="./route.jpg" alt="logo" style={{ width: "100px", height: "57px", marginRight: "10px" }}/>
      <h1 className="heading" style={{ margin: "0"}}>
        Route Bank
      </h1>
    </div>
  );
}
