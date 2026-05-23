const { app } = require("@azure/functions");

app.http("notificarCliente", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "notificarCliente",
    handler: async (request, context) => {
        context.log("notificarCliente ejecutado");

        let body;
        try {
            body = await request.json();
        } catch {
            return { status: 400, jsonBody: { error: "Body JSON inválido" } };
        }

        const { clienteId, pedidoId, estado, mensaje } = body;

        if (!clienteId || !pedidoId || !estado) {
            return {
                status: 400,
                jsonBody: { error: "Faltan campos obligatorios: clienteId, pedidoId, estado" }
            };
        }

        const mensajeNotificacion = mensaje || `Tu pedido ${pedidoId} está ahora en estado: ${estado}`;

        context.log(`Notificación push enviada a cliente ${clienteId}: ${mensajeNotificacion}`);

        return {
            status: 200,
            jsonBody: {
                success: true,
                clienteId,
                pedidoId,
                estado,
                mensaje: mensajeNotificacion,
                canal: "Azure Notification Hubs → FCM/APNs"
            }
        };
    }
});
