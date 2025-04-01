/**
 * Simple logger utility for test reporting
 */
export class Logger {
  /**
   * Logs an info message
   * @param message - Message to log
   */
  static info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  }

  /**
   * Logs a step message
   * @param message - Message to log
   */
  static step(message: string): void {
    console.log(`[STEP] ${new Date().toISOString()}: ${message}`);
  }

  /**
   * Logs a warning message
   * @param message - Message to log
   */
  static warning(message: string): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  }

  /**
   * Logs an error message
   * @param message - Message to log
   * @param error - Optional error object
   */
  static error(message: string, error?: Error): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
    if (error) {
      console.error(`Error details: ${error.message}`);
      console.error(error.stack);
    }
  }
}
