$("#product-form").submit(function agregarProducto(e) {
  e.preventDefault();
  const postData = {
    name: $("#name").val(),
    description: $("#description").val(),
  };
  $.post("./backend/product-add.php", postData, function (response) {
    console.log(response);
    let template_bar = "";
    template_bar += `
          <li style="list-style: none;">status: ${response.status}</li>
          <li style="list-style: none;">message: ${response.message}</li>
        `;
    $("#product-result").addClass("card my-4 d-block").show();
    $("#container").html(template_bar);
    $("#product-form").trigger("reset");
    // SE LISTAN TODOS LOS PRODUCTOS
    listarProductos();
  });
});