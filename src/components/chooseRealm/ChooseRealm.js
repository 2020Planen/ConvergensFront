import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./ChooseRealm.css";

function Welcome() {
  const [realm, setRealm] = useState("");
  const [redirect, setRedirect] = useState(false);

  return (
    <div className="outer">
      <div className="main">
        <p className="sign" align="center">
          Vælg realm
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
