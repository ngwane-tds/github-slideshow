import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthHttpService } from 'src/app/core/services/auth-http.service';
import { ENDPOINTS as endpoints } from '../../../core/services/endpoint.service.config';
import { FormGroup } from '@angular/forms';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.actions';
import { Store } from '@ngrx/store';
@Injectable({
  providedIn: 'root'
})
export class SaveExistingProjectService {
  constructor(
    private authHttpService: AuthHttpService, // TODO: use authHttp instead to pass token
    private http: HttpClient,
    private store: Store<fromHome.State>
  ) {}
  public async saveExistingProject(
    projectTypeId: number,
    sharedFormFields: FormGroup,
    projectTypeFields: FormGroup,
    language: string,
    crossBorderFields: FormGroup,
    portOfEntryFields: FormGroup,
    roadwayFields: FormGroup,
    interchangeFields: FormGroup,
    shortTermFields: FormGroup,
    railroadFields: FormGroup
  ) {
    const { value: sharedFormFieldsValue } = sharedFormFields;
    const project = {
      // TODO: make ProjectDTO
      JurisdictionId: sharedFormFieldsValue.jurisdictionId,
      ProjectDescription: sharedFormFieldsValue.projectDescription,
      ProjectName: sharedFormFieldsValue.projectName,
      ProjectTypeId: projectTypeFields.value.projectTypeId,
      PersonName: sharedFormFieldsValue.personName,
      StatusId: 0, // 0 is in progress
      Language: language
    };

    let payload: any;
    let endpoint = '';
    console.log('Project Save Existing -> ', projectTypeId);
    switch (projectTypeId) {
      // roadway
      case 10:
        const { value: roadwayFieldsValue } = roadwayFields;
        payload = {
          // TODO: make RoadwayDTO
          Project: {
            ...project,
            CreatedBy: roadwayFieldsValue.createdBy,
            CreatedDateTime: roadwayFieldsValue.createdDateTime,
            Id: roadwayFieldsValue.projectId,
            IsDeleted: roadwayFieldsValue.isDeleted,
            ModifiedBy: roadwayFieldsValue.modifiedBy,
            ModifiedDateTime: roadwayFieldsValue.modifiedDateTime
          },
          ProjectPhaseId: roadwayFieldsValue.projectPhaseId === null ? 0 : roadwayFieldsValue.projectPhaseId,
          ConditionAfterCompletion: roadwayFieldsValue.conditionAfterCompletion,
          ConditionAfterCompletionLanes:
            roadwayFieldsValue.conditionAfterCompletionLanes,
          ConditionAfterCompletionFacilityTypeId:
            roadwayFieldsValue.conditionAfterCompletionFacilityTypeId
            === null ? 0 : roadwayFieldsValue.conditionAfterCompletionFacilityTypeId,
          ExistingCondition: roadwayFieldsValue.existingCondition,
          ExistingConditionLanes:
            roadwayFieldsValue.existingConditionLanes === null ? 0 : roadwayFieldsValue.existingConditionLanes,
          ExistingConditionFacilityTypeId:
            roadwayFieldsValue.existingConditionFacilityTypeId === null ? 0 : roadwayFieldsValue.existingConditionFacilityTypeId,
          FundsStillNeeded: roadwayFieldsValue.fundsStillNeeded,
          PortOfEntryLocationId: roadwayFieldsValue.portOfEntryLocationId === null ? 0 : roadwayFieldsValue.portOfEntryLocationId,
          ProjectFullyFundedId: roadwayFieldsValue.projectFullyFundedId === null ? 0 : roadwayFieldsValue.projectFullyFundedId,
          TerminusFacilityId: roadwayFieldsValue.terminusFacilityId === null ? 0 : roadwayFieldsValue.terminusFacilityId,
          LimitProjectFrom: roadwayFieldsValue.limitProjectFrom,
          LimitProjectTo: roadwayFieldsValue.limitProjectTo,
          LimitProjectBeginPost: roadwayFieldsValue.limitProjectBeginPost,
          LimitProjectEndPost: roadwayFieldsValue.limitProjectEndPost,
          VehicleTypeServedId: roadwayFieldsValue.vehicleTypeServedId === null ? 0 : roadwayFieldsValue.vehicleTypeServedId,
          NameParallelFacility: roadwayFieldsValue.nameParallelFacility,
          DailyTrafficStartRate: roadwayFieldsValue.dailyTrafficStartRate,
          DailyTrafficEndRate: roadwayFieldsValue.dailyTrafficEndRate,
          TruckPercentShareAADT: roadwayFieldsValue.truckPercentShareAADT,
          AccidentRateTypeId: roadwayFieldsValue.accidentRateTypeId === null ? 0 : roadwayFieldsValue.accidentRateTypeId,
          TotalProjectCost: roadwayFieldsValue.totalProjectCost,
          YearProjectOperational: roadwayFieldsValue.yearProjectOperational === null ? 0 : roadwayFieldsValue.yearProjectOperational,
          MultiModeBicycleId: roadwayFieldsValue.multiModeBicycleId === null ? 0 : roadwayFieldsValue.multiModeBicycleId,
          MultiModePedestrianId: roadwayFieldsValue.multiModePedestrianId === null ? 0 : roadwayFieldsValue.multiModePedestrianId,
          MultiModeHOVId: roadwayFieldsValue.multiModeHOVId === null ? 0 : roadwayFieldsValue.multiModeHOVId,
          EnvironmentalBenefitId: roadwayFieldsValue.environmentalBenefitId === null ? 0 : roadwayFieldsValue.environmentalBenefitId,
          EconomicBenefitId: roadwayFieldsValue.economicBenefitId === null ? 0 : roadwayFieldsValue.economicBenefitId,
          ImpactPortOfEntry: roadwayFieldsValue.impactPortOfEntry,
          Language: language,
          // these do not exist in the forms, they come back from the API and need to be used in PUT
          CreatedBy: roadwayFieldsValue.createdBy,
          CreatedDateTime: roadwayFieldsValue.createdDateTime,
          Id: roadwayFieldsValue.id,
          IsDeleted: roadwayFieldsValue.isDeleted,
          ModifiedBy: roadwayFieldsValue.modifiedBy,
          ModifiedDateTime: roadwayFieldsValue.modifiedDateTime,
          ProjectId: roadwayFieldsValue.projectId
        };
        endpoint = `${endpoints.API_PUT.ROADWAY}?id=${roadwayFieldsValue.id}&lang=${language}`;
        break;
      // Interchange
      case 20:
        const { value: interchangeFieldsValue } = interchangeFields;
        payload = {
          // TODO: make InterchangeDTO
          Project: {
            ...project,
            CreatedBy: interchangeFieldsValue.createdBy,
            CreatedDateTime: interchangeFieldsValue.createdDateTime,
            Id: interchangeFieldsValue.projectId,
            IsDeleted: interchangeFieldsValue.isDeleted,
            ModifiedBy: interchangeFieldsValue.modifiedBy,
            ModifiedDateTime: interchangeFieldsValue.modifiedDateTime
          },
          ProjectPhaseId: interchangeFieldsValue.projectPhaseId === null ? 0 : interchangeFieldsValue.projectPhaseId,
          ConditionProjectCompletion:
            interchangeFieldsValue.conditionProjectCompletion,
          ExistingCondition: interchangeFieldsValue.existingCondition,
          FundsStillNeeded: interchangeFieldsValue.fundsStillNeeded,
          PortOfEntryLocationId: interchangeFieldsValue.portOfEntryLocationId === null ? 0 : interchangeFieldsValue.portOfEntryLocationId,
          ProjectFullyFundedId: interchangeFieldsValue.projectFullyFundedId === null ? 0 : interchangeFieldsValue.projectFullyFundedId,
          TerminusFacilityId: interchangeFieldsValue.terminusFacilityId === null ? 0 : interchangeFieldsValue.terminusFacilityId,
          VehicleTypeServedId: interchangeFieldsValue.vehicleTypeServedId === null ? 0 : interchangeFieldsValue.vehicleTypeServedId,
          RampDirection: interchangeFieldsValue.rampDirection,
          NameNearestInterchange: interchangeFieldsValue.nameNearestInterchange,
          DailyTrafficStartRate: interchangeFieldsValue.dailyTrafficStartRate,
          DailyTrafficEndRate: interchangeFieldsValue.dailyTrafficEndRate,
          TruckPercentShareAADT: interchangeFieldsValue.truckPercentShareAADT,
          AccidentRateTypeId: interchangeFieldsValue.accidentRateTypeId === null ? 0 : interchangeFieldsValue.accidentRateTypeId,
          TotalProjectCost: interchangeFieldsValue.totalProjectCost,
          YearProjectOperational: interchangeFieldsValue.yearProjectOperational,
          MultiModeBicycleId: interchangeFieldsValue.multiModeBicycleId === null ? 0 : interchangeFieldsValue.multiModeBicycleId,
          MultiModePedestrianId: interchangeFieldsValue.multiModePedestrianId === null ? 0 : interchangeFieldsValue.multiModePedestrianId,
          MultiModeHOVId: interchangeFieldsValue.multiModeHOVId === null ? 0 : interchangeFieldsValue.multiModeHOVId,
          EnvironmentalBenefitId: interchangeFieldsValue.environmentalBenefitId
          === null ? 0 : interchangeFieldsValue.environmentalBenefitId,
          EconomicBenefitId: interchangeFieldsValue.economicBenefitId === null ? 0 : interchangeFieldsValue.economicBenefitId,
          ImpactPortOfEntry: interchangeFieldsValue.impactPortOfEntry,
          Language: language,
          // these do not exist in the forms, they come back from the API and need to be used in PUT
          CreatedBy: interchangeFieldsValue.createdBy,
          CreatedDateTime: interchangeFieldsValue.createdDateTime,
          Id: interchangeFieldsValue.id,
          IsDeleted: interchangeFieldsValue.isDeleted,
          ModifiedBy: interchangeFieldsValue.modifiedBy,
          ModifiedDateTime: interchangeFieldsValue.modifiedDateTime,
          ProjectId: interchangeFieldsValue.projectId
        };
        endpoint = `${endpoints.API_PUT.INTERCHANGE}?id=${payload.Id}&lang=${language}`;
        break;
      // Rail
      case 30:
        const { value: railroadFieldsValue } = railroadFields;
        payload = {
          // TODO: make RailroadDTO
          Project: {
            ...project,
            CreatedBy: railroadFieldsValue.createdBy,
            CreatedDateTime: railroadFieldsValue.createdDateTime,
            Id: railroadFieldsValue.projectId,
            IsDeleted: railroadFieldsValue.isDeleted,
            ModifiedBy: railroadFieldsValue.modifiedBy,
            ModifiedDateTime: railroadFieldsValue.modifiedDateTime
          },
          ProjectPhaseId: railroadFieldsValue.projectPhaseId === null ? 0 : railroadFieldsValue.projectPhaseId,
          ConditionProjectCompletion:
            railroadFieldsValue.conditionProjectCompletion,
          EconomicBenefitId: railroadFieldsValue.economicBenefitId == null ? 0 : railroadFieldsValue.economicBenefitId,
          EnvironmentalBenefitId: railroadFieldsValue.environmentalBenefitId === null ? 0 : railroadFieldsValue.environmentalBenefitId,
          ExistingCondition: railroadFieldsValue.existingCondition,
          FreightProjAnnualTotalRailCars:
            railroadFieldsValue.freightProjAnnualTotalRailCars,
          FreightProjProjectedRailCars:
            railroadFieldsValue.freightProjProjectedRailCars,
          FundsStillNeeded: railroadFieldsValue.fundsStillNeeded,
          GradeSeparationId: railroadFieldsValue.gradeSeparationId === null ? 0 : railroadFieldsValue.gradeSeparationId,
          LimitProjectFrom: railroadFieldsValue.limitProjectFrom,
          LimitProjectTo: railroadFieldsValue.limitProjectTo,
          LimitProjectBeginPost: railroadFieldsValue.limitProjectBeginPost,
          LimitProjectEndPost: railroadFieldsValue.limitProjectEndPost,
          PassProjectProjectedTotal:
            railroadFieldsValue.passProjectProjectedTotal,
          PassProjectsCurrentTotal:
            railroadFieldsValue.passProjectsCurrentTotal,
          PortOfEntryLocationId: railroadFieldsValue.portOfEntryLocationId === null ? 0 : railroadFieldsValue.portOfEntryLocationId,
          TerminusTypeId: railroadFieldsValue.terminusTypeId === null ? 0 : railroadFieldsValue.terminusTypeId,
          TotalProjectCost: railroadFieldsValue.totalProjectCost,
          ProjectFullyFundedId: railroadFieldsValue.projectFullyFundedId === null ? 0 : railroadFieldsValue.projectFullyFundedId,
          YearProjectOperational: railroadFieldsValue.yearProjectOperational,
          ImpactPortOfEntry: railroadFieldsValue.impactPortOfEntry,
          Language: language,
          // these do not exist in the forms, they come back from the API and need to be used in PUT
          CreatedBy: railroadFieldsValue.createdBy,
          CreatedDateTime: railroadFieldsValue.createdDateTime,
          Id: railroadFieldsValue.id,
          ProjectId: railroadFieldsValue.projectId,
          IsDeleted: railroadFieldsValue.isDeleted,
          ModifiedBy: railroadFieldsValue.modifiedBy,
          ModifiedDateTime: railroadFieldsValue.modifiedDateTime
        };
        endpoint = `${endpoints.API_PUT.RAILROAD}?id=${payload.Id}&lang=${language}`;
        break;
      // POE
      case 40:
        // TODO: make PortOfEntryDTO
        const { value: poeFieldsValue } = portOfEntryFields;
        payload = {
          Project: {
            ...project,
            CreatedBy: poeFieldsValue.createdBy,
            CreatedDateTime: poeFieldsValue.createdDateTime,
            Id: poeFieldsValue.projectId,
            IsDeleted: poeFieldsValue.isDeleted,
            ModifiedBy: poeFieldsValue.modifiedBy,
            ModifiedDateTime: poeFieldsValue.modifiedDateTime
          },
          ProjectTypeId: poeFieldsValue.projectTypeId === null ? 0 : poeFieldsValue.projectTypeId,
          ProjectPhaseId: poeFieldsValue.projectPhaseId === null ? 0 : poeFieldsValue.projectPhaseId,
          Language: language,
          CommercialHoursWeekStart: poeFieldsValue.commercialHoursWeekStart,
          CommercialHoursWeekEnd: poeFieldsValue.commercialHoursWeekEnd,
          CommercialHoursSatStart: poeFieldsValue.commercialHoursSatStart,
          CommercialHoursSatEnd: poeFieldsValue.commercialHoursSatEnd,
          CommercialHoursSunStart: poeFieldsValue.commercialHoursSunStart,
          CommercialHoursSunEnd: poeFieldsValue.commercialHoursSunEnd,
          PassengerHoursWeekStart: poeFieldsValue.passengerHoursWeekStart,
          PassengerHoursWeekEnd: poeFieldsValue.passengerHoursWeekEnd,
          PassengerHoursSatStart: poeFieldsValue.passengerHoursSatStart,
          PassengerHoursSatEnd: poeFieldsValue.passengerHoursSatEnd,
          PassengerHoursSunStart: poeFieldsValue.passengerHoursSunStart,
          PassengerHoursSunEnd: poeFieldsValue.passengerHoursSunEnd,
          ExistingCondition: poeFieldsValue.existingCondition,
          ConditionProjectCompletion: poeFieldsValue.conditionProjectCompletion,
          EconomicBenefitId: poeFieldsValue.economicBenefitId === null ? 0 : poeFieldsValue.economicBenefitId,
          EnvironmentalBenefitId: poeFieldsValue.environmentalBenefitId === null ? 0 : poeFieldsValue.environmentalBenefitId,
          FundsStillNeeded: poeFieldsValue.fundsStillNeeded,
          PortOfEntryLocationId: poeFieldsValue.portOfEntryLocationId === null ? 0 : poeFieldsValue.portOfEntryLocationId,
          PortOfEntryProjectTypeId: poeFieldsValue.portOfEntryProjectTypeId === null ? 0 : poeFieldsValue.portOfEntryProjectTypeId,
          PositiveImpactCargoId: poeFieldsValue.positiveImpactCargoId === null ? 0 : poeFieldsValue.positiveImpactCargoId,
          PositiveImpactPassengerId: poeFieldsValue.positiveImpactPassengerId === null ? 0 : poeFieldsValue.positiveImpactPassengerId,
          ProjectFullyFundedId: poeFieldsValue.projectFullyFundedId === null ? 0 : poeFieldsValue.projectFullyFundedId,
          TotalProjectCost: poeFieldsValue.totalProjectCost,
          YearProjectOperational: poeFieldsValue.yearProjectOperational === null ? 0 : poeFieldsValue.yearProjectOperational,
          ConstructionPhaseId: poeFieldsValue.constructionPhaseId === null ? 0 : poeFieldsValue.constructionPhaseId,
          // these do not exist in the forms, they come back from the API and need to be used in PUT
          CreatedBy: poeFieldsValue.createdBy,
          CreatedDateTime: poeFieldsValue.createdDateTime,
          Id: poeFieldsValue.id,
          IsDeleted: poeFieldsValue.isDeleted,
          ModifiedBy: poeFieldsValue.modifiedBy,
          ModifiedDateTime: poeFieldsValue.modifiedDateTime,
          ProjectId: poeFieldsValue.projectId
        };
        endpoint = `${endpoints.API_PUT.PORT_OF_ENTRY}?id=${payload.Id}&lang=${language}`;
        break;
      // cross border
      case 50:
        const { value: crossBorderFieldsValue } = crossBorderFields;
        payload = {
          // TODO: make CrossBorderDTO
          Project: {
            ...project,
            CreatedBy: crossBorderFieldsValue.createdBy,
            CreatedDateTime: crossBorderFieldsValue.createdDateTime,
            Id: crossBorderFieldsValue.projectId,
            IsDeleted: crossBorderFieldsValue.isDeleted,
            ModifiedBy: crossBorderFieldsValue.modifiedBy,
            ModifiedDateTime: crossBorderFieldsValue.modifiedDateTime
          },
          ProjectTypeId: crossBorderFieldsValue.projectTypeId === null ? 0 : crossBorderFieldsValue.projectTypeId,
          ProjectPhaseId: crossBorderFieldsValue.projectPhaseId === null ? 0 : crossBorderFieldsValue.projectPhaseId,
          ConditionProjectCompletion:
            crossBorderFieldsValue.conditionProjectCompletion,
          ExistingCondition: crossBorderFieldsValue.existingCondition,
          FundsStillNeeded: crossBorderFieldsValue.fundsStillNeeded,
          LimitProjectBeginPost: crossBorderFieldsValue.limitProjectBeginPost,
          LimitProjectEndPost: crossBorderFieldsValue.limitProjectEndPost,
          LimitProjectFrom: crossBorderFieldsValue.limitProjectFrom,
          LimitProjectTo: crossBorderFieldsValue.limitProjectTo,
          PortOfEntryLocationId: crossBorderFieldsValue.portOfEntryLocationId === null ? 0 : crossBorderFieldsValue.portOfEntryLocationId,
          ProjectFullyFundedId: crossBorderFieldsValue.projectFullyFundedId === null ? 0 : crossBorderFieldsValue.projectFullyFundedId,
          YearProjectOperational: crossBorderFieldsValue.yearProjectOperational
          === null ? 0 :  crossBorderFieldsValue.yearProjectOperational,
          TerminusFacilityId: crossBorderFieldsValue.terminusFacilityId === null ? 0 :  crossBorderFieldsValue.terminusFacilityId,
          ProjectImpact: crossBorderFieldsValue.projectImpact,
          TotalProjectCost: crossBorderFieldsValue.totalProjectCost,
          Language: language,
          // these do not exist in the forms, they come back from the API and need to be used in PUT
          CreatedBy: crossBorderFieldsValue.createdBy,
          CreatedDateTime: crossBorderFieldsValue.createdDateTime,
          Id: crossBorderFieldsValue.id,
          IsDeleted: crossBorderFieldsValue.isDeleted,
          ModifiedBy: crossBorderFieldsValue.modifiedBy,
          ModifiedDateTime: crossBorderFieldsValue.modifiedDateTime,
          ProjectId: crossBorderFieldsValue.projectId
        };
        endpoint = `${endpoints.API_PUT.CROSS_BORDER}?id=${payload.Id}&lang=${language}`;
        break;
      // short term
      case 60:
        const { value: shortTermFieldsValue } = shortTermFields;
        payload = {
          // TODO: make ShortTermDTO
          Project: {
            ...project,
            CreatedBy: shortTermFieldsValue.createdBy,
            CreatedDateTime: shortTermFieldsValue.createdDateTime,
            Id: shortTermFieldsValue.projectId,
            IsDeleted: shortTermFieldsValue.isDeleted,
            ModifiedBy: shortTermFieldsValue.modifiedBy,
            ModifiedDateTime: shortTermFieldsValue.modifiedDateTime
          },
          ProjectPhaseId: shortTermFieldsValue.projectPhaseId === null ? 0 : shortTermFieldsValue.projectPhaseId,
          ConditionProjectCompletion:
            shortTermFieldsValue.conditionProjectCompletion,
          ExistingCondition: shortTermFieldsValue.existingCondition,
          FundsStillNeeded: shortTermFieldsValue.fundsStillNeeded,
          TotalProjectCost: shortTermFieldsValue.totalProjectCost,
          HowReduceBorderWait: shortTermFieldsValue.howReduceBorderWait,
          ProjectLocation: shortTermFieldsValue.projectLocation,
          PortOfEntryLocationId: shortTermFieldsValue.portOfEntryLocationId === null ? 0 : shortTermFieldsValue.portOfEntryLocationId,
          ProjectFullyFundedId: shortTermFieldsValue.projectFullyFundedId === null ? 0 : shortTermFieldsValue.projectFullyFundedId,
          YearProjectOperational: shortTermFieldsValue.yearProjectOperational === null ? 0 : shortTermFieldsValue.yearProjectOperational,
          Language: language,
          // these do not exist in the forms, they come back from the API and need to be used in PUT
          CreatedBy: shortTermFieldsValue.createdBy,
          CreatedDateTime: shortTermFieldsValue.createdDateTime,
          Id: shortTermFieldsValue.id,
          ProjectId: shortTermFieldsValue.projectId,
          IsDeleted: shortTermFieldsValue.isDeleted,
          ModifiedBy: shortTermFieldsValue.modifiedBy,
          ModifiedDateTime: shortTermFieldsValue.modifiedDateTime
        };
        endpoint = `${endpoints.API_PUT.SHORT_TERM}?id=${payload.Id}&lang=${language}`;
        break;
      default:
        const err = new Error(
          `Project Type case not handled in save function: ${projectTypeId}`
        );
        this.store.dispatch(new homeActions.ProjectSaveError(err));
        throw err;
    }

    // call api
    try {
      const res = await this.authHttpService.put(endpoint, payload);
      this.store.dispatch(new homeActions.GetProjects(language));
      this.store.dispatch(new homeActions.ProjectSaveSuccess(res));
      this.store.dispatch(new homeActions.SetSelectedProject(
        {
          projectTypeId: res.project.projectTypeId,
          projectId: res.projectId,
          id: res.id
        }
      ));
      return res;
    } catch (err) {
      this.store.dispatch(new homeActions.ProjectSaveError(err));
      return console.error('Existing Project Save Error -> ', err);
    }

  }
}
