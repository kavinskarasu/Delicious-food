const post = (name, price, image, description) => {
  let res = axios({
    method: "POST",
    url: "http://127.0.0.1:4000/api/v1/prodects/",
    data: {
      name,
      price,
      image,
      description,
    },
  })
    .then((data) => {
      {
        alert("Item added to the database");
      }
    })
    .catch((err) => {
      alert(err);
    });
};

document.querySelector("form").addEventListener("click", function(e) {
  e.preventDefault();

  const name = document.querySelector(".name").value;
  const price = document.querySelector(".price").value;
  const image = document.querySelector(".image").value;
  const description = document.querySelector(".description").value;

  post(name, price, image, description);
});
