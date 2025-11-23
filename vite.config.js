import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Debemos especificar la ruta base: el nombre del repositorio
export default defineConfig({
  plugins: [react()],
  // Asegúrate de que 'nini-tamagotchi-v2' sea exactamente el nombre de tu repositorio
  base: './', // <-- ¡CORREGIR ESTA LÍNEA!
  build: { // AÑADIR ESTA SECCIÓN
    target: 'es2020' // Apuntar a un estándar de JS más compatible
  }
})