document.addEventListener('DOMContentLoaded', function () {
    // Seleção de elementos do DOM
    const resultadoIcon = document.getElementById('resultadoIcon');
    const palpiteIcon = document.getElementById('palpiteIcon');
    const jogarIcon = document.getElementById('jogarIcon');
    const compartilharIcon = document.getElementById('compartilharIcon');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const expandMenu = document.getElementById('expandMenu');
    const contatoLink = document.getElementById('contatoLink');
    const instalarAppLink = document.getElementById('instalarAppLink');
const minasIcon = document.getElementById('minasIcon');
const minasSection = document.getElementById('minasSection');

    const selecionarNomeSection = document.getElementById('selecionarNome');
    const exibirResultadoSection = document.getElementById('exibirResultado');
    const modoPalpiteSection = document.getElementById('modoPalpite');
    const modoJogarSection = document.getElementById('modoJogar');
    const fecharIframeBtn = document.getElementById('fecharIframe'); // Novo botão de fechar

    const menuLoteriasDiv = document.getElementById('menuLoterias');
    const nomeSelecionadoHeader = document.getElementById('nomeSelecionado');
    const dropdownTitulos = document.getElementById('dropdownTitulos');
    const resultadosDiv = document.getElementById('resultados');
    const mostrarPalpiteBtn = document.getElementById('mostrarPalpiteBtn');
    const dropdownPalpite = document.getElementById('dropdownPalpite');
    const palpiteConteudoDiv = document.getElementById('palpiteConteudo');
    const frasesPalpitesDiv = document.getElementById('frasesPalpites');
    const selecionarLoteriaLink = document.getElementById('selecionarLoteriaLink');

    // Novas Seções de Conteúdo
    const comoFuncionaSection = document.getElementById('comoFunciona');
    const politicasPrivacidadeSection = document.getElementById('politicasPrivacidade');
    const termosServicoSection = document.getElementById('termosServico');
    const sobreSection = document.getElementById('sobre');

    // Chaves do localStorage
    const localStorageModeKey = 'appMode';
    const localStorageNameKey = 'lastSelectedName';
    const localStorageTitleKey = 'lastSelectedTitle';
    const localStorageSharedKey = 'hasShared'; // Nova chave para status de compartilhamento

    // Estado atual
    let currentMode = 'Resultado'; // Modo padrão
    let deferredPrompt; // Para armazenar o evento beforeinstallprompt

    // Função para esconder todas as seções
    function hideAllSections() {
        selecionarNomeSection.classList.add('hidden');
        exibirResultadoSection.classList.add('hidden');
        modoPalpiteSection.classList.add('hidden');
        modoJogarSection.classList.add('hidden');
        comoFuncionaSection.classList.add('hidden');
        politicasPrivacidadeSection.classList.add('hidden');
        termosServicoSection.classList.add('hidden');
        sobreSection.classList.add('hidden');
        fecharIframeBtn.classList.add('hidden'); // Esconde o botão de fechar
    }

    // Função para exibir a seção selecionada
    function showSection(section) {
        hideAllSections();
        section.classList.remove('hidden');
    }

    // Função para popular o menu vertical de loterias na seção 'Selecionar Loteria'
    function populateMenuLoterias() {
        menuLoteriasDiv.innerHTML = ''; // Limpa o menu existente

        if (!resultado) {
            menuLoteriasDiv.textContent = 'Dados indisponíveis.';
            return;
        }

        Object.keys(resultado).forEach(nome => {
            const btn = document.createElement('button');
            btn.classList.add('menu-loteria-item');
            btn.textContent = nome;
            btn.addEventListener('click', function () {
                selecionarLoteria(nome);
            });
            menuLoteriasDiv.appendChild(btn);
        });
    }

    // Função para selecionar uma loteria e exibir resultados
    function selecionarLoteria(nome) {
        if (!nome || !resultado[nome]) {
            alert('Loteria selecionada inválida.');
            return;
        }

        // Atualiza o localStorage
        localStorage.setItem(localStorageNameKey, nome);
        // Limpa o último título selecionado
        localStorage.removeItem(localStorageTitleKey);

        // Atualiza o header com o nome selecionado
        nomeSelecionadoHeader.textContent = nome;

        // Popula o dropdown de títulos
        populateDropdownTitulos(nome);

        // Seleciona o último título se existir
        setLastSelectedTitle(nome);

        // Exibe a seção de resultados
        showSection(exibirResultadoSection);
    }

    // Função para popular o dropdown de títulos
    function populateDropdownTitulos(nome) {
        dropdownTitulos.innerHTML = '<option value="" disabled selected>Selecione um título</option>'; // Inicialmente com uma opção
        dropdownTitulos.classList.add('hidden'); // Esconde o dropdown até que um título seja selecionado

        const titulos = resultado[nome].map(item => item.titulo);

        titulos.forEach(titulo => {
            const option = document.createElement('option');
            option.value = titulo;
            option.textContent = titulo;
            dropdownTitulos.appendChild(option);
        });
    }

    // Função para definir o último título selecionado
    function setLastSelectedTitle(nome) {
        const lastTitle = localStorage.getItem(localStorageTitleKey);
        if (lastTitle && resultado[nome].some(item => item.titulo === lastTitle)) {
            dropdownTitulos.value = lastTitle;
            displayResultado(nome, lastTitle);
            dropdownTitulos.classList.remove('hidden'); // Mostra o dropdown de títulos
        } else {
            // Seleciona o primeiro título
            if (resultado[nome].length > 0) {
                const primeiroTitulo = resultado[nome][0].titulo;
                dropdownTitulos.value = primeiroTitulo;
                displayResultado(nome, primeiroTitulo);
                dropdownTitulos.classList.remove('hidden'); // Mostra o dropdown de títulos
            }
        }
    }

    // Função para exibir o resultado baseado no nome e título
    function displayResultado(nome, titulo) {
        resultadosDiv.innerHTML = ''; // Limpa resultados anteriores

        const tituloObj = resultado[nome].find(item => item.titulo === titulo);
        if (!tituloObj) {
            resultadosDiv.textContent = 'Título não encontrado.';
            return;
        }

        const tabela = criarTabela(tituloObj.conteudo);
        resultadosDiv.appendChild(tabela);

        // Atualiza o localStorage com o título selecionado
        localStorage.setItem(localStorageTitleKey, titulo);

        // Mostra o dropdown de títulos
        dropdownTitulos.classList.remove('hidden');
    }

    // Função para criar uma tabela a partir do conteúdo
    function criarTabela(conteudo) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Cabeçalho da tabela
        const headerRow = document.createElement('tr');
        conteudo[0].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Corpo da tabela
        conteudo.slice(1).forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }

    // Função para lidar com a mudança de título no dropdown
    dropdownTitulos.addEventListener('change', function () {
        const selectedTitulo = this.value;
        const selectedNome = nomeSelecionadoHeader.textContent;
        if (selectedNome && selectedTitulo) {
            displayResultado(selectedNome, selectedTitulo);
        }
    });

    // Função para lidar com o clique no ícone 'Resultado'
    resultadoIcon.addEventListener('click', function (event) {
        event.preventDefault();
        currentMode = 'Resultado';
        localStorage.setItem(localStorageModeKey, 'Resultado');
        setActiveIcon(resultadoIcon);
        const lastSelectedName = localStorage.getItem(localStorageNameKey);
        if (lastSelectedName && resultado[lastSelectedName]) {
            selecionarLoteria(lastSelectedName);
        } else {
            showSection(selecionarNomeSection);
        }
    });

    // Função para lidar com o clique no ícone 'Palpite'
    palpiteIcon.addEventListener('click', function (event) {
        event.preventDefault();
        currentMode = 'Palpite';
        localStorage.setItem(localStorageModeKey, 'Palpite');
        setActiveIcon(palpiteIcon);
        showSection(modoPalpiteSection);
        populateDropdownPalpite();
    });

    // Função para lidar com o clique no ícone 'Jogar'
    jogarIcon.addEventListener('click', function (event) {
        event.preventDefault();
        currentMode = 'Jogar';
        setActiveIcon(jogarIcon);

        // Define o src da iframe para carregar o site externo e exibe em tela cheia
        jogarIframe.src = 'https://app.acertos.club/pr/sbrqjugZ';
        modoJogarSection.style.display = 'block'; // Exibe a seção com a iframe em tela cheia
        fecharIframeBtn.classList.remove('hidden'); // Mostra o botão de fechar
    });

    // Função para lidar com o clique no botão 'X' (fechar iframe)
    fecharIframeBtn.addEventListener('click', function () {
        window.location.reload(); // Recarrega a página completamente
    });

    // Função para lidar com o clique no ícone 'Compartilhar'
    compartilharIcon.addEventListener('click', function (event) {
        event.preventDefault();
        abrirOpcoesCompartilhamento();
    });

    // Função para definir o ícone ativo
    function setActiveIcon(activeIcon) {
        [minasIcon, resultadoIcon, palpiteIcon, jogarIcon].forEach(icon => {
            icon.classList.remove('active');
        });
        activeIcon.classList.add('active');
    }

    // Função para abrir opções de compartilhamento
    function abrirOpcoesCompartilhamento() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Aumente suas chances de ganhar no Jogo do Bicho com os melhores palpites e estatísticas certeiras! Confira agora os resultados mais recentes e receba dicas valiosas para fazer sua próxima aposta vencedora!',
                url: window.location.href
            }).then(() => {
                console.log('Compartilhamento bem-sucedido');
                // Define o status de compartilhamento no localStorage somente após sucesso
                localStorage.setItem(localStorageSharedKey, 'true');
            }).catch((error) => {
                console.log('Compartilhamento cancelado ou erro:', error);
                // Não define o status de compartilhamento se o compartilhamento foi cancelado ou falhou
            });
        } else {
            alert('Compartilhamento não suportado neste navegador.');
        }
    }

    // Função para popular o dropdown de palpite
    function populateDropdownPalpite() {
        dropdownPalpite.innerHTML = '<option value="" disabled selected>Escolha uma loteria</option>';

        if (!palpites) {
            dropdownPalpite.innerHTML += '<option value="" disabled>Dados indisponíveis.</option>';
            return;
        }

        Object.keys(palpites).forEach(nome => {
            const option = document.createElement('option');
            option.value = nome;
            option.textContent = nome;
            dropdownPalpite.appendChild(option);
        });

        const lastSelectedName = localStorage.getItem(localStorageNameKey);
        if (lastSelectedName && palpites[lastSelectedName]) {
            dropdownPalpite.value = lastSelectedName;
            exibirFrasesPalpitePorCategoria(lastSelectedName);
        }
    }

    // Evento para quando a seleção do dropdown de palpite mudar
    dropdownPalpite.addEventListener('change', function () {
        const selectedName = this.value;
        localStorage.setItem(localStorageNameKey, selectedName);
        exibirFrasesPalpitePorCategoria(selectedName);
        palpiteConteudoDiv.innerHTML = '';
    });

