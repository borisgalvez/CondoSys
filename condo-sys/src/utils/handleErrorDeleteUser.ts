export function showUserActions(usuario: Record<string, any>): string {
  const acciones: string[] = [];
  if (usuario.propietarios)
    acciones.push(
      `es propietario de ${usuario.propietarios} ${
        usuario.propietarios > 1 ? "apartamentos" : "apartamento"
      }`
    );
  if (usuario.inquilinos)
    acciones.push(
      `es inquilino en ${usuario.inquilinos} ${
        usuario.inquilinos > 1 ? "apartamentos" : "apartamento"
      }`
    );
  if (usuario.registro_pagos)
    acciones.push(
      `registro un total de ${usuario.registro_pagos} ${
        usuario.registro_pagos > 1 ? "pagos" : "pago"
      }`
    );
  if (usuario.actualizo_la_configuracion)
    acciones.push(
      `actualizó la configuración ${usuario.actualizo_la_configuracion} ${
        usuario.actualizo_la_configuracion > 1 ? "veces" : "vez"
      }`
    );
  if (acciones.length === 0) {
    return "No se encontraron acciones registradas.";
  }
  return "El usuario " + acciones.join(", ") + ".";
}
