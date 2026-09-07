# EventManager Mobile

Frontend reconstruido a partir del `src/` original.

## Requisitos

- Node.js 22.12 o superior dentro de la rama 22/24 soportada por Angular 21.
- npm.
- Android Studio para generar la APK.
- JDK que incluya/recomiende la versión actual de Android Studio.

## Instalar

```bash
npm install
```

## Ejecutar en navegador

```bash
npm start
```

También puedes instalar Ionic CLI globalmente y ejecutar `ionic serve`, aunque no es obligatorio porque el CLI está incluido como dependencia de desarrollo.

## Crear Android por primera vez

```bash
npm run build:prod
npm run android:add
```

El comando `android:add` ajusta automáticamente `minSdkVersion = 26`, necesario para el scanner oficial.

Luego:

```bash
npm run android:sync
npm run android:open
```

## Actualizar Android después de cambiar código

```bash
npm run android
```

## API

La URL se configura en:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Actualmente apunta a:

`https://repodata-78ny.onrender.com`

## Cookies en Capacitor

`capacitor.config.ts` habilita `CapacitorHttp` y `CapacitorCookies` para mejorar el manejo nativo de peticiones y cookies de sesión.
