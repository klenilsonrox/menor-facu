// CONFIGURAÇÕES GLOBAIS
let mapObj = null;
// --- BANCO DE DADOS DE NOTÍCIAS AMPLIADO ---
const db_noticias = {
    queimadas: {
        t: "O Impacto das Queimadas no Cerrado e Caatinga", img: "https://static.mundoeducacao.uol.com.br/mundoeducacao/2020/10/queimadas-florestais.jpg", 
        c: "As queimadas no Brasil representam um dos maiores desafios para a conservação da biodiversidade nacional. Especialmente durante os meses de julho a outubro, o período de estiagem severa transforma a vegetação em combustível inflamável. Práticas agrícolas inadequadas e o descarte incorreto de materiais agravam a situação em biomas como o Cerrado e a Caatinga, impactando diretamente o ecossistema de Bom Jesus da Lapa e região. Além da destruição da flora e morte da fauna silvestre, a fumaça carregada de partículas tóxicas gera um aumento crítico nas internações hospitalares por problemas respiratórios, afetando principalmente crianças e idosos. O combate exige uma mobilização conjunta entre fiscalização rigorosa e a conscientização das comunidades locais sobre os riscos do uso do fogo."
    },
    desmatamento: {
        t: "Desmatamento e a Crise dos Recursos Hídricos", img: "https://c.files.bbci.co.uk/8C3C/production/_104100953_desmatamentogetty.jpg", 
        c: "O desmatamento desenfreado tem gerado consequências irreversíveis para o equilíbrio ecológico do país. A supressão da vegetação nativa para a abertura de novas pastagens e lavouras sem planejamento sustentável compromete seriamente as bacias hidrográficas. Em regiões próximas ao Rio São Francisco, a retirada da mata ciliar acelera o processo de assoreamento, fazendo com que o rio perca profundidade e volume de água. Isso prejudica não apenas a biodiversidade aquática, mas também a pesca artesanal e o abastecimento de comunidades que dependem do 'Velho Chico'. Preservar a vegetação nativa é fundamental para garantir a regulação do ciclo das chuvas e a manutenção da umidade no solo do sertão baiano."
    },
    aquecimento: {
        t: "Mudanças Climáticas no Sertão Baiano",  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsO8sCoi2f-mL33KH8AwxGTJYk3xfcLASjNQ&s",
        c: "O aquecimento global é uma realidade que já altera o calendário agrícola e o bem-estar no sertão. O aumento das concentrações de gases de efeito estufa na atmosfera intensifica o fenômeno das ondas de calor e prolonga os períodos de seca. Para municípios como Bom Jesus da Lapa, isso se traduz em um desafio maior para a agricultura de subsistência e para a saúde da população. Temperaturas recordes exigem adaptações urbanas, como o plantio de mais árvores nas cidades para criar microclimas mais frescos. A transição para energias renováveis, como a solar — abundante em nossa região —, e o apoio a projetos de reflorestamento são passos urgentes para mitigar os efeitos das mudanças climáticas globais."
    },
    poluicao: {
        t: "Poluição Urbana e a Preservação dos Rios", img: "https://projetocolabora.com.br/wp-content/uploads/2016/10/000_DE8X0.jpg", 
        c: "A poluição gerada pelo descarte irregular de resíduos sólidos e o lançamento de esgoto não tratado em cursos d'água continuam sendo entraves para o desenvolvimento sustentável. O plástico descartado incorretamente nas ruas acaba sendo levado pelas chuvas até o Rio São Francisco, onde contamina a água e ameaça a vida dos peixes. Além da poluição hídrica, a queima de lixo doméstico libera gases tóxicos que poluem o ar urbano. É necessária uma gestão de resíduos sólida e eficiente, mas o papel do cidadão é igualmente vital. Adotar a coleta seletiva, evitar o uso de plásticos descartáveis e participar de mutirões de limpeza são atitudes que protegem a saúde pública e garantem a qualidade da água para as futuras gerações."
    }
};
const quiz_items = [
    { n: "🍌 Casca de Banana", t: "organic" },
    { n: "🍾 Garrafa Pet", t: "plastic" },
    { n: "📦 Caixa de Papelão", t: "paper" }
];
let quiz_index = 0;

