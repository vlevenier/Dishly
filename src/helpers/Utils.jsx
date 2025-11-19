import toast from "react-hot-toast";

export function MostrarError(error){
  if (!error) {
    toast.error('Error no especificado');
    return 'Error no especificado';
  }
  
  if(typeof error === 'string' || error instanceof String){
    toast.error('Error: ' + error);
    return;
  }

  let mensajeError = 'Error no especificado';

  if (error.response) {
    mensajeError = obtenerMensajeErrorResponse(error);
    if([401,403].indexOf(error.response.status) >= 0 ){
      redirectToLogin();
    }
  } else if (error.request) {
    mensajeError = 'No hay respuesta del servidor';
  } else if(error.message) {
    mensajeError += '. Detalle: ' + error.message;
  } else if (error.Message){
    mensajeError = error.Message;  
  }
  toast.error(mensajeError);
  return mensajeError;
}


const obtenerMensajeErrorResponse = (error) => {
  let mensajeError = `Error ${error.response.status}. `;
  let mensaje = error.response.data?.message || error.response.data?.Message;
  mensajeError += mensaje ?? error.response.statusText;
  return mensajeError;
}
