const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("rapidgo-db");
const container = database.container("pedidos");

app.http("consultarHistorial", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "consultarHistorial",
    handler: async (request, context) => {
        context.log("consultarHistorial ejecutado");

        const clienteId = new URL(request.url).searchParams.get("clienteId");

        if (!clienteId) {
            return {
                status: 400,
                jsonBody: { error: "Se requiere el parámetro clienteId" }
            };
        }

        const querySpec = {
            query: "SELECT * FROM c WHERE c.clienteId = @clienteId ORDER BY c.fechaCreacion DESC",
            parameters: [{ name: "@clienteId", value: clienteId }]
        };

        const { resources: pedidos } = await container.items.query(querySpec).fetchAll();

        return {
            status: 200,
            jsonBody: { clienteId, total: pedidos.length, pedidos }
        };
    }
});