function hideAllSections() {
    selecionarNomeSection.classList.add('hidden');
    exibirResultadoSection.classList.add('hidden');
    modoPalpiteSection.classList.add('hidden');
    modoJogarSection.classList.add('hidden');
    comoFuncionaSection.classList.add('hidden');
    politicasPrivacidadeSection.classList.add('hidden');
    termosServicoSection.classList.add('hidden');
    sobreSection.classList.add('hidden');
    minasSection.classList.add('hidden'); // Nova seção Minas
}



minasIcon.addEventListener('click', function (event) {
    event.preventDefault();
    setActiveIcon(minasIcon);
    showSection(minasSection);
});

// Função para exibir as frases nas abas em formato de cards
function exibirFrasesPalpitePorCategoria(nome) {
    const frases = palpites[nome].frases;
    const milharDiv = document.getElementById('milhar');
    const centenaDiv = document.getElementById('centena');
    const dezenaDiv = document.getElementById('dezena');

    // Limpa o conteúdo anterior
    milharDiv.innerHTML = '';
    centenaDiv.innerHTML = '';
    dezenaDiv.innerHTML = '';

    let milharCount = 0;
    let centenaCount = 0;
    let dezenaCount = 0;

    // Popula as abas com as frases correspondentes, exibidas em cards
    frases.forEach(frase => {
        const card = document.createElement('div');
        card.classList.add('frase-palpite-card');
        const p = document.createElement('p');
        p.textContent = frase;
        card.appendChild(p);

        if (frase.includes('Milhar')) {
            milharDiv.appendChild(card);
            milharCount++;
        } else if (frase.includes('Centena')) {
            centenaDiv.appendChild(card);
            centenaCount++;
        } else if (frase.includes('Dezena')) {
            dezenaDiv.appendChild(card);
            dezenaCount++;
        }
    });

    // Atualiza os contadores nas abas
    document.getElementById('milharCount').textContent = milharCount;
    document.getElementById('centenaCount').textContent = centenaCount;
    document.getElementById('dezenaCount').textContent = dezenaCount;

    // Exibe o título e as abas
    document.getElementById('acertosPrevisoesTitulo').classList.remove('hidden');
    document.getElementById('palpiteAbas').classList.remove('hidden');
}

