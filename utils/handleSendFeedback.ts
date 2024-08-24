

/*
https://docs.google.com/forms/d/e/1FAIpQLSei72emhE3Hgj-lwKkzTh2SQiabaRTWXTSLwSEOZV93VzHzuA/formResponse?submit=Submit&usp=pp_url&entry.999074890=-&entry.1287369822=fede.valle04@gmail.com&entry.663830842=-
*/

export const handleSendFeedback = async (name, email, comment) => {
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLSei72emhE3Hgj-lwKkzTh2SQiabaRTWXTSLwSEOZV93VzHzuA/formResponse';
    
    // Define los datos que deseas enviar (con los nombres de los campos del formulario)
    const formData = new URLSearchParams();
    formData.append('entry.999074890', '-');
    formData.append('entry.1287369822', 'fede.valle02@gmail.com');
    formData.append('entry.663830842', 'Comentario');

    // Enviar la solicitud POST
    try {
      const response = await fetch(`${url}?submit=Submit&usp=pp_url`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        console.log('Datos enviados correctamente');
      } else {
        console.error('Error al enviar los datos', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar los datos', error);
    }
    
}