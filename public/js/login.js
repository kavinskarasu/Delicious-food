const login = async (email, password) => {
  //   try {
  //     var res = await axios({
  //       method: "POST",
  //       url: "http://127.0.0.1:4000/api/v1/users/login",
  //       data: {
  //         email,
  //         password,
  //       },
  //     });
  //
  //     }
  //   } catch (err) {
  //     if (err.responce.status == 401 || err.responce.status == 400) {
  //       alert("Incorrect email or password");
  //     }
  //   }
  // };
  let res = axios({
    method: "POST",
    url: "http://127.0.0.1:4000/api/v1/users/login",
    data: {
      email,
      password,
    },
  })
    .then((data) => {
      {
        alert("logged in successfully");
        window.setTimeout(() => {
          location.assign("/api/v1/views/overview");
        }, 1500);
      }
    })
    .catch((err) => {
      if (err.response.status == 401 || err.response.status == 403) {
        alert("Incorrect email or password");
      } else if (err.response.status == 400) {
        alert("please provide your email and password");
      }
    });
};

document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  let email = document.getElementById("floatingInput").value;
  let password = document.getElementById("floatingPassword").value;
  console.log(email, password);
  login(email, password);
});
