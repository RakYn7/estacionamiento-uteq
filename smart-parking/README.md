# 🅿️ UTEQ Smart Parking - Módulo CRUD Vehículos y Propietarios

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![CoreUI](https://img.shields.io/badge/CoreUI-React-321D47?style=for-the-badge&logo=coreui&logoColor=white)
![Status](https://img.shields.io/badge/Estado-Completado-brightgreen?style=for-the-badge)

Sistema web para el control, registro y gestión de vehículos autorizados y propietarios dentro del campus de la **Universidad Técnica de Quevedo (UTEQ)**. Desarrollado con React y persistencia en tiempo real en la nube con Supabase.

---

## 📸 Vista Previa de la Aplicación

![Vista Principal de UTEQ Smart Parking](./src/assets/captura_app.png)
*(Nota: Asegúrate de guardar una captura de la app en `src/assets/captura_app.png` o reemplaza este enlace por la URL directa de la imagen en tu repositorio).*

---

## 🚀 Características y Funcionalidades (CRUD Completo)

- **📋 Listado y Paginación:** Visualización clara de registros con paginación interactiva (5 vehículos por página) y conteo dinámico.
- **🔍 Búsqueda en Tiempo Real:** Filtro reactivo instantáneo por placa, nombre del propietario, cédula o modelo de vehículo.
- **➕ Registrar Vehículo (Create):** Modal interactivo con validación estricta de campos obligatorios y formato de correo institucional (`@uteq.edu.ec`).
- **👁️ Vista de Detalle (Read):** Inspección completa del registro al hacer clic sobre cualquier fila de la tabla.
- **✏️ Editar Registro (Update):** Formulario emergente prellenado con los datos actuales para modificar la información en la base de datos Supabase.
- **🗑️ Eliminar con Confirmación (Delete):** Borrado seguro de vehículos previa confirmación emergente para prevenir pérdidas accidentales.
- **🔔 Validaciones y Feedback:** Alertas visuales de éxito/error, avisos de carga (`Cargando...`) y deshabilitado de botones durante operaciones de red para evitar peticiones duplicadas.

---

## 🛡️ Configuración de Base de Datos y RLS

- **Motor DB:** Supabase (PostgreSQL).
- **Tabla:** `vehiculos`
- **Seguridad RLS (Row Level Security):** Políticas habilitadas para permitir consultas, inserciones, actualizaciones y eliminaciones autorizadas.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React + Vite
- **Estilos & UI:** Componentes e interfaz inspirados en **CoreUI React**
- **Base de Datos:** Supabase JS Client
- **Control de Versiones:** Git & GitHub

---

## 📁 Estructura del Proyecto

```text
/
├── src/
│   ├── assets/
│   │   └── captura_app.png
│   ├── App.css
│   ├── App.jsx
│   ├── main.jsx
│   └── supabaseClient.js
├── .gitignore
├── index.html
├── package.json
└── README.md