import webpush from 'web-push';

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let subscriptions = await useStorage("filesystem").getKeys("/subscriptions");
  subscriptions = subscriptions.filter(sub => sub.includes(".json"));
  for (const subscription of subscriptions) {
    const subscriptionData = await useStorage("filesystem").getItem(subscription) as webpush.PushSubscription;
    
    await webpush.sendNotification(subscriptionData, body);
  }
  return "OK";
})
