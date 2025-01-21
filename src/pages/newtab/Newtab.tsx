import React from "react";
import logo from "@assets/img/logo.svg";
import "@pages/newtab/Newtab.css";
import { Dashboard } from "../content/components/Dashboard";
export default function Newtab() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <Dashboard />
        </p>
      </header>
    </div>
  );
}
