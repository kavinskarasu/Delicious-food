const post = (name, price, image, description) => {
  let res = axios({
    method: "POST",
    url: "/api/v1/prodects/",
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

document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.querySelector(".name-1").value;
  const price = document.querySelector(".price-1").value;
  const description = document.querySelector(".des").value;
  const image = document.querySelector(".image-1").value;

  post(name, price, image, description);
});
