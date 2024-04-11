const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer(async (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	const url = req.url;

	if (url === "/") {
		// Serve o arquivo index.html
		fs.readFile(path.join(__dirname, "front", "index.html"), (err, data) => {
			if (err) {
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Erro interno no servidor");
				return;
			} else {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.end(data);
				return;
			}
		});
	} else if (url.startsWith("/css/") || url.startsWith("/js/")) {
		// Serve arquivos CSS, JS e imagem
		fs.readFile(path.join(__dirname, "front", url), (err, data) => {
			if (err) {
				res.writeHead(404, { "Content-Type": "text/plain" });
				res.end("Arquivo não encontrado");
				return;
			} else {
				let contentType = "text/html";
				if (url.endsWith(".css")) {
					contentType = "text/css";
				} else if (url.endsWith(".js")) {
					contentType = "text/javascript";
				} else if (url.endsWith(".png")) {
					contentType = "image/png";
				}
				res.writeHead(200, { "Content-Type": contentType });
				res.end(data);
				return;
			}
		});
	} else if (url.includes("/cep")) {
		console.log("cep", url.split("/")[2]);
		const urlCep = "https://viacep.com.br/ws/" + url.split("/")[2] + "/json";
		fetch(urlCep, { method: "GET" })
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Erro ao obter dados do CEP");
				}
			})
			.then((data) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(data));
				return;
			})
			.catch((err) => {
				console.error(err);
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Erro interno no servidor");
				return;
			});
	} else if (url.includes("/rua")) {
		console.log("rua", url.split("/"));

		const urlRua = `https://viacep.com.br/ws/${url.split("/")[2]}/${url.split("/")[3]}/${url.split("/")[4]}/json`;

		fetch(urlRua, { method: "GET" })
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Erro ao obter dados da Rua");
				}
			})
			.then((data) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(data));
				return;
			})
			.catch((err) => {
				console.error(err);
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Erro interno no servidor");
				return;
			});
	} else if (url.includes("/ufs")) {
		console.log("ufs carregadas: ", url);

		const urlUfs =
			"https://servicodados.ibge.gov.br/api/v1/localidades/estados";

		fetch(urlUfs, { method: "GET" })
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Erro ao obter dados da Estados");
				}
			})
			.then((data) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(data));
				return;
			})
			.catch((err) => {
				console.error(err);
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Erro interno no servidor");
				return;
			});
	} else if (url.includes("/cidades")) {
		console.log("municipios carregados", url);
		const estadoId = url.split("/")[3];

		const urlUf = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`;
		fetch(urlUf, { method: "GET" })
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Erro ao obter dados dos municípios");
				}
			})
			.then((data) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(data));
				return;
			})
			.catch((err) => {
				console.error(err);
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Erro interno no servidor");
				return;
			});
	} else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Endpoint not found");
	}
});

server.listen(3000);
