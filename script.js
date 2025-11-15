const nCards = 8;
let cards = [];
const attemptsSpan = document.getElementById('attempts');
const board = document.getElementById("board")

/* =========================
   Criação das cartas (DOM)
   ========================= */
function createCard(value) {
  const memoryCard = document.createElement("div");
  memoryCard.classList.add("memory-card");
  memoryCard.dataset.cardValue = value;

  const frontFace = document.createElement("div")
  frontFace.classList.add("front-face");
  const backFace = document.createElement("div")
  backFace.classList.add("back-face");

  const frontParagraph = document.createElement("p");
  const backParagraph = document.createElement("p");

  frontParagraph.textContent = value;
  backParagraph.textContent = "?";

  frontFace.appendChild(frontParagraph);
  backFace.appendChild(backParagraph);
  memoryCard.appendChild(frontFace);
  memoryCard.appendChild(backFace);

  return (memoryCard);
}

// Gera pares de cartas (0,0,1,1,...)
for (let i = 0; i < nCards; i++) {
  const newCard1 = createCard(i);
  const newCard2 = createCard(i);
  board.appendChild(newCard1);
  board.appendChild(newCard2);
  cards.push(newCard1);
  cards.push(newCard2);
}

// Marca o índice de cada carta para identificar no estado salvo
cards.forEach((c, idx) => {
  c.dataset.cardIndex = idx; // índice fixo no array "cards"
});


/* =========================
   Estado do jogo (variáveis)
   ========================= */
let hasFlippedCard = false;
let lockBoard = false; // Bloqueia o tabuleiro para evitar cliques rápidos
let firstCard, secondCard;
let attempts = 0;
let matchedPairs = 0; // Contador de pares encontrados

/* =========================
   Função de flip
   ========================= */
function flipCard() {
  // Se o tabuleiro estiver bloqueado ou a carta clicada for a mesma, ignora o clique
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip'); // Adiciona a classe 'flip' à carta clicada

  if (!hasFlippedCard) {
    // Primeiro clique
    hasFlippedCard = true;
    firstCard = this;

    // Salva o estado após o primeiro clique (uma carta virada)
    saveGameState();
    return;
  }

  // Segundo clique
  secondCard = this;
  hasFlippedCard = false; // Reseta para o próximo turno

  checkForMatch();

  // Salva o estado após o segundo clique (duas cartas viradas / comparação em andamento)
  saveGameState();
}

/* =========================
   Checa se as duas cartas dão par
   ========================= */
function checkForMatch() {
  // Incrementa o contador de tentativas
  attempts++;
  attemptsSpan.textContent = attempts;

  // Verifica se os data-attributes das duas cartas são iguais
  let isMatch = firstCard.dataset.cardValue === secondCard.dataset.cardValue;

  // Se for um par, desabilita as cartas. Se não, vira-as de volta.
  isMatch ? disableCards() : unflipCards();
}

/* =========================
   Desabilita as cartas quando dão match
   ========================= */
function disableCards() {
  // Marca visualmente como combinadas (classe 'matched') e remove clique
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  // Salva imediatamente o estado (par confirmado)
  saveGameState();

  // Incrementa o contador de pares
  matchedPairs++;

  // Verifica se o jogo terminou (todos os pares encontrados)
  if (matchedPairs === nCards) {
    // Avisa e chama endGame depois de um pequeno atraso para ver a última carta
    setTimeout(endGame, 1000);
  }

  resetBoard();
}

/* =========================
   Volta as cartas quando não são par
   ========================= */
function unflipCards() {
  lockBoard = true; // Bloqueia o tabuleiro

  // Após 1.5 segundos, remove a classe 'flip' para virar as cartas de volta
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    // Após desvirar, salva estado
    saveGameState();

    resetBoard();
  }, 1500);
}

/* =========================
   Reset de variáveis de turno
   ========================= */
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

/* =========================
   Embaralhamento (mantido o método atual)
   ========================= */
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
})();

/* =========================
   --- Persistência (localStorage) ---
   Salvamos e carregamos:
   - attempts
   - matchedPairs
   - order (array com 'order' CSS)
   - flipped (array booleana se a carta tem classe 'flip')
   - matched (array booleana se a carta tem classe 'matched')
   - hasFlippedCard e index da firstCard (para restaurar meio-turno)
   ========================= */

const STORAGE_KEY = "memoryState";

