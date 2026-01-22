// App.tsx - CORREGIDO
import AppRoutes from './routes/AppRoutes';

function App() {
  // 💡 Ya no necesitamos BrowserRouter ni AuthProvider aquí 
  // porque ya los pusimos en main.tsx
  return (
    <AppRoutes />
  );
}

export default App;