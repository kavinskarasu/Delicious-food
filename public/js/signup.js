const signup = (name, email, password) => {
  let res = axios({
    method: "POST",
    url: "/api/v1/users/signup",
    data: {
      name,
      email,
      password,
    },
  })
    .then((data) => {
      {
        window.setTimeout(() => {
          location.assign("/api/v1/views/notify");
        }, 1000);
      }
    })
    .catch((err) => {
      if (err.response.status == 401 || err.response.status == 403) {
        alert("Incorrect email or password");
      } else if (err.response.status == 400) {
        alert("please provide your email and password");
      }
      console.log(err);
    });
};

document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  let email = document.querySelector(".email").value;
  let name = document.querySelector(".name").value;
  let password = document.querySelector(".password").value;
  signup(name, email, password);
});
