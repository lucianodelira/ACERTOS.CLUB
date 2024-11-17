const scriptUrl = 'https://script.google.com/macros/s/AKfycbwLgCpcZFSjRHkCc_zqHeZpfcnohupGHsI8e3FOgVjhXVQjfCq9s_IoODbvPe_d_0ZEEw/exec'; // URL do Google Apps Script

        // Função que inicializa o jogo
        function initGame() {
            // Configuração do jogo de minas
            const board = document.getElementById('minesweeper-board');
            board.innerHTML = ''; // Limpa o tabuleiro

            // Lógica do tabuleiro de minas e eventos de clique
        }

        // Função para gerar cobrança Pix e interagir com o Google Apps Script
        function gerarPix(valor) {
            fetch(scriptUrl, {
                method: 'POST',
                body: JSON.stringify({ action: 'criarCobrancaPix', valor: valor }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                const qrcodeImg = document.getElementById('qrcode-img');
                qrcodeImg.src = `data:image/png;base64,${data.qr_code_base64}`;
                document.getElementById('qrcode-container').style.display = 'block';
                const pixKeyDisplay = document.getElementById('pix-key');
                pixKeyDisplay.innerText = data.pix_key;
                document.getElementById('pix-key-display').style.display = 'block';
                startCountdown(60); // Iniciar cronômetro
            })
            .catch(error => {
                console.error('Erro ao enviar solicitação para o Google Apps Script:', error);
            });
        }

        // Função para iniciar o cronômetro
        function startCountdown(seconds) {
            let countdown = seconds;
            const timerDisplay = document.getElementById('timer-display');
            timerDisplay.innerText = `Tempo restante: ${countdown} segundos`;

            const interval = setInterval(() => {
                countdown--;
                timerDisplay.innerText = `Tempo restante: ${countdown} segundos`;
                if (countdown <= 0) {
                    clearInterval(interval);
                    timerDisplay.innerText = 'Tempo esgotado!';
                }
            }, 1000);
        }

        // Lógica do botão Pix
        document.getElementById('pix-button').addEventListener('click', function() {
            const selectedCredit = 5; // Exemplo de valor, pode ser dinâmico
            gerarPix(selectedCredit);
        });

        // Inicializa o jogo
        initGame();
