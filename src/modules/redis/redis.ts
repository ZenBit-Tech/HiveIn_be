import { createClient } from 'redis';
import { config } from 'dotenv';

config();

const redisClient = createClient({
  url: `redis://@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

export async function connectClient() {
  await redisClient.connect();
}

export default redisClient;
