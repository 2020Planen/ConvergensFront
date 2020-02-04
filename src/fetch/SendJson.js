const URL = "http://localhost:8080/receiver/address";

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

class SendJson {


    // opt = string (GET/POST) data = json Obj
    SendJson = (opt, data) => {
    const options = this.makeOptions(opt, data);
    return fetch(URL, options)
      .then(handleHttpErrors)
      .then(res => {
        console.log(res)
      });
  };


  makeOptions(method, body) {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (body) {
      //opts.body = JSON.stringify(body);
      opts.body = body
    }
    return opts;
  }
}

const facade = new SendJson();
export default facade;