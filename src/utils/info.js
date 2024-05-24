export const generateProductErrorInfo = (product) => {
  return `
    Error con el Producto:
    Titulo > ${product.title} 
    Descripcion> ${product.description} 
    Precio> ${product.price}
    Codigo> ${product.code}
    Stock> ${product.stock}
    Categoria> ${product.category}`;
};

export const updateUserErrorInfo = (email) => {
  return `
    Error con el usuario:
    E-mail> ${email}`;
};

export const updateRoleError = (email) => {
  return `
    Te falta documentacion por cargar:
    E-mail> ${email}`;
};

export const invalidTotalErrorInfo = (total) => {
  return `
    Error con el monto a pagar:
    El total es = ${total}`;
};
