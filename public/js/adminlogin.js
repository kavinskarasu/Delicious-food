const login = async (email, password) => {
  let res = axios({
    method: "POST",
    url: "http://127.0.0.1:4000/api/v1/users/adminlogin",
    data: {
      email,
      password,
    },
  })
    .then((data) => {
      {
        alert("logged in successfully");
        window.setTimeout(() => {
          location.assign("/api/v1/views/adminOverview");
        }, 1500);
      }
    })
    .catch((err) => {
      if (err.response.status == 401) {
        alert("Incorrect email or password");
      } else if (err.response.status == 403) {
        alert("Admin can only access this page");
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
