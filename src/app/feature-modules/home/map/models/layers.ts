type PartialRecursive<T> = T extends object
  ? { [K in keyof T]?: PartialRecursive<T[K]> }
  : T;

export interface ConfigLayer {
  // title: string;
  alias?: string;
  isSecure: boolean;
  isEditable?: boolean;
  isGeofenceLayer?: boolean;
  isProjectLayer?: boolean;
  layer: PartialRecursive<__esri.FeatureLayer>;
}