// Função para controlar a troca de abas
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove a classe ativa de todas as abas
        document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

        // Adiciona a classe ativa à aba clicada
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.remove('hidden');
    });
});

// Função para controlar a troca de abas
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove a classe ativa de todas as abas
        document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

        // Adiciona a classe ativa à aba clicada
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.remove('hidden');

        // Muda a cor da linha horizontal abaixo das abas
        const tabList = document.querySelector('.tab-list');
        tabList.classList.remove('active-milhar', 'active-centena', 'active-dezena');
        if (tabId === 'milhar') {
            tabList.classList.add('active-milhar');
        } else if (tabId === 'centena') {
            tabList.classList.add('active-centena');
        } else if (tabId === 'dezena') {
            tabList.classList.add('active-dezena');
        }
    });
});

const tabelaGrupos = {
    1: { nome: 'Avestruz', emoji: '🦩' },
    2: { nome: 'Águia', emoji: '🦅' },
    3: { nome: 'Burro', emoji: '🐴' },
    4: { nome: 'Borboleta', emoji: '🦋' },
    5: { nome: 'Cachorro', emoji: '🐶' },
    6: { nome: 'Cabra', emoji: '🐐' },
    7: { nome: 'Carneiro', emoji: '🐏' },
    8: { nome: 'Camelo', emoji: '🐫' },
    9: { nome: 'Cobra', emoji: '🐍' },
    10: { nome: 'Coelho', emoji: '🐰' },
    11: { nome: 'Cavalo', emoji: '🐎' },
    12: { nome: 'Elefante', emoji: '🐘' },
    13: { nome: 'Galo', emoji: '🐓' },
    14: { nome: 'Gato', emoji: '🐱' },
    15: { nome: 'Jacaré', emoji: '🐊' },
    16: { nome: 'Leão', emoji: '🦁' },
    17: { nome: 'Macaco', emoji: '🐒' },
    18: { nome: 'Porco', emoji: '🐖' },
    19: { nome: 'Pavão', emoji: '🦚' },
    20: { nome: 'Peru', emoji: '🦃' },
    21: { nome: 'Touro', emoji: '🐂' },
    22: { nome: 'Tigre', emoji: '🐯' },
    23: { nome: 'Urso', emoji: '🐻' },
    24: { nome: 'Veado', emoji: '🦌' },
    25: { nome: 'Vaca', emoji: '🐄' }
};

