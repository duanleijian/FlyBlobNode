export async function getJSONResult(callback) {
  const result = { code: 200, data: null, msg: 'ok' };
  try {
    await callback(result);
  } catch (err: any) {
    result.code = 500;
    result.msg = `error: ${err}`;
    if (err) {
      console.log(`error: ${err}`);
    }
  }
  return result;
}
export function JSONResult(code, data, msg) {
  return { code, data, msg };
}
