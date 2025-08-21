import { AxiosError } from 'axios';

export function handleErrorAxios(error: AxiosError<any>): string {
  if (error.response && error.response.data) {
    const data = error.response.data;
    const messages = [];
    for (const key in data) {
      if (Array.isArray(data[key])) {
        messages.push(`${key}: ${data[key].join(', ')}`);
      } else if (typeof data[key] === 'string') {
        messages.push(`${key}: ${data[key]}`);
      }
    }
    return messages.join(' | ');
  }
  return 'Ocurrió un error inesperado.';
}