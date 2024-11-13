API RESTful para listar os produtores com maior e menor intervalo entre prêmios consecutivos da categoria “Pior Filme” do Golden Raspberry Awards. Este projeto foi desenvolvido em Node.js com Express e utiliza um banco de dados em memória (SQLite) para carregar e processar os dados a partir de um arquivo CSV.

------------------------------------------------------------------------------------------------------------------------------------------------------

Sumário
	•	Pré-requisitos
	•	Instalação
	•	Configuração do Arquivo CSV
	•	Como Executar a API
	•	Estrutura da API
	•	Exemplo de Resposta da API
	•	Testes
	•	Estrutura do Projeto

Pré-requisitos
	•	Node.js (versão 14 ou superior)
	•	npm (gerenciador de pacotes do Node.js)

------------------------------------------------------------------------------------------------------------------------------------------------------

Verifique se o Node.js e npm estão instalados com os seguintes comandos: 
    node -v
    npm -v

Instalação
	1.	Clone o repositório para o seu ambiente local: 
        git clone <>
        cd awards-api

    2.	Instale as dependências do projeto:
        npm install

------------------------------------------------------------------------------------------------------------------------------------------------------

Configuração do Arquivo CSV

Certifique-se de que o arquivo movielist.csv esteja na raiz do projeto. Esse arquivo deve seguir o seguinte formato (separado por ponto e vírgula ;):

year;title;studios;producers;winner
1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
1980;Cruising;Lorimar Productions, United Artists;Jerry Weintraub;
1981;Mommie Dearest;Paramount Pictures;Frank Yablans;yes
...

Cada linha deve conter:
	•	year: Ano do lançamento do filme.
	•	title: Título do filme.
	•	studios: Estúdio responsável.
	•	producers: Nome do(s) produtor(es).
	•	winner: Campo opcional que indica “yes” para filmes vencedores e permanece vazio para não vencedores.

Como Executar a API
	1.	Certifique-se de que o arquivo movielist.csv está na pasta raiz do projeto.

	2.	Inicie o servidor com o comando:

        node server.js 

    3.	Acesse a API pelo seguinte endpoint:
        http://localhost:3000/awards/intervals

------------------------------------------------------------------------------------------------------------------------------------------------------

Estrutura da API
A API possui um único endpoint GET /awards/intervals que retorna os produtores com o maior e o menor intervalo entre prêmios consecutivos. A resposta segue o formato JSON especificado.

Endpoint
	GET /awards/intervals: Retorna os intervalos de prêmios dos produtores.

Parâmetros de Requisição

Não há parâmetros adicionais para a requisição.

------------------------------------------------------------------------------------------------------------------------------------------------------

Exemplo de Resposta da API

A resposta da API /awards/intervals tem o seguinte formato:

{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    },
    {
      "producer": "Producer 2",
      "interval": 1,
      "previousWin": 2018,
      "followingWin": 2019
    }
  ],
  "max": [
    {
      "producer": "Producer 1",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    },
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 2000,
      "followingWin": 2099
    }
  ]
}

	•	min: Lista de produtores com o menor intervalo entre prêmios consecutivos.
	•	max: Lista de produtores com o maior intervalo entre prêmios consecutivos.
	•	interval: Número de anos entre os prêmios consecutivos.
	•	previousWin: Ano do prêmio anterior.
	•	followingWin: Ano do prêmio subsequente.

------------------------------------------------------------------------------------------------------------------------------------------------------

Testes
O projeto inclui testes de integração para garantir a funcionalidade correta da API.

	1.	Executar os Testes
    Para rodar os testes de integração, use o comando:

        npm test

    2.	Estrutura dos Testes
	•	O teste verifica se a API retorna os dados nos formatos corretos e se a lógica de intervalos entre prêmios está implementada corretamente.

------------------------------------------------------------------------------------------------------------------------------------------------------

Estrutura do Projeto
Aqui está a estrutura do projeto:

awards-api/
├── movies.csv               # Arquivo CSV com a lista de filmes
├── server.js                # Código principal do servidor Express
├── package.json             # Configuração do projeto Node.js
├── tests/                   # Pasta para os testes de integração
│   └── app.test.js          # Testes de integração para a API
└── README.md                # Instruções para rodar o projeto e os testes

------------------------------------------------------------------------------------------------------------------------------------------------------

Explicação dos Arquivos

	•	server.js: Contém a configuração do servidor, a lógica de leitura do arquivo CSV e o endpoint da API.
	•	app.test.js: Arquivo de testes de integração para verificar a funcionalidade da API.
	•	movies.csv: Arquivo de entrada com a lista de filmes, que é carregado no banco de dados em memória.
	•	README.md: Instruções detalhadas para configurar, executar e testar o projeto.

Esse README.md cobre todas as instruções necessárias para configurar, executar e testar a API, incluindo explicações sobre o formato de resposta e a estrutura do projeto.