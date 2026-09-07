/**
 * El QR no debe transportar datos personales ni objetos completos del evento.
 * Debe contener un token aleatorio o firmado que el backend pueda validar.
 */
export interface IQREvento {
  token: string;
}
