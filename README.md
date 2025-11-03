La aplicación tiene dos interfaces principales:

Panel de Administración: Una sección privada (/admin) para que la agencia o administrador inicie sesión y visualice el dashboard, historial de pagos y logs.

Flujo de Pago Público: Una sección pública (/pay/...) para que el cliente final vea los detalles de su pago y sea redirigido a Mercado Pago.

/src/api
Contiene toda la lógica para conectarse con el servidor backend.

apiClient.js: Configura axios. Define la baseURL (leyendo la URL del backend desde el archivo .env) y los "interceptors" que añaden automáticamente el token de autenticación a cada solicitud.

adminService.js: Define todas las funciones que llaman a los endpoints privados del admin (ej. login, getStats, getPayments, getLogs). Aquí es donde se activan los datos falsos (mocks) para probar.

paymentService.js: Define las funciones que llaman a los endpoints públicos del cliente (ej. getPaymentDetails).

/src/components
Contiene todos los componentes de React que se reutilizan en varias páginas. Está dividido por contexto:

**/common:** Componentes genéricos usados en todo el sitio (ej. Button.jsx, Card.jsx, Input.jsx, Modal.jsx, LoadingSpinner.jsx, Toast.jsx).

**/admin:** Componentes usados solo en el panel de administración (ej. AdminNavBar.jsx, Sidebar.jsx, StatCard.jsx, PaymentsTable.jsx, LogFeed.jsx).

**/payment:** Componentes usados solo en el flujo de pago público (ej. PaymentInfo.jsx).

/src/context
Gestiona el estado global de la aplicación, principalmente la autenticación del administrador.

AuthContext.js: Define el AuthContext de React.

AuthProvider.jsx: Es el componente "proveedor" que envuelve a toda la aplicación. Mantiene el estado del usuario y el token, y proporciona las funciones login() y logout() al resto de la app.

/src/hooks
Contiene los "hooks" personalizados de React que encapsulan lógica compleja y reutilizable.

useAuth.js: Un hook simple (useContext) para acceder fácilmente a la información del AuthContext (como user o login()) desde cualquier componente.

useApi.js: Un hook muy útil que maneja las llamadas a la API. Se le pasa una función (ej. adminService.getStats) y él se encarga de gestionar los estados de loading, error y data por nosotros.

/src/layouts
Componentes que definen la "plantilla" o estructura visual de un grupo de páginas (ej. la cabecera, el pie de página, la barra lateral).

AdminLayout.jsx: La plantilla "privada" para el administrador. Renderiza la Sidebar y AdminNavbar y protege las rutas internas. Si el usuario no está autenticado, lo redirige al Login.

PublicLayout.jsx: La plantilla "pública" y limpia que se usa para las páginas del flujo de pago (/pay/...).

/src/pages
Componentes que representan una página completa de la aplicación. Son los que se cargan directamente desde el enrutador (App.jsx).

**/admin:** Las vistas del panel de admin (ej. Login.jsx, Dashboard.jsx, PaymentHistory.jsx, AuditLogs.jsx).

**/payment:** Las vistas del flujo de pago público (ej. PaymentDetails.jsx, PaymentSuccess.jsx, PaymentFailure.jsx).

/src/styles
Contiene el 100% de los estilos de la aplicación.

global.css: El único archivo de estilos. Contiene las variables CSS (:root), un reseteo básico, y todas las clases de CSS nativo (como .card, .btn, .admin-navbar, etc.) que usan los componentes .jsx.

/src/utils
Contiene funciones "helper" puras de JavaScript que no son componentes de React.

dateUtils.js: Funciones para formatear fechas y horas (configurado para America/Lima).

formatUtils.js: Funciones para formatear valores (configurado para moneda PEN - Soles Peruanos).

statusUtils.js: Funciones que devuelven texto o íconos basados en un estado (ej. getPaymentStatusText('approved') devuelve "Aprobado").

validators.js: Funciones para validar formularios (ej. isValidEmail).