function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

class SendJson {
  uploadFiles = (url, data, files) => {
    var formData = new FormData();

    formData.append(
      "data",
      new Blob([data], { type: "application/json; charset=utf8" })
    );

    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        formData.append("uploadedFile", files[i]);
      }
    } else {
      formData.append("uploadedFile", null);
    }
    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch(async (error) => {
        const msg = await error.text().then((errorMessage) => {
          return errorMessage;
        });
        throw msg;
      });
    /*
      .then(handleHttpErrors)
      .then((res) => {
        return res;
      });*/
  };

  SendWithTokenIdRev = (gateUrl, url, opt, data) => {
    const options = this.makeTokenOptions(opt, data, url);
    return fetch(gateUrl, options)
      .then(handleHttpErrors)
      .then((res) => {
        return res;
      });
  };

  SendWithToken = (url, opt, data) => {
    const options = this.makeTokenOptions(opt, data, url);
    return fetch(process.env.REACT_APP_GATEWAY_URL, options)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch(async (error) => {
        const msg = await error.text().then((errorMessage) => {
          return errorMessage;
        });
        throw msg;
      });
  };

  makeTokenOptions(method, body, url) {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("keycloak-token"),
        "target-base-uri": url,
        Accept: "application/json",
      },
    };
    if (body) {
      //opts.body = JSON.stringify(body);
      opts.body = body;
    }
    return opts;
  }

  // url = fuld url opt = string (GET/POST) data = json som string
  SendJson = (url, opt, data) => {
    const options = this.makeOptions(opt, data);
    return fetch(url, options)
      .then(handleHttpErrors)
      .then((res) => {
        return res;
      });
  };

  makeOptions(method, body) {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
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
