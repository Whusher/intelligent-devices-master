# Requerimientos para WEB Integral y IoT
El proyecto general se relata en un sistema ERP para el control de dispositivos IoT(ESP32).

Este debe cumplir con las siguientes normativas:
- Sistema abierto
- Interfaz de patron de diseño (Formatos de respuesta, metodos, protocolos de comunicacion)
- Interfaz Grafica modulada por equipos en general.
- Contratos de funcionamiento (ESP32, MQTT, Backend Tecnologias abiertas/cerradas).

## Requerimientos de Infraestructura
CI/CD:
- Plataforma de despliegue
- Pasos de integracion
- Capacitacion y aprobacion previo al despliegue
- Pull requests

Servidor:
- Administrador de servicios
- Monitoreo continuo
- Clusterizacion bajo NGNIX para High availability
- Servidor de base de datos (Clusterizado vs Dedicado)

Github Monorepo:
- Distribucion de branches
- 3 ramas de produccion (PRDTEST, PREPRD, PROD)

Herramientas de control (POR DEFINIR):
- Jenkins/ Github actions 
- Administracion especializada en servidor
- Protocolos de seguridad e integracion de OWASP TOP 10