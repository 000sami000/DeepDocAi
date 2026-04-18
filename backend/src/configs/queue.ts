import { Queue } from "bullmq";

import * as dotenv from "dotenv";

dotenv.config();
const queueMap: Record<string, Queue> = {};
const connection = {
  host: process.env.BULL_MQ_REDIS_HOST ,
  port: parseInt(process.env.BULL_MQ_REDIS_PORT as string),
};
export const getQueue = (queueName: string): Queue => {
  try {
    if (!queueMap[queueName]) {
      queueMap[queueName] = new Queue(queueName,{ connection });
    }

    return queueMap[queueName];
  } catch (err) {
    console.error(`Error initializing queue: ${queueName}`, err);
    throw err;
  }

}