// NAVEGAÇÃO
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
        if (id === 'res-mapa') setTimeout(initMap, 300);
        if (id === 'forum') loadPosts();
        if (id === 'res-quiz') nextQuiz();
    }
}

// MAPA (BOM JESUS DA LAPA)
function initMap() {
    const coords = [-13.2577, -43.4184];
    if (!mapObj) {
        mapObj = L.map('map-bjl').setView(coords, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapObj);
        L.marker(coords).addTo(mapObj).bindPopup("<b>Coleta BJL</b>");
    }
    setTimeout(() => mapObj.invalidateSize(), 100);
}

// FÓRUM
function postarForum() {
    const t = document.getElementById('forum-text').value;
    const u = localStorage.getItem('user_ambient') || "Anônimo";
    if (!t) return;
    let posts = JSON.parse(localStorage.getItem('posts_db')) || [];
    posts.unshift({ u, t });
    localStorage.setItem('posts_db', JSON.stringify(posts));
    document.getElementById('forum-text').value = "";
    loadPosts();
}
function loadPosts() {
    const list = document.getElementById('posts-container');
    let posts = JSON.parse(localStorage.getItem('posts_db')) || [];
    list.innerHTML = posts.map(p => <div class="post-item"><b>${p.u}:</b><p>${p.t}</p></div>).join('');
}

// QUIZ
function nextQuiz() {
    quiz_index = Math.floor(Math.random() * quiz_items.length);
    document.getElementById('quiz-item').innerText = quiz_items[quiz_index].n;
    document.getElementById('quiz-feedback').innerText = "";
}
function checkQuiz(choice) {
    const f = document.getElementById('quiz-feedback');
    if (choice === quiz_items[quiz_index].t) {
        f.innerHTML = "<span style='color:green'>Correto!</span>";
        setTimeout(nextQuiz, 1000);
    } else { f.innerHTML = "<span style='color:red'>Tente de novo!</span>"; }
}

// NOTÍCIAS
// FUNÇÃO LER MAIS ATUALIZADA
function lerMais(id) {
    const n = db_noticias[id];
    
    // Preenche título e texto
    document.getElementById('titulo-detalhe').innerText = n.t;
    document.getElementById('texto-detalhe').innerText = n.c;
    
    // Lógica da Imagem no Detalhe
    const imgElement = document.getElementById('imagem-detalhe');
    if (n.img) {
        imgElement.src = n.img;
        imgElement.style.display = "block"; // Mostra a imagem
    } else {
        imgElement.style.display = "none"; // Esconde se não tiver
    }

    showPage('detalhe-noticia');
}

// VOLUNTÁRIO
function cadastrarVoluntario() {
    const n = document.getElementById('vol-nome').value;
    const a = document.getElementById('vol-area').value;
    if (!n || !a) return alert("Preencha tudo!");
    alert("Candidatura enviada para: " + a);
    showPage('recursos');
}

// AUTH
function fazerLogin() {
    const u = document.getElementById('login-user').value;
    if (u) { localStorage.setItem('user_ambient', u); location.reload(); }
}
function fazerCadastro() { alert("Cadastro simulado com sucesso!"); alternarAuth(); }
function logout() { localStorage.removeItem('user_ambient'); location.reload(); }
function alternarAuth() {
    const l = document.getElementById('login-form'), r = document.getElementById('register-form');
    l.style.display = l.style.display === 'none' ? 'block' : 'none';
    r.style.display = r.style.display === 'none' ? 'block' : 'none';
}

window.onload = () => {
    if (localStorage.getItem('user_ambient')) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        showPage('home');
    }
};