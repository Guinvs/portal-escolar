require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
console.log("URL:", process.env.DATABASE_URL);


const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {

  // 🔵 LISTAR avisos
  if (req.url === "/avisos" && req.method === "GET") {
    const result = await sql`SELECT * FROM avisos ORDER BY id DESC`;
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });
    return res.end(JSON.stringify(result));
  }

  // 🟢 CRIAR aviso
  if (req.url === "/avisos" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      const { titulo, descricao, data } = JSON.parse(body);
      const result = await sql`
        INSERT INTO avisos (titulo, descricao, data)
        VALUES (${titulo}, ${descricao}, ${data})
        RETURNING *
      `;
      res.writeHead(201, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      return res.end(JSON.stringify(result[0]));
    });
    return;
  }

  // 🔴 DELETAR aviso
  if (req.url.startsWith("/avisos/") && req.method === "DELETE") {
    const id = req.url.split("/")[2];
    await sql`DELETE FROM avisos WHERE id = ${id}`;
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });
    return res.end(JSON.stringify({ success: true }));
  }

  // ⚪ CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  // 🟡 Rota padrão
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*"
  });
  res.end("API rodando 🚀");
};

http.createServer(requestHandler).listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});