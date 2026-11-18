document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('markdown-content');

    async function loadMarkdown() {
        try {
            const response = await fetch('PLANTILLA.md');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const markdownText = await response.text();
            let html = marked.parse(markdownText);
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            const blockquotes = tempDiv.querySelectorAll('blockquote');
            
            blockquotes.forEach(bq => {
                const paragraphs = bq.querySelectorAll('p');
                
                if (paragraphs.length > 1) {
                    const fragment = document.createDocumentFragment();
                    
                    paragraphs.forEach(p => {
                        // 🛡️ PROTECCIÓN: Si el párrafo está vacío, no lo procesamos
                        if (!p.textContent.trim()) return; 
                        
                        const newContainer = document.createElement('div');
                        newContainer.className = 'quote-container'; 
                        
                        const newBq = document.createElement('blockquote');
                        newBq.innerHTML = p.innerHTML;
                        
                        newContainer.appendChild(newBq);
                        fragment.appendChild(newContainer);
                    });
                    
                    bq.replaceWith(fragment);
                } else {
                    // También aplicamos la protección aquí por si acaso
                    if (paragraphs[0] && paragraphs[0].textContent.trim()) {
                        bq.classList.add('quote-container');
                    } else {
                        bq.remove(); // Elimina blockquotes completamente vacíos
                    }
                }
            });

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