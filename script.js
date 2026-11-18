document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('markdown-content');

    async function loadMarkdown() {
        try {
            const response = await fetch('PLANTILLA.md');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const markdownText = await response.text();
            
            // 1. Renderizamos el Markdown a HTML normal
            let html = marked.parse(markdownText);
            
            // 2. Creamos un elemento temporal en memoria para manipular el HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // 3. Buscamos todos los blockquotes (los que genera el ">")
            const blockquotes = tempDiv.querySelectorAll('blockquote');
            
            blockquotes.forEach(bq => {
                // Obtenemos todos los párrafos (<p>) dentro de este blockquote
                const paragraphs = bq.querySelectorAll('p');
                
                // Si hay más de un párrafo, los separamos en contenedores distintos
                if (paragraphs.length > 1) {
                    const fragment = document.createDocumentFragment();
                    
                    paragraphs.forEach(p => {
                        // Creamos un contenedor distinto para cada párrafo
                        const newContainer = document.createElement('div');
                        newContainer.className = 'quote-container'; 
                        
                        // Creamos un blockquote individual para mantener el estilo base
                        const newBq = document.createElement('blockquote');
                        newBq.innerHTML = p.innerHTML;
                        
                        newContainer.appendChild(newBq);
                        fragment.appendChild(newContainer);
                    });
                    
                    // Reemplazamos el blockquote original (agrupado) por los nuevos separados
                    bq.replaceWith(fragment);
                } else {
                    // Si solo hay un párrafo, solo le añadimos la clase para que tenga el mismo estilo
                    bq.classList.add('quote-container');
                }
            });

            // 4. Inyectamos el HTML ya procesado y separado en la página
            contentDiv.innerHTML = tempDiv.innerHTML;
            
        } catch (error) {
            console.error('Error al cargar PLANTILLA.md:', error);
            contentDiv.innerHTML = `
                <div class="error-box">
                    <h3>⚠️ Ups, algo salió mal</h3>
                    <p>No pudimos cargar la información de <code>PLANTILLA.md</code>.</p>
                    <p><small>Detalles: ${error.message}</small></p>
                </div>
            `;
        }
    }

    loadMarkdown();
});
