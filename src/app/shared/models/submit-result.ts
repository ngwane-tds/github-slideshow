import { ProjectDTO } from './dtos';

export interface SubmitResult {
  errorRecords: any[];
  isSubmitted: boolean;
  project: ProjectDTO;
}
