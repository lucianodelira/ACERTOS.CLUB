document.getElementById("pix-button").addEventListener("click", async () => {
    const credits = document.getElementById("credit-menu").value;

    // Enviar requisição ao Apps Script para gerar QR Code Pix
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwLgCpcZFSjRHkCc_zqHeZpfcnohupGHsI8e3FOgVjhXVQjfCq9s_IoODbvPe_d_0ZEEw/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "generatePix",
                credits: credits,
            }),
        });

        const result = await response.json();
        if (result.success) {
            document.getElementById("qrcode").src = result.qrCodeUrl;
            document.getElementById("qrcode").style.display = "block";
            document.getElementById("pix-key").innerText = `Chave Pix: ${result.pixKey}`;
            document.getElementById("pix-key").style.display = "block";

            // Verifica pagamento periodicamente
            checkPayment(result.paymentId);
        } else {
            alert("Erro ao gerar Pix. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar ao servidor.");
    }
});

// Função para verificar o status do pagamento
async function checkPayment(paymentId) {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwLgCpcZFSjRHkCc_zqHeZpfcnohupGHsI8e3FOgVjhXVQjfCq9s_IoODbvPe_d_0ZEEw/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "checkPayment",
                paymentId: paymentId,
            }),
        });

        const result = await response.json();
        if (result.success) {
            if (result.status === "approved") {
                document.getElementById("game-liberado").style.display = "block";
                clearInterval(paymentInterval);
            }
        } else {
            console.error("Erro ao verificar pagamento:", result.message);
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}
