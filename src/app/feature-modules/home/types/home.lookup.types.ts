export interface ValueListItem {
  id: number;
  value: string;
  Language?: string;
  OrderNum?: number;
}

export enum ProjectStatusType {
  inProgressId = 0,
  submittedId = 1,
  submitted = 'Submitted',
  inProgress = 'In Progress'
}
