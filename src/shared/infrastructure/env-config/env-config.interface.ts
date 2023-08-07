/*
 * This interface is used to get the App Port and Environment variables
 * @public
 */

export interface EnvConfig {
  getAppPort(): number;
  getNodeEnv(): string;
}
