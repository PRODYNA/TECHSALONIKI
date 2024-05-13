interface PushManagerSubscriptionInfo {
    registration: ServiceWorkerRegistration
    subscription: PushSubscription | null
}

export async function getPushSubscription(registration: ServiceWorkerRegistration): Promise<PushManagerSubscriptionInfo> {
    const subscription = await registration.pushManager.getSubscription()
    return { registration, subscription }
}

export async function subscribe(
    registration: ServiceWorkerRegistration,
    applicationServerKey: string,
): Promise<PushSubscription> {
    return await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
    })
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = `${base64String}${padding}`
      .replace(/-/g, '+')
      .replace(/_/g, '/')
  
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
  
    for (let i = 0; i < rawData.length; ++i)
      outputArray[i] = rawData.charCodeAt(i)
  
    return outputArray
  }