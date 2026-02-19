# Guía de Despliegue en Vercel 🚀

Tu proyecto está listo para ser desplegado en Vercel. Sigue estos pasos para subirlo a internet:

## 1. Preparativos (Ya realizados por mí) ✅
- El código está optimizado para producción.
- Las imágenes y assets están en su lugar.
- La base de datos (Supabase) está conectada y funcionando.
- El repositorio en GitHub está actualizado.

## 2. Desplegar en Vercel (Paso a Paso)

1.  Ve a [Vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2.  Haz clic en el botón **"Add New..."** -> **"Project"**.
3.  Selecciona tu repositorio: `autenticaarmonia` (o el nombre que tenga en tu GitHub) y dale a **"Import"**.

## 3. Configuración del Proyecto (¡IMPORTANTE!) ⚠️

En la pantalla de configuración del proyecto ("Configure Project"), busca la sección **"Environment Variables"** y añade las siguientes claves (copiando los valores de tu archivo `.env.local`):

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | *(Tu URL de Supabase, empieza con https://...)* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Tu Anon Key larga de Supabase)* |

> **Nota:** No necesitas cambiar el "Framework Preset" (Next.js) ni el "Build Command". Vercel lo detecta automáticamente.

## 4. Finalizar

1.  Haz clic en **"Deploy"**.
2.  Espera unos minutos a que Vercel construya tu sitio. 🎉
3.  Una vez termine, te dará una URL (ej: `autentica-armonia.vercel.app`) donde tu tienda estará visible para todo el mundo.

---

### ¿Problemas comunes?

- **Imágenes no cargan:** Asegúrate de que las políticas de Storage en Supabase sean públicas (ya lo configuramos).
- **Error de conexión:** Verifica que copiaste bien las variables de entorno sin espacios extra.
