export default interface InterchangeDTO {
  // TODO: child of DataItem class
  /*
    public int ProjectId { get; set; }
    public string County { get; set; }
    public int InterchangeProjectTypeId { get; set; }
    public string RampDirection { get; set; }
    public string ExistingCondition { get; set; }
    public string ConditionProjectCompletion { get; set; }
    public int? ConditionProjectCompletionYear { get; set; }
    public string NameNearestInterchange { get;set; }
    public int? DailyTrafficStartYear { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? DailyTrafficStartRate { get; set; }
    public int? DailyTrafficEndYear { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? DailyTrafficEndRate { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? TruckPercentShareAADT { get; set; }
    public int AccidentRateTypeId { get; set; } // Is actually dropdown
    // Value List
    public int CurrentPhaseId { get; set; }
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? TotalProjectCost { get; set; }
    public int ProjectFullyFundedId { get; set; } // Limit to Yes/No/Unknown
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? FundsStillNeeded { get; set; }
    public int YearProjectOperational { get; set; } // Dropdown is years 2020-2040
    public int MultiModeBicycleId { get; set; } // Limit to Yes/No/Unknown
    public int MultiModeHOVId { get; set; } // Limit to Yes/No/Unknown
    public int MultiModePedestrianId { get; set; } // Limit to Yes/No/Unknown
    public int EnvironmentalBenefitId { get; set; }
    public int EconomicBenefitId { get; set; }
    public int PrimaryPortOfEntryId { get; set; }
    public int TerminusFacilityId { get; set; }
    [MaxLength]
    public string ProjectServesPortOfEntry { get; set; }

    [ForeignKey("ProjectFullyFundedId, Language")]
    public virtual YesNo ProjectFullyFunded { get; set; }
    [ForeignKey("AccidentRateTypeId")]
    public virtual AccidentRateType AccidentRateType { get; set; }
    [ForeignKey("CurrentPhaseId, Language")]
    public virtual ProjectPhase InterchangeProjectPhase { get; set; }
    [ForeignKey("ProjectId")]
    public virtual Project Project { get; set; }
    [ForeignKey("InterchangeProjectTypeId, Language")]
    public virtual InterchangeProjectType InterchangeProjectType { get; set; }
    [ForeignKey("MultiModeBicycleId, Language")]
    public virtual YesNo MultiModeBicycle { get; set; }
    [ForeignKey("MultiModeHOVId, Language")]
    public virtual YesNo MultiModeHOV { get; set; }
    [ForeignKey("MultiModePedestrianId, Language")]
    public virtual YesNo MultiModePedestrian { get; set; }
    [ForeignKey("EnvironmentalBenefitId, Language")]
    public virtual DegreesType EnvironmentalBenefit { get; set; }
    [ForeignKey("EconomicBenefitId, Language")]
    public virtual DegreesType EconomicBenefit { get; set; }
    [ForeignKey("PrimaryPortOfEntryId, Language")]
    public virtual PortOfEntryLocation PrimaryPortOfEntry { get; set; }
    [ForeignKey("TerminusFacilityId, Language")]
    public virtual TerminusFacilityType TerminusFacility { get; set; }
    */
}
