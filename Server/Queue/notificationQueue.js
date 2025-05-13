import PQueue from "p-queue";

const notificationsQueue = new PQueue({
  concurrency: 5,
  autoStart: true,
  timeout: 10000,
  throwOnTimeout: true,
});

notificationsQueue.on('active', () => {
  console.log("Active Notifications " + notificationsQueue.pending);
});

notificationsQueue.on('completed', () => {
  console.log("✅ Notification task completed");
});

notificationsQueue.on('error', (error) => {
  console.error('❌ Queue Error:', error);
});

export default notificationsQueue; 