document.getElementById('pix-button').addEventListener('click', function () {
    const selectedCredit = parseInt(document.getElementById('credit-menu').value);
    
    fetch(`https://script.google.com/macros/s/AKfycbwLgCpcZFSjRHkCc_zqHeZpfcnohupGHsI8e3FOgVjhXVQjfCq9s_IoODbvPe_d_0ZEEw/exec?valor=${selectedCredit}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('qrcode').src = `data:image/png;base64,${data.qr_code_base64}`;
            document.getElementById('qrcode').style.display = 'block';
            const paymentId = data.payment_id;

            // Inicia o cronômetro e a verificação de pagamento
            startCountdown(60);
            checkPaymentStatus(paymentId);
        })
        .catch(error => console.error('Erro ao gerar cobrança Pix:', error));
});

function startCountdown(seconds) {
    let timeLeft = seconds;
    const timerDisplay = document.getElementById('timer');
    
    const countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerHTML = `Aguarde ${timeLeft} segundos para concluir o pagamento...`;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timerDisplay.innerHTML = 'Tempo expirado. Por favor, gere um novo pagamento Pix.';
        }
    }, 1000);
}

function checkPaymentStatus(paymentId) {
    const intervalId = setInterval(() => {
        fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?paymentId=${paymentId}`)
            .then(response => response.json())
            .then(status => {
                if (status === 'Pagamento aprovado! Tentativas liberadas.') {
                    clearInterval(intervalId);
                    enableBoard();
                }
            })
            .catch(error => console.error('Erro ao verificar pagamento:', error));
    }, 5000);
}

function enableBoard() {
    document.getElementById('game-liberado').style.display = 'block';
    document.getElementById('timer').style.display = 'none';
}
