export default defineEventHandler(async (event) => {
  let key = await useStorage('filesystem').getItem('/keys/public_key');
  return key;
})
