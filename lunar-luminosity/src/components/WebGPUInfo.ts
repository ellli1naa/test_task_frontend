interface GPUAdapterInfo {
    vendor: string;
    architecture: string;
    device: string;
    description: string;
  }
  
  declare global {
    interface Navigator {
      gpu?: {
        requestAdapter: () => Promise<GPUAdapter | null>;
      };
    }
  }
  
  interface GPUAdapter {
    features: Set<string>;
    limits: Record<string, number>;
    requestAdapterInfo: () => Promise<GPUAdapterInfo>;
  }
  
  export interface WebGPUFeature {
    name: string;
    supported: boolean;
    description?: string;
  }
  
  export interface WebGPULimits {
    [key: string]: number;
  }
  
  export interface WebGPUInfo {
    isAvailable: boolean;
    adapterInfo: GPUAdapterInfo | null;
    features: WebGPUFeature[];
    limits: WebGPULimits;
    error?: string;
  }
  
  export async function getWebGPUInfo(): Promise<WebGPUInfo> {
    // Проверяем, что код выполняется в браузере
    if (typeof window === 'undefined') {
      return {
        isAvailable: false,
        adapterInfo: null,
        features: [],
        limits: {},
        error: "This code must run in a browser environment"
      };
    }
  
    const result: WebGPUInfo = {
      isAvailable: false,
      adapterInfo: null,
      features: [],
      limits: {},
    };
  
    try {
      if (!('gpu' in navigator)) {
        result.error = "WebGPU is not supported in this browser";
        return result;
      }
  
      const adapter = await navigator.gpu?.requestAdapter();
      if (!adapter) {
        result.error = "Failed to get WebGPU adapter";
        return result;
      }
  
      result.isAvailable = true;
      
      // Get adapter info
      result.adapterInfo = await adapter.requestAdapterInfo();
      
      // Get features
      const featureSet = adapter.features;
      const featuresArray: WebGPUFeature[] = [];
      
      featureSet.forEach((feature: string) => {
        featuresArray.push({
          name: feature,
          supported: true,
        });
      });
      
      result.features = featuresArray;
      
      // Get limits
      result.limits = adapter.limits;
  
      return result;
    } catch (error) {
      result.error = `Error getting WebGPU info: ${error instanceof Error ? error.message : String(error)}`;
      return result;
    }
  }