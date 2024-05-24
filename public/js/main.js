document
  .getElementById("deleteForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const productId = document.getElementById("productId").value;
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Producto eliminado exitosamente");
      } else {
        console.error("Error al eliminar el producto");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  });

function actualizarProducto() {
  const productId = document.getElementById("productid").value;
  const productoActualizado = {};
  const title = document.getElementById("title-up").value;
  if (title.trim() !== "") {
    productoActualizado.title = title;
  }

  const description = document.getElementById("description-up").value;
  if (description.trim() !== "") {
    productoActualizado.description = description;
  }

  const code = document.getElementById("code-up").value;
  if (code.trim() !== "") {
    productoActualizado.code = code;
  }

  const stock = document.getElementById("stock-up").value;
  if (stock.trim() !== "") {
    productoActualizado.stock = parseInt(stock);
  }

  const price = document.getElementById("price-up").value;
  if (price.trim() !== "") {
    productoActualizado.price = parseInt(price);
  }

  const category = document.getElementById("category-up").value;
  if (category.trim() !== "") {
    productoActualizado.category = category;
  }

  if (Object.keys(productoActualizado).length === 0) {
    console.log("No se han ingresado datos para actualizar el producto.");
    return;
  }
  fetch(`/api/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productoActualizado),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }
      console.log("Producto actualizado con éxito");
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
}
