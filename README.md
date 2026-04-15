 🏛️ Vestige Index

**Plataforma Web3 institucional – Agregador descentralizado de activos financieros**

Vestige Index es una plataforma descentralizada que permite a los usuarios acceder a:

- **Top 100 criptomonedas** con datos en tiempo real
- **Índices tokenizados** (S&P 500, MSCI World, Nasdaq, DAX, Oro, Petróleo)
- **Noticias financieras** actualizadas automáticamente
- **Swaps en DEX** (1inch, Jupiter) sin salir de la plataforma

🔒 **Sin custodia, sin KYC, sin backend.** Solo conecta tu wallet.

---

## ✨ Características principales

| Característica | Descripción |
|----------------|-------------|
| **Multi-wallet** | MetaMask, WalletConnect, Coinbase, Phantom, Ledger, Trezor, y 200+ wallets |
| **Multi-red** | Ethereum, BNB Chain, Polygon, Arbitrum, Optimism, Solana |
| **Comisiones automáticas** | 0.3% (Top 100) / 0.5% (Índices) enviadas a las direcciones del proyecto |
| **Datos reales** | CoinGecko API, Yahoo Finance, CryptoCompare |
| **Swap integrado** | 1inch (EVM) + Jupiter (Solana) – sin redirecciones |
| **Dashboard privado** | Solo visible al conectar wallet |
| **Modo oscuro/claro** | Diseño institucional (negro + dorado) |
| **Multilenguaje** | 8 idiomas (ES, EN, DE, FR, PT, ZH, JA, AR) |

---

## 💰 Comisiones y direcciones del proyecto

Las comisiones se envían **automáticamente** a las siguientes direcciones cuando los usuarios realizan swaps desde la plataforma:

### Redes EVM (Ethereum, BNB Chain, Polygon, Arbitrum, Optimism)
ETH, BNB, USDC, USDT, LINK, 1INCH → 0xa1131edb7a6d5e816bf8548078a88a6bf3d91c7f

text

### Solana
SOL → BpazU34aCvMo1oyhhoxj6u3rnWkXjD8j81rKEFJ2oNLt

text

### Tron (futuro)
USDT TRC20 → TG8H2M4CWNSWmAs2bU5ScC6acx8BSvi7PH

text

### Bitcoin (futuro)
BTC → bc1qlv9cvcfm4m09uzw725e82xuudv6q3zpxqw9x7n

text

### Comisiones por tipo de activo
- **Top 100 criptomonedas:** 0.3%
- **Índices tokenizados / activos curados:** 0.5%

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| React 18 + TypeScript | Frontend |
| Vite | Build tool |
| TailwindCSS | Estilos |
| Wagmi + RainbowKit | Conexión wallets EVM |
| Solana Wallet Adapter | Conexión wallets Solana |
| 1inch API | Swaps en EVM |
| Jupiter API | Swaps en Solana |
| CoinGecko API | Precios cripto |
| Yahoo Finance | Índices globales |
| CryptoCompare | Noticias |

---

## 📦 Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/vestige-index.git
cd vestige-index

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
🌐 Despliegue en Vercel (recomendado)
bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod
O directamente desde la web de Vercel conectando tu repositorio de GitHub.

Variables de entorno (opcionales)
Variable	Valor	Obligatoria
VITE_COINGECKO_API_KEY	dummy (o tu key real)	No
VITE_ONECH_INCH_API_KEY	dummy	No
VITE_CRYPTOPANIC_API_KEY	dummy	No
VITE_CRYPTOCOMPARE_API_KEY	dummy	No
VITE_ETHERSCAN_API_KEY	dummy	No
Nota: Las direcciones de comisiones están hardcodeadas. No necesitas variables de entorno para que funcionen.

📁 Estructura del proyecto
text
vestige-index/
├── src/
│   ├── components/     # Componentes UI
│   ├── pages/          # Dashboard, Marketplace, Índices
│   ├── lib/            # Configuración de wallets, APIs, comisiones
│   ├── hooks/          # useMarketData, useSwap, useWallet
│   └── i18n/           # Traducciones (8 idiomas)
├── public/             # Assets estáticos
├── index.html
├── package.json
├── vite.config.ts
└── netlify.toml
🧠 Flujo de trabajo
yaml
1. Usuario conecta su wallet (MetaMask, Phantom, etc.)
2. Navega por Top 100 cripto o Índices tokenizados
3. Selecciona un activo y hace clic en "Comprar"
4. Se abre un modal interno (sin redirección)
5. Introduce cantidad y confirma
6. La plataforma llama a 1inch o Jupiter
7. Usuario firma la transacción en su wallet
8. La comisión se envía automáticamente a las direcciones del proyecto
9. El dashboard se actualiza con los nuevos saldos
⚠️ Aviso legal
Vestige Index es un agregador descentralizado. No custodia fondos, no ejecuta operaciones directamente, no ofrece asesoramiento financiero. Todas las transacciones se realizan entre el usuario y protocolos descentralizados externos (1inch, Jupiter). Las comisiones se destinan al mantenimiento y desarrollo de la plataforma.

📄 Licencia
MIT

🙏 Agradecimientos
1inch Network

Jupiter Exchange

CoinGecko

RainbowKit

Wagmi

Vercel

🔗 Enlaces
Plataforma en vivo

Reportar un issue

Documentación técnica

Desarrollado por el equipo de Vestige Index – Sin custodia, sin fronteras.

text

---

## ✅ CÓMO SUBIR EL README A GITHUB

### Opción 1 – Desde la web de GitHub

1. Ve a tu repositorio: `https://github.com/TU_USUARIO/vestige-index`
2. Haz clic en **"Add file"** → **"Create new file"**
3. Nombra el archivo: `README.md`
4. **Pega todo el contenido** de arriba
5. Al final de la página, escribe un mensaje: "Add README"
6. Haz clic en **"Commit new file"**

✅ README creado.

---

### Opción 2 – Desde VS Code (local)

```bash
# En la carpeta del proyecto
echo "# Vestige Index" > README.md
# Luego pega el contenido completo

git add README.md
git commit -m "Add README"
git push
