import { Injectable } from "@nestjs/common";
import { EnvConfig } from "./env-config.interface";
import { ConfigService } from "@nestjs/config";

/*
 * Configure the service to configure environment variables
 * @public
 
 */

@Injectable()
export class EnvConfigService implements EnvConfig {
  /*
   * @remarks Inject the ConfigService class
   * @param configService
   */

  constructor(private configService: ConfigService) {}

  /*
   * Get the port number
   * @returns PORT - App port number
   */
  getAppPort(): number {
    return Number(this.configService.get<number>("PORT"));
  }

  /*
   * Get the node environment
   * @returns NODE_ENV - Node environment
   */
  getNodeEnv(): string {
    return this.configService.get<string>("NODE_ENV");
  }
}
