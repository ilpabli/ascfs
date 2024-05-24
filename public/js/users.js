document
  .getElementById("deleteForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const userId = document.getElementById("userId").value;
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Usuario eliminado exitosamente");
      } else {
        console.error("Error al eliminar el Usuario");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  });

function actualizarRole() {
  const userid = document.getElementById("userid").value;
  const role = document.getElementById("Role").value;

  if (Object.keys(role).length === 0) {
    console.log("No se ha ingresado un role nuevo para el usuario.");
    return;
  }
  fetch(`/api/users/${userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }
      console.log("Usuario actualizado con éxito");
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
}
