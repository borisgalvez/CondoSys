import { lazy, Suspense } from "react";
import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { UserRole } from "./types/roles";
import { AuthProvider } from "./context/AuthProvider";
import { ConfigProvider } from "./context/ConfigProvider";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const UsersPage = lazy(() => import("./pages/users/UsersPage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const ApartmentsPage = lazy(() => import("./pages/users/ApartmentsPage"));
const BlocksPage = lazy(() => import("./pages/users/BlocksPage"));
const MaintencePage = lazy(() => import("./pages/maintenance/MaintencePage"));
const ExtraordinaryPayment = lazy(
  () => import("./pages/finances/ExtraordinaryPaymentPage")
);
const GasMetersPage = lazy(() => import("./pages/users/GasMetersPage"));
const ElectricityPage = lazy(
  () => import("./pages/electricity/ElectricityPage")
);
const ElectricityDetailPayment = lazy(
  () => import("./pages/electricity/ElectricityDetailPayment")
);
const TransactionHistoryPage = lazy(
  () => import("./pages/history/TransactionHistoryPage")
);
const FinanceDashboard = lazy(
  () => import("./pages/finances/FinanceDashboard")
);
const InvoicesPage = lazy(() => import("./pages/finances/InvoicesPage"));
const PaymentExpensesPage = lazy(
  () => import("./pages/finances/PaymentAndExpensePage")
);
const HistoricGasPaymentsPage = lazy(
  () => import("./pages/finances/HistoricGasPaymentsPage")
);
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const CondominiumsPage = lazy(() => import("./pages/users/CondominiumsPage"));
const NotificationsPage = lazy(
  () => import("./pages/notifications/NotificationsPage")
);
const PayrollPage = lazy(() => import("./pages/payrolls/PayrollPage"));
function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <ConfigProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <Center h="100vh">
                  <Spinner size="xl" />
                </Center>
              }
            >
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Rutas privadas protegidas */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* Módulo Usuarios */}
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[UserRole.SUPERADMIN, UserRole.ADMIN]}
                      />
                    }
                  >
                    <Route path="/usuarios" element={<UsersPage />} />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[UserRole.SUPERADMIN, UserRole.ADMIN]}
                      />
                    }
                  >
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[UserRole.SUPERADMIN, UserRole.ADMIN]}
                      />
                    }
                  >
                    <Route
                      path="/admin/notifications"
                      element={<NotificationsPage />}
                    />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.RECEPCIONISTA,
                          UserRole.PROPIETARIO,
                          UserRole.INQUILINO,
                        ]}
                      />
                    }
                  >
                    <Route
                      path="/transactions/history"
                      element={<TransactionHistoryPage />}
                    />
                  </Route>
                  {/* Módulo Edificio */}
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.RECEPCIONISTA,
                          UserRole.PROPIETARIO,
                          UserRole.INQUILINO,
                        ]}
                      />
                    }
                  >
                    <Route path="/apartamentos" element={<ApartmentsPage />} />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[UserRole.SUPERADMIN, UserRole.ADMIN]}
                      />
                    }
                  >
                    <Route path="/condominios" element={<CondominiumsPage />} />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.RECEPCIONISTA,
                          UserRole.PROPIETARIO,
                          UserRole.INQUILINO,
                        ]}
                      />
                    }
                  >
                    <Route path="/bloques" element={<BlocksPage />} />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.RECEPCIONISTA,
                          UserRole.PROPIETARIO,
                          UserRole.INQUILINO,
                          UserRole.SECRETARIA,
                        ]}
                      />
                    }
                  >
                    <Route path="/mantenimiento" element={<MaintencePage />} />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.SECRETARIA,
                        ]}
                      />
                    }
                  >
                    <Route path="/pago-empleados" element={<PayrollPage />} />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.RECEPCIONISTA,
                          UserRole.PROPIETARIO,
                          UserRole.INQUILINO,
                        ]}
                      />
                    }
                  >
                    <Route path="/medidores" element={<GasMetersPage />} />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.SECRETARIA,
                          UserRole.PROPIETARIO,
                          UserRole.INQUILINO,
                        ]}
                      />
                    }
                  >
                    <Route
                      path="/consumo/electricidad"
                      element={<ElectricityPage />}
                    />
                  </Route>
                  {/* Módulo Finanzas */}
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.SECRETARIA,
                        ]}
                      />
                    }
                  >
                    <Route
                      path="/finanzas/dashboard"
                      element={<FinanceDashboard />}
                    />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.SECRETARIA,
                        ]}
                      />
                    }
                  >
                    <Route path="/finanzas/cuotas" element={<InvoicesPage />} />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.SECRETARIA,
                        ]}
                      />
                    }
                  >
                    <Route
                      path="/finanzas/pagos-egresos"
                      element={<PaymentExpensesPage />}
                    />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.SECRETARIA,
                        ]}
                      />
                    }
                  >
                    <Route
                      path="/finanzas/egresos/pago-extraordinario"
                      element={<ExtraordinaryPayment />}
                    />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.SECRETARIA,
                        ]}
                      />
                    }
                  >
                    <Route
                      path="/finanzas/pagos-gas/historicos"
                      element={<HistoricGasPaymentsPage />}
                    />
                  </Route>
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.SECRETARIA,
                        ]}
                      />
                    }
                  >
                    <Route
                      path="/finanzas/pagos-electricidad/historicos"
                      element={<ElectricityDetailPayment />}
                    />
                  </Route>
                  {/* Comunicación */}
                  <Route
                    element={
                      <RoleBasedRoute
                        allowedRoles={[
                          UserRole.SUPERADMIN,
                          UserRole.ADMIN,
                          UserRole.SECRETARIA,
                        ]}
                      />
                    }
                  >
                    <Route path="/mensajes" element={<ChatPage />} />
                  </Route>
                </Route>
                {/* Ruta no encontrada */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <ToastContainer />
        </ConfigProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
