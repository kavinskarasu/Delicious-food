const login = async (email, password) => {
  let res = axios({
    method: "POST",
    url: "/api/v1/users/login",
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

  login(email, password);
});
