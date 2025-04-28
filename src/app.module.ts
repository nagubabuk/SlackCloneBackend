import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule } from './config/configuration.module';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { ChatGateway } from './gateways/chat.gateway';
import { WebsocketMiddleware } from './common/middleware/websocket.middleware';

@Module({
  imports: [
    ConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongoUri')
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    UsersModule,
    // Add other modules
  ],
  providers: [ChatGateway]
})
export class AppModule implements NestModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WebsocketMiddleware)
      .forRoutes('*'); // Apply to all routes
  }

}