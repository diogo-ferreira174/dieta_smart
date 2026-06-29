let usuarioAtual = null;
let grafico = null;
let modoOffline = false;

function parsarData(dataStr) {
    if (!dataStr) return new Date(0);

    if (dataStr.includes('-')) {
        const [ano, mes, dia] = dataStr.split('-').map(Number);
        return new Date(ano, mes - 1, dia);
    }

    const partes = dataStr.split('.');
    return new Date(partes[2], partes[1] - 1, partes[0]);
}

async function carregarDb() {
    const caminhos = ['./db/db.json', 'db/db.json', '/db/db.json'];
    let ultimoErro = null;

    for (const caminho of caminhos) {
        try {
            const resposta = await fetch(caminho);
            if (!resposta.ok) {
                ultimoErro = new Error(`Falha ao carregar ${caminho}: ${resposta.status}`);
                continue;
            }
            return await resposta.json();
        } catch (erro) {
            ultimoErro = erro;
        }
    }

    throw ultimoErro || new Error('Não foi possível carregar db.json');
}

function formatarDataParaStorage(dataISO) {
    const [ano, mes, dia] = dataISO.split('-').map(Number);
    return `${String(dia).padStart(2, '0')}.${String(mes).padStart(2, '0')}.${ano}`;
}

function salvarDadosLocais(id, dados) {
    localStorage.setItem(`pesagensFallback:${id}`, JSON.stringify(dados));
}

function carregarDadosLocais(id) {
    const dados = localStorage.getItem(`pesagensFallback:${id}`);
    return dados ? JSON.parse(dados) : [];
}

function atualizarInterface() {
    const pesagens = [...(usuarioAtual?.pesagens || [])];
    pesagens.sort((a, b) => parsarData(a.data) - parsarData(b.data));

    if (grafico) {
        grafico.data.labels = pesagens.map(item => parsarData(item.data).toLocaleDateString('pt-BR'));
        grafico.data.datasets[0].data = pesagens.map(item => item.peso);
        grafico.data.datasets[0].label = `Peso de ${usuarioAtual?.nome || 'usuário'} (kg)`;
        grafico.update();
    }

    const lista = document.getElementById('listaPesagens') || document.getElementById('pesagens-info');

    if (lista) {
        if (pesagens.length === 0) {
            lista.innerHTML = '<li>Nenhuma pesagem registrada ainda.</li>';
            return;
        }

        lista.innerHTML = pesagens
            .map(item => `<li><span>Data: ${item.data}</span> — <strong>${item.peso} kg</strong></li>`)
            .join('');
    }
}

async function buscarIdUsuario() {
    let idProcurado = localStorage.getItem('idProcurado');

    if (!idProcurado) {
        const usuarioCorrente = sessionStorage.getItem('usuarioCorrente');
        if (usuarioCorrente) {
            try {
                const dadosCorrente = JSON.parse(usuarioCorrente);
                idProcurado = dadosCorrente.id;
            } catch (erro) {
                console.error('Erro ao ler usuário corrente:', erro);
            }
        }
    }

    if (!idProcurado) {
        try {
            const resposta = await fetch('http://localhost:3000/usuarios');
            const usuarios = await resposta.json();
            if (Array.isArray(usuarios) && usuarios.length > 0) {
                idProcurado = String(usuarios[0].id);
                localStorage.setItem('idProcurado', idProcurado);
            }
        } catch (erro) {
            console.warn('Não foi possível buscar usuário no servidor, tentando db.json local.', erro);
            try {
                const db = await carregarDb();
                if (Array.isArray(db.usuarios) && db.usuarios.length > 0) {
                    idProcurado = String(db.usuarios[0].id);
                    localStorage.setItem('idProcurado', idProcurado);
                }
            } catch (errDb) {
                console.warn('Falha ao carregar db.json local.', errDb);
            }
        }
    }

    return idProcurado;
}

