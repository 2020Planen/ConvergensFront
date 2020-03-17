function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

class SendJson {
  upload = (url, data, file) => {
    var formData = new FormData();

    formData.append("data", data);
    formData.append("uploadedFile", file);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      },
      body: formData
    })
      .then(response => response.json())
      .catch(error => console.error("Error:", error))
      .then(response => console.log("Success:", JSON.stringify(response)));
  };

  // url = fuld url opt = string (GET/POST) data = json som string
  SendJson = (url, opt, data) => {
    const options = this.makeOptions(opt, data);
    return fetch(url, options)
      .then(handleHttpErrors)
      .then(res => {
        return res;
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
      opts.body = body;
    }
    return opts;
  }
}

const facade = new SendJson();
export default facade;
