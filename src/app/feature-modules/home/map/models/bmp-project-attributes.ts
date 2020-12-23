export interface BmpUpdateGISAttributes {
  OBJECTID: number;
  ModifiedDate: number;
  ModifiedByID: string;
  IsDeleted?: number;
}

export interface BmpCreateGISAttributes {
  ProjectID: number;
  ProjectNumber: string;
  CreatedByID: string;
  CreatedDate: number;
}
