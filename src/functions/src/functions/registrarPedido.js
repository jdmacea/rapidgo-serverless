const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("rapidgo-db");
const container = database.container("pedidos");

module.exports = async function (context, req) {
    context.log("registrarPedido ejecutado");

    if (req.method !== "POST") {
        context.res = { status: 405, body: "Método no permitido" };
        return;
    }

    const { clienteId, restauranteId, productos, direccionEntrega } = req.body;

    if (!clienteId || !productos || !direccionEntrega) {
        context.res = {
            status: 400,
            body: { error: "Faltan campos obligatorios: clienteId, productos, direccionEntrega" }
        };
        return;
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

    context.res = {
        status: 201,
        headers: { "Content-Type": "application/json" },
        body: resource
    };
};