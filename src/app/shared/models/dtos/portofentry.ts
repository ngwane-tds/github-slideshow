export default interface PortOfEntryDTO {
  // TODO: child of DataItem class
  ProjectId: number;
  County: string;
  ExistingCondition: string;
  ConditionProjectCompletion: string;
  ConditionProjectCompletionYear: number;
  CompletionYear: number; // Dropdown is years 2020-2040
  CurrentPhaseId: number;
  // [Column(TypeName = "decimal(16, 2)")]
  TotalProjectCost: number;
  ProjectFullyFundedId: number; // Limit to Yes/No
  // [Column(TypeName = "decimal(16, 2)")]
  FundsStillNeeded: number; // type decimal in API
  POEProjectTypeId: number;
  PassengerHoursWeekStart: Date;
  PassengerHoursWeekEnd: Date;
  PassengerHoursSatStart: Date;
  PassengerHoursSatEnd: Date;
  PassengerHoursSunStart: Date;
  PassengerHoursSunEnd: Date;
  CommercialHoursWeekStart: Date;
  CommercialHoursWeekEnd: Date;
  CommercialHoursSatStart: Date;
  CommercialHoursSatEnd: Date;
  CommercialHoursSunStart: Date;
  CommercialHoursSunEnd: Date;
  EnvironmentalBenefitId: number; // All DegreeTypes
  EconomicBenefitId: number; // All DegreeTypes
  PositiveImpactCargoId: number; // All YesNo
  PositiveImpactPassengerId: number; // All YesNo
  /* VIRTUALS */
  //[ForeignKey("ProjectFullyFundedId, Language")]
  ProjectFullyFunded: number;
  //[ForeignKey("ProjectId")]
  Project: number;
  //[ForeignKey("CurrentPhaseId, Language")]
  PortOfEntryProjectPhase: number;
  //[ForeignKey("POEProjectTypeId, Language")]
  PortOfEntryProjectType: number;
  //[ForeignKey("EnvironmentalBenefitId, Language")]
  EnviromentalBenefit: number;
  //[ForeignKey("EconomicBenefitId, Language")]
  EconomicBenefit: number;
  //[ForeignKey("PositiveImpactCargoId, Language")]
  PositiveImpactCargo: number;
  //[ForeignKey("PositiveImpactPassengerId, Language")]
  PositiveImpactPassenger: number;
}
