import { DynamicModule, Module } from "@nestjs/common";
import { EnvConfigService } from "./env-config.service";
import { ConfigModule, ConfigModuleOptions } from "@nestjs/config";
import { join } from "node:path";

@Module({
  providers: [EnvConfigService],
})
/*
 * Create a class based on the ConfigModule class from nest.js
 */
export class EnvConfigModule extends ConfigModule {
  /*
   * replicate the forRoot method from ConfigModule
   * @param options - ConfigModuleOptions
   * @returns a DynamicModule - global accessable module
   */
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    /*
     * @returns forRoot method from parent class
     * @param options
     * @param envFilePath -
     */
    return super.forRoot({
      ...options,
      envFilePath: [
        join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
      ],
    });
  }
}