// Função para exibir os palpites com efeito de carregamento e seções personalizadas
function exibirPalpitesComLoading(nome) {
    palpiteConteudoDiv.innerHTML = ''; // Limpa conteúdo anterior

    const loader = document.createElement('div');
    loader.classList.add('loader');
    palpiteConteudoDiv.appendChild(loader);

    setTimeout(() => {
        loader.remove();

        // Frase personalizada
        const fraseP = document.createElement('p');
        fraseP.textContent = `Aposte os números abaixo na loteria ${nome}.`;
        fraseP.classList.add('frase-palpite');
        palpiteConteudoDiv.appendChild(fraseP);

        // Cria os botões de alternância das categorias
        const botoesCategorias = document.createElement('div');
        botoesCategorias.classList.add('botoes-categorias');

        // Função auxiliar para criar botão com funcionalidade de ativação
        function criarBotao(texto, categoriaId) {
            const botao = document.createElement('button');
            botao.textContent = texto;
            botao.addEventListener('click', () => {
                mostrarCategoria(categoriaId);
                document.querySelectorAll('.botoes-categorias button').forEach(b => b.classList.remove('ativo'));
                botao.classList.add('ativo'); // Marca o botão atual como ativo
            });
            return botao;
        }

        // Cria cada botão com a classe de estilo
        const botaoMilhar = criarBotao('M/MC', 'Milhar');
        const botaoCentena = criarBotao('C', 'Centena');
        const botaoDezena = criarBotao('D', 'Dezena');
        const botaoGrupo = criarBotao('G', 'Grupo');

        // Adiciona os botões ao contêiner e o contêiner ao conteúdo dos palpites
        botoesCategorias.append(botaoMilhar, botaoCentena, botaoDezena, botaoGrupo);
        palpiteConteudoDiv.appendChild(botoesCategorias);

        const dadosPalpite = palpites[nome];
        if (!dadosPalpite) {
            palpiteConteudoDiv.textContent = 'Dados indisponíveis.';
            return;
        }

        // Gera e esconde as seções de palpite
        const milhares = [...new Set(dadosPalpite.palpites)];
        const centenas = [...new Set(milhares.map(num => num.slice(1)))];
        const dezenas = [...new Set(milhares.map(num => num.slice(2)))];
        const grupos = gerarGruposFrequentes(dadosPalpite.palpites);

        criarSecaoPalpite(milhares, 'Milhar');
        criarSecaoPalpite(centenas, 'Centena');
        criarSecaoPalpite(dezenas, 'Dezena');
        criarSecaoPalpite(grupos, 'Grupo');

        // Exibe a categoria inicial e marca o botão "M/MC" como ativo
        mostrarCategoria('Milhar');
        botaoMilhar.classList.add('ativo');
    }, 2000);
}


