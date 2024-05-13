export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // console.log(body);
  await useStorage("filesystem").setItem(`/subscriptions/${((Math. floor(Math. random() * (9999 - 1000 + 1)) + 1000 + Date.now())).toString()}.json`, body)
  return body;
})
