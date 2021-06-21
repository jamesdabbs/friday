Shared platform-level features for the various NestJS applications in this monorepo, including

- standardized request and SQL query logging
- gracefully handling shutdown / Prisma disconnect

# Usage

## Installation

This package is published to Github's private NPM registry; you will need

```bash
npm i --save @jamesdabbs/nest-platform
```

```typescript
// app.module.ts
import { PlatformModule } from '@jamesdabbs/nest-platform'

@Module({
  imports: [
    // ...
    PlatformModule.forRoot({
      // optional
      prisma: PrismaClient
    })
  ],
  // ...
})

// main.ts
import { bootstrap } from '@jamesdabbs/nest-platform'

bootstrap(AppModule, { hot: (module as any).hot })
```

# Development

See `package.json` for all helper scripts

```bash
# Build changes
$ npm run build

# Publish to configured NPM repo
$ npm publish
```