function saveGameState() {
  try {
    const state = {
      attempts: attempts,
      matchedPairs: matchedPairs,
      // Guardamos a ordem visual atual
      order: cards.map(c => c.style.order || ""),
      // Quais cartas estão viradas agora (visualmente)
      flipped: cards.map(c => c.classList.contains("flip")),
      // Quais cartas já foram combinadas / desabilitadas
      matched: cards.map(c => c.classList.contains("matched")),
      // Se havia uma carta virada esperando a segunda
      hasFlippedCard: hasFlippedCard,
      // Se firstCard existe, salva o index dela; caso contrário, null
      firstCardIndex: firstCard ? parseInt(firstCard.dataset.cardIndex, 10) : null,
      // LockBoard também pode ser salvo para evitar cliques logo após reload (opcional)
      lockBoard: lockBoard
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Erro ao salvar estado do jogo:", e);
  }
}

function loadGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return; // nada a restaurar

    const saved = JSON.parse(raw);

    // Restaurar tentativas e pares
    attempts = saved.attempts || 0;
    matchedPairs = saved.matchedPairs || 0;
    attemptsSpan.textContent = attempts;

    // Restaurar ordem: colocamos o 'order' salvo
    if (saved.order && Array.isArray(saved.order)) {
      saved.order.forEach((orderValue, i) => {
        // apenas se existir a carta i
        if (cards[i]) cards[i].style.order = orderValue;
      });
    }

    // Restaurar matched (cartas bloqueadas)
    if (saved.matched && Array.isArray(saved.matched)) {
      saved.matched.forEach((isMatched, i) => {
        if (isMatched && cards[i]) {
          cards[i].classList.add('matched');
          // remover o listener para evitar clicar
          cards[i].removeEventListener('click', flipCard);
        }
      });
    }

    // Restaurar flipped (cartas visivelmente viradas)
    if (saved.flipped && Array.isArray(saved.flipped)) {
      saved.flipped.forEach((isFlipped, i) => {
        if (isFlipped && cards[i]) {
          cards[i].classList.add('flip');
        } else if (cards[i]) {
          cards[i].classList.remove('flip');
        }
      });
    }

    // Restaurar estado de "meio-turno" (uma carta virada esperando a segunda)
    hasFlippedCard = !!saved.hasFlippedCard;
    if (hasFlippedCard && saved.firstCardIndex !== null && cards[saved.firstCardIndex]) {
      firstCard = cards[saved.firstCardIndex];
    } else {
      firstCard = null;
      hasFlippedCard = false;
    }

    // Restaurar lockBoard se necessário
    lockBoard = !!saved.lockBoard;

  } catch (e) {
    console.error("Erro ao carregar estado do jogo:", e);
  }
}

// Remove o estado salvo (usado ao finalizar o jogo)
function clearGameState() {
  localStorage.removeItem(STORAGE_KEY);
}

/* =========================
   Agora que o tabuleiro foi criado e embaralhado,
   carregue o estado salvo (se existir) ANTES de registrar os cliques.
   ========================= */
loadGameState();

// Adiciona o evento de clique a cada uma das cartas
cards.forEach(card => {
  // Só adiciona se NÃO for matched (caso esteja matched, já removemos no load)
  if (!card.classList.contains('matched')) {
    card.addEventListener('click', flipCard);
  }
});


/* =========================
   Funções de fim de jogo e salvamento de pontuação (mantidas)
   ========================= */

function endGame() {
  // Limpa o estado salvo: ao terminar queremos começar do zero da próxima vez
  clearGameState();

  // Desabilita o tabuleiro (evita cliques)
  lockBoard = true;

  const playerName = prompt(`Parabéns! Você completou o jogo em ${attempts} tentativas.\n\nDigite seu nome para salvar:`);

  if (playerName && playerName.trim() !== "") {
    // Chama o método de salvamento (AJAX)
    saveScoreByAjax(playerName);
    // Se preferir formulário oculto:
    // saveScoreByForm(playerName);
  } else {
    // Se o usuário cancelar
    alert("Pontuação não salva. Reiniciando o jogo.");
    // Redireciona para a página de jogar (ou recarrega)
    window.location.href = 'index.php?page=jogar';
  }
}

/**
 * MÉTODO 1: Salvar pontuação usando AJAX (Fetch API)
 */
function saveScoreByAjax(playerName) {
  const formData = new FormData();
  formData.append('nome', playerName);
  formData.append('tentativas', attempts);

  console.log("Enviando (AJAX):", playerName, attempts);

  fetch('salvar_pontuacao.php', {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Resposta do servidor (AJAX):', data.message);

      // Redireciona para a página de placar após salvar
      alert("Pontuação salva! Redirecionando para o placar.");
      window.location.href = 'index.php?page=placar';
    })
    .catch(error => {
      console.error('Falha ao salvar pontuação via AJAX:', error);
      alert('Houve um erro ao salvar sua pontuação. Verifique o console.');
      // Redireciona de volta para o jogo em caso de erro
      window.location.href = 'index.php?page=jogar';
    });
}






 