# AtividadecomIAClarissa
Permanência do Jogo da Memória com IA

Quais dados vocês acharam relevante armazenar de uma partida em andamento?
Quais opções vocês encontraram para implementar a persistência? Qual opção vocês escolheram desenvolver e por qual motivo?
Ao longo do desenvolvimento, mais alguma decisão técnica precisou ser tomada? Se sim, qual?
(Se aplicável) de que maneira poderia ser implementado o modo multiplayer no seu projeto? Explique tecnicamente.




Situação inicial: 
Jogo já funcionava, mostrava um pop-up pedindo nome para salvar pontuação, tem dois botões um para jogar e outro para ver o placar, porém, não mostra placar nem guarda a pontuação, e quando se recarrega a página, ele ainda não volta para a configuração salva - observação, descobri que não mostrava o placar porque meu mySQL do xampp estava desligado…fiquei uma hora e meia sofrendo nisso.

Alterações que fiz
Primeiro escolhi método de banco de dados pois queria aproveitar os arquivos de banco de dados que já vieram com o código base, mas também considerei o método localstorage por ser mais rápido e já atender aos requisitos
Depois, criei um script de teste.php para ver se o banco estava funcionando, tive alguns problemas com as credenciais, até descobrir que tinha mantido as credenciais originais do Xampp, ativei o mySQL e encontrei a necessidade de rodar o arquivo do banco de dados, e posteriormente consegui conectar com ele, e com a ajuda do gemini, descobri ser mais um erro no xampp relacionado à desligamento automático, e agora, salva a pontuação com sucesso.
Tendo sucesso com o banco de dados para guardar a pontuação, decidi manter a pontuação no banco de dados e utilizar localstorage para manter o estado da tela, que foi a primeira recomendação do gemini, já que seria a abordagem com maior economia de tempo, contando com a necessidade que eu poderia encontrar de poupá-lo, já que gastei muito tempo “brigando” com o Xampp. O gemini chegou a fornecer um vídeo de como salvar com localstorage, porém não cheguei a assistir por falta de fone de ouvido.
Perguntei para o Gemini novamente como utilizar esse método, e construí com base na função que ele me forneceu , colocando a função, (em inglês para combinar com os nomes dos arquivos) loadGameStart  e saveGameState depois de declarar as variáveis, e a chamei depois de todos os dados que achei relevantes.

Resposta das perguntas:
A quantidade de movimentos já utilizados, a forma que as cartas estavam embaralhadas e também quais cartas já foram combinadas;
Localstorage, o primeiro recomendado, e também métodos com o banco de dados , com JSON.stringify(), funções fetch ou XMLHttpRequest intrinsecamente ligado com o banco de dados, incluindo também SQLs com Update e Insert. Eu inicialmente queria a opção mais ligada com o banco de dados, porém, por conta do meu alto gasto de tempo com outras partes iniciais do projeto, optei por utilizar o localstorage que me pareceu mais simples e também foi o primeiro recomendado pelo Gemini.
Sim, eu tive vários problemas com meu próprio Xampp, eu não conhecia algumas das funções e tive problemas por não ligar corretamente meu SQL e apache, então justamente por gastar tempo nisso que tive que tomar a decisão de utilizar Localstorage. Fora isso, também resolvi criar um script de teste apenas para verificar se o Banco de Dados estava funcionando e mantive os comentários, só deletei os últimos do arquivo javascript porque estavam me confundindo, os da segunda opção.
Pedi algumas opções para o Gemini, e o que achei mais adequado foi o de utilizar um servidor, abrindo a oportunidade para testar alguns conceitos de redes de computadores. De acordo com o Gemini, este é um método mais complicado, porém, é mais certeiro e mais rápido, portanto, já que supondo que para adicionar o multiplayer teríamos mais tempo, seria possível implementar um node.js para atualizar os jogadores em tempo real. 