async function iniciar() {
    const idProcurado = await buscarIdUsuario();

    if (!idProcurado) {
        usuarioAtual = { nome: 'Usuário', pesagens: carregarDadosLocais('fallback') };
        criarGrafico();
        atualizarInterface();
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/usuarios/${idProcurado}`);
        if (!resposta.ok) throw new Error('Falha ao carregar usuário');

        usuarioAtual = await resposta.json();
        modoOffline = false;
    } catch (erro) {
        console.warn('Falha ao buscar usuário no servidor, tentando db.json local.', erro);
        try {
            const db = await carregarDb();
            const usuarioDb = Array.isArray(db.usuarios) ? db.usuarios.find(u => String(u.id) === String(idProcurado)) : null;
            if (usuarioDb) {
                usuarioAtual = usuarioDb;
                modoOffline = false;
            } else {
                const dadosLocais = carregarDadosLocais(idProcurado);
                usuarioAtual = { id: idProcurado, nome: 'Usuário', pesagens: dadosLocais };
                modoOffline = true;
            }
        } catch (errDb) {
            console.warn('Falha ao carregar db.json local; usando dados locais.', errDb);
            const dadosLocais = carregarDadosLocais(idProcurado);
            usuarioAtual = { id: idProcurado, nome: 'Usuário', pesagens: dadosLocais };
            modoOffline = true;
        }
    }

    criarGrafico();
    atualizarInterface();
}

function criarGrafico() {
    const ctx = document.getElementById('graficolinha');

    if (!ctx) return;

    grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Peso (kg)',
                data: [],
                borderWidth: 2,
                tension: 0.2
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Data' } },
                y: { beginAtZero: false, title: { display: true, text: 'Peso (kg)' } }
            }
        }
    });
}

async function adicionarPesagem() {
    const idProcurado = await buscarIdUsuario();
    const dataInput = document.getElementById('data');
    const pesoInput = document.getElementById('peso');
    const mensagemEl = document.getElementById('mensagemPesagem');

    if (!idProcurado) {
        if (mensagemEl) {
            mensagemEl.textContent = 'Nenhum usuário encontrado.';
            mensagemEl.classList.add('erro');
        }
        return;
    }

    if (!dataInput?.value || !pesoInput?.value) {
        if (mensagemEl) {
            mensagemEl.textContent = 'Informe a data e o peso antes de adicionar.';
            mensagemEl.classList.add('erro');
        }
        return;
    }

    const peso = Number(pesoInput.value);
    if (Number.isNaN(peso) || peso <= 0) {
        if (mensagemEl) {
            mensagemEl.textContent = 'Informe um peso válido.';
            mensagemEl.classList.add('erro');
        }
        return;
    }

    const novaPesagem = {
        data: formatarDataParaStorage(dataInput.value),
        peso: Number(peso.toFixed(1))
    };

    const pesagensAtualizadas = [...(usuarioAtual?.pesagens || [])];
    const jaExiste = pesagensAtualizadas.some(item => item.data === novaPesagem.data);

    if (jaExiste) {
        if (mensagemEl) {
            mensagemEl.textContent = 'Essa data já possui uma pesagem cadastrada.';
            mensagemEl.classList.add('erro');
        }
        return;
    }

    pesagensAtualizadas.push(novaPesagem);
    pesagensAtualizadas.sort((a, b) => parsarData(a.data) - parsarData(b.data));

    try {
        const resposta = await fetch(`http://localhost:3000/usuarios/${idProcurado}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pesagens: pesagensAtualizadas })
        });

        if (!resposta.ok) throw new Error('Falha ao salvar no servidor');

        usuarioAtual = { ...(usuarioAtual || {}), id: idProcurado, pesagens: pesagensAtualizadas };
        salvarDadosLocais(idProcurado, pesagensAtualizadas);
        modoOffline = false;

        if (mensagemEl) {
            mensagemEl.textContent = `Pesagem salva com sucesso para ${novaPesagem.data}!`;
            mensagemEl.classList.remove('erro');
        }
    } catch (erro) {
        console.warn('Salvando localmente porque o servidor não respondeu.', erro);
        usuarioAtual = { ...(usuarioAtual || {}), id: idProcurado, pesagens: pesagensAtualizadas };
        salvarDadosLocais(idProcurado, pesagensAtualizadas);
        modoOffline = true;

        if (mensagemEl) {
            mensagemEl.textContent = 'Pesagem salva localmente. O servidor pode estar indisponível.';
            mensagemEl.classList.add('erro');
        }
    }

    atualizarInterface();
    dataInput.value = '';
    pesoInput.value = '';
}

window.adicionarPesagem = adicionarPesagem;

iniciar();

const botaoAdicionar = document.getElementById('btnAdicionarPesagem');
if (botaoAdicionar) {
    botaoAdicionar.addEventListener('click', adicionarPesagem);
}

const menuIcon = document.getElementById('iconMenu');
if (menuIcon) {
    menuIcon.addEventListener('click', (event) => {
        const menu = document.getElementById('menuLateral');
        if (menu) {
            menu.style.display = 'block';
            event.stopPropagation();
        }
    });
}

document.addEventListener('click', (event) => {
    const menu = document.getElementById('menuLateral');
    if (menu && menu.style.display === 'block' && !menu.contains(event.target)) {
        menu.style.display = 'none';
    }
});