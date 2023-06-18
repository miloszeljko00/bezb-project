export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    loggerName: string;
    message: string;
    seen: boolean;
  }
  
  export enum LogLevel {
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
  }