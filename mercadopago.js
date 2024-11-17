const scriptUrl = 'https://script.google.com/macros/s/AKfycbwLgCpcZFSjRHkCc_zqHeZpfcnohupGHsI8e3FOgVjhXVQjfCq9s_IoODbvPe_d_0ZEEw/exec; // Substitua pela URL do seu Apps Script publicado

        document.getElementById('pagar').addEventListener('click', async () => {
            const valor = document.getElementById('valor').value;
            if (!valor) {
                alert('Por favor, insira um valor.');
                return;
            }

            try {
                const response = await fetch(`${scriptUrl}?valor=${valor}`);
                const data = await response.json();

                if (data.qr_code_base64) {
                    document.getElementById('resultado').innerHTML = `
                        <p>Código PIX gerado:</p>
                        <img src="data:image/png;base64,${data.qr_code_base64}" alt="QR Code">
                        <p>Chave Pix: ${data.pix_key}</p>
                        <p>ID do Pagamento: ${data.payment_id}</p>
                    `;
                } else {
                    document.getElementById('resultado').textContent = 'Erro ao gerar o PIX.';
                }
            } catch (error) {
                console.error('Erro:', error);
                document.getElementById('resultado').textContent = 'Erro ao processar a solicitação.';
            }
        });
