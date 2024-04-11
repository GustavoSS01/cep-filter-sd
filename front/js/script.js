let urlCep = "/cep/*";

let urlRua = "/rua/uf/cidade/**";

let urlUfs = "/ufs/estados/";

let urlCidades = "/uf/cidades/";


$(document).ready(function () {
  // Variáveis com as URLs das chamadas do viacep
  console.log("carreguei a página");
  fetch(urlUfs)
    .then((res) => {
      return res.json();
    })
    .then((dados) => {
      $("#estados").html(
        dados.map(
          (dado) =>
            `<option value="${dado.id}${dado.sigla}">${dado.nome}</option>`,
        ),
      );
    });
});

function pegarCidades(id) {
  console.log("cidades:", id.value.substr(0, 2));
  
  let urlCidade = urlCidades + id.value.substr(0, 2);
  
  console.log(urlCidade)
  
  fetch(urlCidade)
    .then((res) => {
      return res.json();
    })
    .then((dados) => {
      console.log("cidades: ", dados);

      let options = "";

      for (let dado of dados) {
        options += `<option value="${dado.nome}">${dado.nome}</option>`;
      }
      $("#cidades").html(options);
    });
}

function viaCep(url, tipo) {
  if (tipo == "rua") {  
    console.log("url rua: ", url)
    buscaVia(url);
  } else {
    console.log("url cep: ", url);
    buscaVia(url);
  }
}

// Função chamada pela viaCep recebendo a URL montada
function buscaVia(url) {
  fetch(encodeURIComponent(url))
    .then((res) => {
      return res.json();
    })
    .then((dados) => {
      console.log(dados);
      let card = gerarCards(dados);
      $("#content").html(card);
    });
}

// Funçao para gerar cards
function gerarCards(dados) {
  if (dados.length > 1) {
    let cards = "";
    $("#contador").html(`Foram encontradas ${dados.length} ruas`);
    for (let dado of dados) {
      cards += `
   <ul class="collection">
    <li class="collection-item avatar">
      <span>${dado.logradouro}</span> <br>
      <span>${dado.localidade}</span> <br>
      <span>${dado.bairro}</span> <br>
      </p>
    </li>
    </ul>
      `;
    }
    return cards;
  } else {
    $("#contador").html("");
    return `
   <ul class="collection">
    <li class="collection-item avatar">
      <span>${dados.logradouro}</span> <br>
      <span>${dados.localidade}</span> <br>
      <span>${dados.bairro}</span> <br>
    </li>
    </ul>
      `;
  }
}

// Função chamda ao sair do campo cep
function buscaCep(cep) {
  let newUrl = urlCep.replace("*", cep.value);
  viaCep(newUrl, "cep");
}

// Função chamada ao sair do campo rua
function buscaRua(rua) {
  console.log(rua.value);

  let uf = document.getElementById("estados").value.substr(2, 3);
  let cidade = document.getElementById("cidades").value;

  console.log("uf", uf);
  console.log("cidade", cidade);

  let newUrl = urlRua.replace("**", rua.value);

  newUrl = newUrl.replace("uf", uf);
  newUrl = newUrl.replace("cidade", cidade);

  console.log(newUrl);
  viaCep(newUrl, "rua");
}