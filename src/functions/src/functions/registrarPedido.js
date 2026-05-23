const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("rapidgo-db");
const container = database.container("pedidos");

app.http("registrarPedido", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "registrarPedido",
    handler: async (request, context) => {
        context.log("registrarPedido ejecutado");

        let body;
        try {
            body = await request.json();
        } catch {
            return { status: 400, jsonBody: { error: "Body JSON inválido" } };
        }

        const { clienteId, restauranteId, productos, direccionEntrega } = body;

        if (!clienteId || !productos || !direccionEntrega) {
            return {
                status: 400,
                jsonBody: { error: "Faltan campos obligatorios: clienteId, productos, direccionEntrega" }
            };
        }

        const pedido = {
            id: `pedido-${Date.now()}`,
            clienteId,
            restauranteId,
            productos,
            direccionEntrega,
            estado: "confirmado",
            fechaCreacion: new Date().toISOString()
        };

        const { resource } = await container.items.create(pedido);

        return {
            status: 201,
            jsonBody: resource
        };
    }
});
