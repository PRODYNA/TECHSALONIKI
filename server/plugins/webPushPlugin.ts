import webpush from 'web-push';

const generateKeys = async () => {
    let key = await useStorage('filesystem').hasItem('/keys/private_key');
    if (key) {
        return;
    } else {
        const vapidKeys = webpush.generateVAPIDKeys();
        await useStorage("filesystem").setItem("/keys/private_key", vapidKeys.privateKey);
        await useStorage("filesystem").setItem("/keys/public_key", vapidKeys.publicKey);
    }
};

const initWebPush = async () => {
    const publicKey = await useStorage('filesystem').getItem('/keys/public_key') as string;
    const privateKey = await useStorage('filesystem').getItem('/keys/private_key') as string;
    if (publicKey && privateKey) {
        webpush.setVapidDetails(
            'mailto::example@yourdomain.org',
            publicKey,
            privateKey
        );
    }
};


export default defineNitroPlugin(async (nitroApp) => {
    await generateKeys();
    await initWebPush();
    // const private_key = await useStorage("filesystem").getItem("private_key");
    // console.log(private_key);
})
