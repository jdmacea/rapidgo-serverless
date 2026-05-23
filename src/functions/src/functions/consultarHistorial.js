const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("rapidgo-db");
const container = database.container("pedidos");

module.exports = async function (context, req) {
    context.log("consultarHistorial ejecutado");

    if (req.method !== "GET") {
        context.res = { status: 405, body: "Método no permitido" };
        return;
    }

    const clienteId = req.query.clienteId;

    if (!clienteId) {
        context.res = {
            status: 400,
            body: { error: "Se requiere el parámetro clienteId" }
        };
        return;
    }

    const querySpec = {
        query: "SELECT * FROM c WHERE c.clienteId = @clienteId ORDER BY c.fechaCreacion DESC",
        parameters: [{ name: "@clienteId", value: clienteId }]
    };

    const { resources: pedidos } = await container.items.query(querySpec).fetchAll();

    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { clienteId, total: pedidos.length, pedidos }
    };
};