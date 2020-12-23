export default interface ProjectDTO {
  termSelection: string;
  createdBy: string;
  createdByName: string | null;
  createdDateTime: Date;
  id: number;
  agencyName: string;
  projectId: number;
  jurisdiction: string;
  jurisdictionId: number;
  personName: string;
  projectDescription: string;
  projectName: string;
  projectNum: number;
  projectNumber: string;
  projectType: string;
  projectTypeId: number;
  status: string;
  statusId: number;
  portOfEntryLocation: string;
  projectPhase: {
    projectTypeId: number;
    phaseType: number;
    id: number;
    value: string;
  };
  totalProjectCost: number;
  yearProjectOperational: number;
}
