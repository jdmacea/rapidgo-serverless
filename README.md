Backend Serverless para Aplicación Móvil



Descripción de la empresa 
RapidGo es una startup colombiana de servicios de domicilios fundada en 2022 que opera actualmente en Medellín, Manizales y Pereira. La plataforma conecta a clientes con restaurantes y tiendas locales a través de una aplicación móvil disponible en Android e iOS, desarrollada en React Native, y cuenta con una red de 340 repartidores activos. En sus primeros dos años de operación, RapidGo procesó en promedio 1.200 pedidos diarios con picos de hasta 4.500 pedidos en días festivos y fines de semana. Su modelo de negocio cobra una comisión del 18% por pedido completado, lo que hace que la disponibilidad del sistema sea directamente proporcional a sus ingresos: cada minuto de caída representa pérdidas estimadas de $180.000 COP en horas pico. 

3.2 Situación tecnológica actual y problemas identificados 

El backend actual es una aplicación monolítica en Node.js desplegada en un servidor dedicado en un datacenter de Medellín. El equipo de tecnología ha documentado los siguientes 

problemas críticos que bloquean el crecimiento de la empresa: 

• Escalabilidad manual: en horas pico (12m-2pm y 6pm-9pm) el servidor se satura y el tiempo de respuesta de la API supera los 8 segundos, generando cancelaciones espontáneas de pedidos estimadas en un 12% del tráfico. 

• Costo fijo ineficiente: el servidor dedicado cuesta $4.200.000 COP mensuales independientemente del tráfico. En horas de baja demanda (2am-8am) el uso de CPU no supera el 4%, lo que representa un desperdicio significativo de recursos. 

• Despliegues con tiempo de inactividad: cualquier actualización del backend requiere 2030 minutos de inactividad programada, impactando ventas nocturnas y generando mala 
experiencia de usuario. 

• Notificaciones no confiables: el sistema actual de push notifications tiene una tasa de entrega del 67% debido a la falta de integración directa con FCM y APNs, generando 
confusión en clientes sobre el estado de sus pedidos. 

• Sin tolerancia a fallos: no existe redundancia ni plan de recuperación. Un fallo de hardware implica caída total del servicio con tiempos históricos de restauración de 2 a 6 
horas. 

• Deuda técnica en autenticación: el manejo de tokens JWT está implementado de forma artesanal en el monolito, sin un gateway centralizado, lo que dificulta agregar nuevos 
clientes (app web, API pública) en el futuro. 

3.3 Requerimientos para la nueva arquitectura El equipo directivo de RapidGo ha definido los siguientes requerimientos no funcionales que la 
nueva arquitectura debe cumplir. El grupo debe verificar en los ADRs que las decisiones 

Justificación:

Se identifican tres actores principales: el Cliente, el Repartidor y el Administrador. El Cliente utiliza la aplicación móvil para realizar pedidos y consultar su estado; el Repartidor la usa para gestionar entregas; y el Administrador supervisa la operación general de la plataforma.

El RapidGo Backend Serverless se ubica como sistema principal porque será el encargado de procesar la lógica de negocio relacionada con pedidos, usuarios, estados de entrega y notificaciones. 

En este sistema se incluyen externos necesarios para el funcionamiento de la soluciónen en la pasarela de pagos, utilizada para procesar las transacciones de los pedidos; Firebase para enviar notificaciones push a dispositivos Android; y APNs usado para enviar notificaciones push a dispositivos iOS.



| Requerimiento      | Métrica objetivo                    | Motivación                                                      |
|--------------------|-------------------------------------|-----------------------------------------------------------------|
| Disponibilidad     | 99.9% mensual                       | Máximo 44 minutos de inactividad al mes                         |
| Latencia de API    | < 800 ms en P95                     | Reducir cancelaciones por lentitud del sistema                  |
| Escalabilidad      | 500 req/seg sin intervención manual | Soportar días festivos y campañas de marketing                  |
| Modelo de costos   | Pago por uso real                   | Eliminar el costo fijo del servidor dedicado                    |
| Despliegue         | Zero-downtime                       | No afectar pedidos en curso durante actualizaciones             |
| Notificaciones push| Tasa de entrega > 95%               | Mejorar experiencia del cliente con estados en tiempo real      |



