import { AppModule } from './app.module';
import { bootstrap } from '@jamesdabbs/nest-platform'

bootstrap(AppModule, { hot: (module as any).hot })
