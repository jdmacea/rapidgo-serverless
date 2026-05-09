# RapidGo · Backend Serverless en Azure

> **Caso 01 — Trabajo Grupal** · Análisis e Implementación de Arquitectura Cloud
> Computación en la Nube · Semestre 2026-1 · Tecnológico de Antioquia
> **Profesor:** Julian David Florez Sanchez
> **Fecha de entrega:** 14 de mayo de 2026

---

## Integrantes del equipo

| Nombre completo | Rol en el proyecto |
|-----------------|--------------------|
| Yeifer Andres Castaño Sariego | Backend / Implementación |
| Juan David Macea | Documentación / Diagramas |
| [Integrante 3] | [Rol] |
| [Integrante 4] | [Rol] |

---

## Tabla de contenido

1. [Contexto del caso](#1-contexto-del-caso)
2. [Modelo C4](#2-modelo-c4)
3. [Decisiones arquitectónicas (ADRs)](#3-decisiones-arquitectónicas-adrs)
4. [Implementación del flujo crítico](#4-implementación-del-flujo-crítico)
5. [Evidencias](#5-evidencias-de-implementación)
6. [Conclusiones](#6-conclusiones)

---

## 1. Contexto del caso

### 1.1 Descripción de la empresa

RapidGo es una startup colombiana de servicios de domicilios fundada en 2022 que opera actualmente en Medellín, Manizales y Pereira. La plataforma conecta a clientes con restaurantes y tiendas locales a través de una aplicación móvil disponible en Android e iOS, desarrollada en React Native, y cuenta con una red de 340 repartidores activos. En sus primeros dos años de operación, RapidGo procesó en promedio 1.200 pedidos diarios con picos de hasta 4.500 pedidos en días festivos y fines de semana. Su modelo de negocio cobra una comisión del 18% por pedido completado, lo que hace que la disponibilidad del sistema sea directamente proporcional a sus ingresos: cada minuto de caída representa pérdidas estimadas de $180.000 COP en horas pico.

### 1.2 Problemas identificados en la arquitectura actual

El backend actual es una aplicación monolítica en Node.js desplegada en un servidor dedicado en un datacenter de Medellín. Los problemas críticos que bloquean el crecimiento de la empresa son:

- **Escalabilidad manual:** en horas pico (12m–2pm y 6pm–9pm) el servidor se satura y el tiempo de respuesta de la API supera los 8 segundos, generando cancelaciones espontáneas estimadas en un 12% del tráfico.
- **Costo fijo ineficiente:** el servidor dedicado cuesta $4.200.000 COP mensuales independientemente del tráfico. En horas de baja demanda (2am–8am) el uso de CPU no supera el 4%.
- **Despliegues con tiempo de inactividad:** cualquier actualización requiere 20–30 minutos de inactividad programada.
- **Notificaciones no confiables:** la tasa de entrega es de apenas 67% por la falta de integración directa con FCM y APNs.
- **Sin tolerancia a fallos:** no hay redundancia ni plan de recuperación. Tiempos históricos de restauración: 2 a 6 horas.
- **Deuda técnica en autenticación:** JWT implementado de forma artesanal, sin gateway centralizado.

### 1.3 Requerimientos no funcionales

| Requerimiento       | Métrica objetivo                    | Motivación |
|---------------------|-------------------------------------|------------|
| Disponibilidad      | 99.9% mensual                       | Máximo 44 minutos de inactividad al mes |
| Latencia de API     | < 800 ms en P95                     | Reducir cancelaciones por lentitud |
| Escalabilidad       | 500 req/seg sin intervención manual | Soportar días festivos y campañas |
| Modelo de costos    | Pago por uso real                   | Eliminar el costo fijo del servidor dedicado |
| Despliegue          | Zero-downtime                       | No afectar pedidos en curso |
| Notificaciones push | Tasa de entrega > 95%               | Mejorar experiencia del cliente |

### 1.4 Restricciones del proyecto

- Las Azure Functions deben implementarse en **Node.js o Python** (el equipo no tiene experiencia en Java ni .NET).
- Presupuesto: máximo **$50 USD/mes** durante la fase piloto. Priorizar tier gratuito.
- La base de datos actual es MySQL relacional. Cualquier cambio a NoSQL debe justificarse en el ADR-02.
- Los datos deben almacenarse en la región **Brazil South** o **East US** por latencia y soberanía.
- La app React Native no se rediseña: se debe mantener compatibilidad con los contratos JSON actuales.
- El equipo de infraestructura es de una sola persona: minimizar carga operativa.

---

## 2. Modelo C4

### C1 — Diagrama de Contexto

![Diagrama C1 - Contexto](./assets/c1-contexto.png)

**Descripción:**

El sistema **RapidGo Backend Serverless** es el responsable de procesar la lógica de negocio relacionada con pedidos, usuarios, estados de entrega y notificaciones.

Se identifican tres actores principales:

- **Cliente:** utiliza la aplicación móvil para realizar pedidos y consultar su estado.
- **Repartidor:** utiliza la app para gestionar las entregas asignadas.
- **Administrador:** supervisa la operación general de la plataforma.

Los sistemas externos integrados son:

- **Pasarela de pagos:** procesa las transacciones de los pedidos completados.
- **Firebase Cloud Messaging (FCM):** entrega notificaciones push a dispositivos Android.
- **Apple Push Notification Service (APNs):** entrega notificaciones push a dispositivos iOS.

### C2 — Diagrama de Contenedores

*Pendiente*

### C3 — Diagrama de Componentes

*Pendiente*

---

## 3. Decisiones arquitectónicas (ADRs)

*Pendiente*

---

## 4. Implementación del flujo crítico

*Pendiente*

---

## 5. Evidencias de implementación

*Pendiente*

---

## 6. Conclusiones

*Pendiente*