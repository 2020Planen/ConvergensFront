import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import logo from "../../pictures/Logo.png"
import "./ChooseRealm.css";

function Welcome() {
  const [realm, setRealm] = useState("");
  const [redirect, setRedirect] = useState(false);

  return (
    <div className="outer">
      <div className="main">
        <img className="image" src={logo} alt="convergens logo" ></img>
        <p className="sign" align="center">
          Hovedopgaven
        </p>

        <select
          className="un "
          id="realm"
          onChange={e => setRealm(e.target.value)}
        >
          <option value="">vælg realm</option>
          <option value="odense">odense</option>
          <option value="lyngby">lyngby</option>
        </select>
        {realm !== "" ? (
          <button
            className="submit"
            onClick={() => {
              localStorage.setItem("realm", realm);
              setTimeout(() => {
                setRedirect(true);
              }, 200);
            }}
          >
            gå til login
          </button>
        ) : null}
        {redirect ? <Redirect to="/secured" /> : null}
      </div>
    </div>
  );
}

export default Welcome;