// Função para mostrar uma categoria específica
function mostrarCategoria(categoria) {
    // Esconde todas as categorias primeiro
    document.querySelectorAll('.cards-container').forEach(div => {
        div.style.display = 'none';
    });

    // Mostra a categoria selecionada
    const categoriaDiv = document.getElementById(`secao-${categoria}`);
    if (categoriaDiv) categoriaDiv.style.display = 'flex';
}

// Atualiza a função criarSecaoPalpite para identificar cada seção por categoria
function criarSecaoPalpite(numeros, id) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('cards-container'); // aplica o estilo original de centralização
    sectionDiv.id = `secao-${id}`; // Adiciona um id único para cada categoria

    numeros.forEach(numero => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card-palpite');
        cardDiv.textContent = numero;
        sectionDiv.appendChild(cardDiv);
    });

    sectionDiv.style.display = 'none'; // Esconde inicialmente
    palpiteConteudoDiv.appendChild(sectionDiv);
}

// Função para gerar os grupos mais frequentes com o nome do bicho e emoji
function gerarGruposFrequentes(palpites) {
    const grupoContagem = {};

    // Conta a frequência dos grupos
    palpites.forEach(num => {
        const grupoNum = Math.ceil(parseInt(num.slice(2)) / 4); // Calcula o grupo baseado nos dois últimos dígitos
        if (tabelaGrupos[grupoNum]) {
            grupoContagem[grupoNum] = (grupoContagem[grupoNum] || 0) + 1;
        }
    });

    // Seleciona apenas grupos com frequência mínima de 2 e formata para exibição
    return Object.entries(grupoContagem)
        .filter(([_, count]) => count >= 2)
        .map(([grupoNum, _]) => `${grupoNum} - ${tabelaGrupos[grupoNum].nome} ${tabelaGrupos[grupoNum].emoji}`);
}

    // Função para exibir uma mensagem flutuante com fundo desfocado e botão "OK"
    function exibirMensagemFlutuante(mensagem) {
        // Cria o fundo desfocado
        const fundoDiv = document.createElement('div');
        fundoDiv.style.position = 'fixed';
        fundoDiv.style.top = '0';
        fundoDiv.style.left = '0';
        fundoDiv.style.width = '100%';
        fundoDiv.style.height = '100%';
        fundoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        fundoDiv.style.zIndex = '999';
        fundoDiv.style.backdropFilter = 'blur(5px)';
        fundoDiv.style.display = 'flex';
        fundoDiv.style.justifyContent = 'center';
        fundoDiv.style.alignItems = 'center';

        // Cria o contêiner da mensagem
        const mensagemDiv = document.createElement('div');
        mensagemDiv.style.padding = '15px';
        mensagemDiv.style.width = '300px';
        mensagemDiv.style.backgroundColor = '#333';
        mensagemDiv.style.color = '#fff';
        mensagemDiv.style.borderRadius = '8px';
        mensagemDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        mensagemDiv.style.zIndex = '1000';
        mensagemDiv.style.position = 'relative';

        // Adiciona o conteúdo da mensagem e o botão "OK"
        mensagemDiv.innerHTML = `<p>${mensagem}</p>`;
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.style.marginTop = '10px';
        okBtn.style.padding = '5px 10px';
        okBtn.style.background = '#ffdd57';
        okBtn.style.color = '#333';
        okBtn.style.border = 'none';
        okBtn.style.borderRadius = '5px';
        okBtn.style.cursor = 'pointer';

        // Evento de fechamento da mensagem
        okBtn.addEventListener('click', () => {
            fundoDiv.remove(); // Remove o fundo desfocado
            document.body.classList.remove('no-scroll'); // Reativa o scroll
        });

        // Adiciona o botão à mensagem e a mensagem ao fundo
        mensagemDiv.appendChild(okBtn);
        fundoDiv.appendChild(mensagemDiv);
        document.body.appendChild(fundoDiv);

        // Desativa o scroll
        document.body.classList.add('no-scroll');
    }

    // CSS para desativar o scroll quando a classe 'no-scroll' estiver presente
    const style = document.createElement('style');
    style.innerHTML = `
        .no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Substituição de alert() com exibirMensagemFlutuante
    function alert(mensagem) {
        exibirMensagemFlutuante(mensagem);
    }

















































    // Função para gerar a chave Pix e exibir no campo de texto
    document.getElementById('gerarPixBtn').onclick = function() {
        fetch('https://script.google.com/macros/s/AKfycbwPXlgv795gYZZIXU8oi56a-yd4iQZ_5BGGYpQP_LK9jJFfBEY83uZ8qluXEDJncBjtKA/exec?action=createPix&value=1&description=Liberação%20dos%20Palpites%20por%2030%20dias')
            .then(response => response.json())
            .then(data => {
                const pixKey = data.pixKey;
                document.getElementById('pixKey').value = pixKey;
                document.getElementById('pixContainer').classList.remove('hidden');
                alert('Chave Pix gerada! Copie e realize o pagamento para liberar os palpites.');
            })
            .catch(error => console.error('Erro ao gerar chave Pix:', error));
    };

    // Função para copiar a chave Pix
    function copyPixKey() {
        const pixKey = document.getElementById('pixKey');
        pixKey.select();
        pixKey.setSelectionRange(0, 99999); // Para dispositivos móveis
        document.execCommand('copy');
        alert('Chave Pix copiada! Realize o pagamento para continuar.');
    }

    // Função para liberar o acesso após confirmação do pagamento
    function liberarAcesso() {
        const dataExpiracao = new Date();
        dataExpiracao.setDate(dataExpiracao.getDate() + 30); // Adiciona 30 dias
        localStorage.setItem('privilegeAccess', 'true');
        localStorage.setItem('privilegeAccessExpiry', dataExpiracao.toISOString());
        alert('Pagamento confirmado! Acesso liberado por 30 dias.');
    }

    // Função para verificar o pagamento
    document.getElementById('mostrarPalpiteBtn').onclick = function() {
        fetch('https://script.google.com/macros/s/AKfycbxXb2sTldN8l4IY7Y8QfFwxFM3f9971jPkIY_z5eOMTypTWrRAbcI93PG0DeI-VQbuiOw/exec?action=verifyPayment')
            .then(response => response.json())
            .then(data => {
                if (data.paymentConfirmed) {
                    liberarAcesso();
                    document.getElementById('palpiteConteudo').classList.remove('hidden');
                    document.getElementById('gerarPixBtn').classList.add('hidden'); // Oculta botão Gerar Pix
                } else {
                    alert('Pagamento não confirmado. Por favor, tente novamente.');
                }
            })
            .catch(error => console.error('Erro ao verificar pagamento:', error));
    };

    // Função para verificar o acesso do usuário
    function verificarAcesso() {
        const acessoLiberado = localStorage.getItem('privilegeAccess') === 'true';
        const dataExpiracao = new Date(localStorage.getItem('privilegeAccessExpiry'));
        const agora = new Date();

        if (acessoLiberado && agora < dataExpiracao) {
            document.getElementById('palpiteConteudo').classList.remove('hidden');
        } else {
            alert('Acesso expirado ou não liberado. Por favor, efetue o pagamento.');
            document.getElementById('gerarPixBtn').classList.remove('hidden'); // Exibe botão Gerar Pix
        }
    }

    // Chama a função ao carregar a página
    verificarAcesso();















































    // Função para lidar com o clique no botão 'Selecionar loteria' na seção Exibir Resultados
    selecionarLoteriaLink.addEventListener('click', function (event) {
        event.preventDefault();
        showSelecaoLoteria();
    });

    // Função para mostrar a seleção de loteria
    function showSelecaoLoteria() {
        setActiveIcon(resultadoIcon);
        showSection(selecionarNomeSection);
    }

    // Função para lidar com o clique no ícone de menu hambúrguer
    hamburgerMenu.addEventListener('click', function () {
        expandMenu.classList.toggle('hidden');
        expandMenu.classList.toggle('active'); // Para animação CSS
    });

// Função para fechar o menu expandido ao rolar a página
function fecharMenuAoRolar() {
    if (expandMenu.classList.contains('active')) {
        expandMenu.classList.remove('active');
        expandMenu.classList.add('hidden');
    }
}

// Adiciona o evento de rolagem
window.addEventListener('scroll', fecharMenuAoRolar);

    // Função para lidar com os cliques nos itens do menu expandido
    expandMenu.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            const sectionId = event.target.getAttribute('data-section');
            if (sectionId) {
                const section = document.getElementById(sectionId);
                if (section) {
                    showSection(section);
                }
            }
            // Fechar o menu após clicar
            expandMenu.classList.add('hidden');
            expandMenu.classList.remove('active');
        }
    });

    // Função para lidar com o clique no item 'Contato'
    contatoLink.addEventListener('click', function (event) {
        event.preventDefault();
        window.open('https://www.instagram.com/acertosonline/', '_blank');
        // Fechar o menu após clicar
        expandMenu.classList.add('hidden');
        expandMenu.classList.remove('active');
    });

    // Função para lidar com o clique no item 'Instale o App no seu celular'
    instalarAppLink.addEventListener('click', function (event) {
        event.preventDefault();
        instalarApp(); // Função para instalar o PWA
        // Fechar o menu após clicar
        expandMenu.classList.add('hidden');
        expandMenu.classList.remove('active');
    });

    // Função para instalar o App (PWA)
    function instalarApp() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuário aceitou a instalação do App');
                } else {
                    console.log('Usuário recusou a instalação do App');
                }
                deferredPrompt = null;
            });
        } else {
            // Fallback para navegadores que não suportam o evento
            alert('A funcionalidade de instalação não está disponível no seu navegador.');
        }
    }

    // Registro do Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registrado com sucesso:', registration.scope);
                })
                .catch(error => {
                    console.log('Falha ao registrar ServiceWorker:', error);
                });
        });
    }

    // Captura o evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Opcional: Mostrar um botão para instalar o PWA
        // Como estamos usando o menu, a instalação será acionada pelo item do menu
    });

function setActiveIcon(activeIcon) {
    [minasIcon, resultadoIcon, palpiteIcon, jogarIcon, compartilharIcon].forEach(icon => {
        icon.classList.remove('active');
    });
    activeIcon.classList.add('active');
}
    // Função de inicialização
    function initializeApp() {
        hideAllSections();
        populateMenuLoterias();
        populateDropdownPalpite();

        const lastMode = localStorage.getItem(localStorageModeKey) || 'Resultado';
        if (lastMode === 'Resultado') {
            resultadoIcon.click();
        } else if (lastMode === 'Palpite') {
            palpiteIcon.click();
        } else if (lastMode === 'Jogar') {
            jogarIcon.click();
        }
    }

    // Inicialização da aplicação
    initializeApp();
});
