const { NotificationHubsClient } = require("@azure/notification-hubs");

module.exports = async function (context, req) {
    context.log("notificarCliente ejecutado");

    if (req.method !== "POST") {
        context.res = { status: 405, body: "Método no permitido" };
        return;
    }

    const { clienteId, pedidoId, estado, mensaje } = req.body;

    if (!clienteId || !pedidoId || !estado) {
        context.res = {
            status: 400,
            body: { error: "Faltan campos obligatorios: clienteId, pedidoId, estado" }
        };
        return;
    }

    const mensajeNotificacion = mensaje || `Tu pedido ${pedidoId} está ahora en estado: ${estado}`;

    const notificacion = {
        body: JSON.stringify({
            notification: {
                title: "RapidGo - Actualización de pedido",
                body: mensajeNotificacion
            },
            data: {
                pedidoId,
                estado,
                clienteId
            }
        })
    };

    context.log(`Notificación enviada a cliente ${clienteId}: ${mensajeNotificacion}`);

    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
            success: true,
            clienteId,
            pedidoId,
            estado,
            mensaje: mensajeNotificacion
        }
    };
};