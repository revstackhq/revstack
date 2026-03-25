export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;
  invalidate(key: string): Promise<void>;
}
