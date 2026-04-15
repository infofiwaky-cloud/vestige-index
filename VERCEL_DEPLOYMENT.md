# 🚀 Guía de Despliegue en Vercel

Este proyecto ha sido optimizado para deployarse en **Vercel**.

## 📋 Cambios realizados

✅ Removido el plugin de Netlify (`@netlify/vite-plugin-tanstack-start`)  
✅ Creado `vercel.json` con configuración óptima  
✅ Creado `.vercelignore` para optimizar el build  
✅ Removido `netlify.toml` de devDependencies  
✅ Actualizado `package.json` para Vercel  

## 🔧 Opción 1: Deploy desde Vercel Dashboard (Recomendado)

### Pasos:

1. Ve a https://vercel.com/dashboard
2. Haz clic en **"Add New"** → **"Project"**
3. Selecciona tu repositorio: **infofiwaky-cloud/vestige-index**
4. La configuración debería auto-detectarse:
   - **Framework**: Vite ✓
   - **Build Command**: `npm run build` ✓
   - **Output Directory**: `dist` ✓
5. Haz clic en **"Deploy"** 🎉

## 🖥️ Opción 2: Deploy desde CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. En la raíz del proyecto
vercel --prod

# 3. Seguir las instrucciones interactivas
```

## 🔐 Variables de entorno en Vercel

En **Vercel Dashboard → Tu Proyecto → Settings → Environment Variables**, añade:

| Variable | Valor | Requerida |
|----------|-------|-----------|
| `VITE_COINGECKO_API_KEY` | Tu API Key | No (dummy por defecto) |
| `VITE_ONECH_INCH_API_KEY` | Tu API Key | No (dummy por defecto) |
| `VITE_CRYPTOPANIC_API_KEY` | Tu API Key | No (dummy por defecto) |
| `VITE_CRYPTOCOMPARE_API_KEY` | Tu API Key | No (dummy por defecto) |
| `VITE_ETHERSCAN_API_KEY` | Tu API Key | No (dummy por defecto) |

### ⚠️ Nota: Las comisiones están hardcodeadas en el código, no necesitas variables de entorno para que funcionen.

## 📊 Monitoreo del Deploy

1. Ve a tu proyecto en Vercel
2. Abre la sección **"Deployments"** para ver el estado
3. Los logs de build aparecerán en tiempo real

## ✅ Verificación post-deploy

Después del deploy:

- ✓ Accede a la URL del proyecto (ej: `https://vestige-index.vercel.app`)
- ✓ Verifica que la conexión de wallets funciona
- ✓ Prueba la funcionalidad de swaps
- ✓ Revisa los datos en tiempo real

## 🔄 Redeploy automático

Vercel desplegará automáticamente en cada push a `main` (configurable).

## ❓ Solución de problemas

### Build fallido
- Revisa los logs en Vercel Dashboard
- Asegúrate de que `npm run build` funciona localmente
- Verifica que no hay archivos `.local` causando conflictos

### Variables de entorno no aplican
- Redeploy después de añadir variables: Dashboard → "Redeploy"
- Verifica que estén configuradas en todos los ambientes (Production, Preview, Development)

### Problemas con rutas
- El `vercel.json` incluye rewrites para SPA - debería funcionar correctamente
- Si 404 en rutas, verifica la configuración de `vercel.json`

## 📚 Más recursos

- [Documentación Vercel](https://vercel.com/docs)
- [Guía Vite en Vercel](https://vercel.com/guides/nextjs-alternatives-with-vite)
- [TanStack Start + Vercel](https://tanstack.com/start/latest/docs/framework/react/guide/deployment)