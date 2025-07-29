import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {WebSocketsModule} from "./feature/websockets/websockets.module";

@Module({
  imports: [WebSocketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
