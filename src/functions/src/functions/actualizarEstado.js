const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("rapidgo-db");
const container = database.container("pedidos");

module.exports = async function (context, req) {
    context.log("actualizarEstado ejecutado");

    if (req.method !== "PUT") {
        context.res = { status: 405, body: "Método no permitido" };
        return;
    }

    const pedidoId = req.params.id;
    const { estado, clienteId } = req.body;

    if (!pedidoId || !estado || !clienteId) {
        context.res = {
            status: 400,
            body: { error: "Faltan campos obligatorios: id, estado, clienteId" }
        };
        return;
    }

    const estadosValidos = ["confirmado", "en_preparacion", "en_camino", "entregado", "cancelado"];
    if (!estadosValidos.includes(estado)) {
        context.res = {
            status: 400,
            body: { error: `Estado inválido. Valores permitidos: ${estadosValidos.join(", ")}` }
        };
        return;
    }

    const { resource: pedido } = await container.item(pedidoId, clienteId).read();

    if (!pedido) {
        context.res = { status: 404, body: { error: "Pedido no encontrado" } };
        return;
    }

    pedido.estado = estado;
    pedido.fechaActualizacion = new Date().toISOString();

    const { resource: updated } = await container.items.upsert(pedido);

    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: updated
    };
};