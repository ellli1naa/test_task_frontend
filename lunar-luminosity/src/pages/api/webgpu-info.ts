import { getWebGPUInfo } from '../../components/WebGPUInfo';

export async function get() {
  const info = await getWebGPUInfo();
  return new Response(JSON.stringify(info), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}