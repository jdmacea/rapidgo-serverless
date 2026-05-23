const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("rapidgo-db");
const container = database.container("pedidos");

const ESTADOS_VALIDOS = ["confirmado", "en_preparacion", "en_camino", "entregado", "cancelado"];

app.http("actualizarEstado", {
    methods: ["PUT"],
    authLevel: "anonymous",
    route: "actualizarEstado/{id}",
    handler: async (request, context) => {
        context.log("actualizarEstado ejecutado");

        const pedidoId = request.params.id;

        let body;
        try {
            body = await request.json();
        } catch {
            return { status: 400, jsonBody: { error: "Body JSON inválido" } };
        }

        const { estado, clienteId } = body;

        if (!pedidoId || !estado || !clienteId) {
            return {
                status: 400,
                jsonBody: { error: "Faltan campos obligatorios: id (en URL), estado, clienteId" }
            };
        }

        if (!ESTADOS_VALIDOS.includes(estado)) {
            return {
                status: 400,
                jsonBody: { error: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(", ")}` }
            };
        }

        const { resource: pedido } = await container.item(pedidoId, clienteId).read();

        if (!pedido) {
            return { status: 404, jsonBody: { error: "Pedido no encontrado" } };
        }

        pedido.estado = estado;
        pedido.fechaActualizacion = new Date().toISOString();

        const { resource: updated } = await container.items.upsert(pedido);

        return {
            status: 200,
            jsonBody: updated
        };
    }
});
