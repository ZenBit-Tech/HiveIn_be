import { createClient } from 'redis';
import { config } from 'dotenv';

config();

const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = process.env;

const redisClient = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

export async function connectClient() {
  await redisClient.connect();
}

export default redisClient;
