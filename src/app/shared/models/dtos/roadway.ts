export default interface Roadway {
  // TODO: child of DataItem class
  /*
    public int ProjectId { get; set; }
    public string County { get; set; }
    public int RoadwayProjectTypeId { get; set; }  // Uses same options as InterchangeProjectType
    public string LimitProjectFrom { get; set; }
    public string LimitProjectTo { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? LimitProjectBeginPost { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? LimitProjectEndPost { get; set; }
    public string ExistingCondition { get; set; }
    public int ExistingConditionLanes { get; set; } // Sub-question
    public int ExistingConditionFacilityType { get; set; } // Sub-question, possibly dropdown
    public string ConditionAfterCompletion { get; set; }
    public int ConditionAfterCompletionLanes { get; set; } // Sub-question
    public int ConditionAfterCompletionFacilityType { get; set; } // Sub-question, possibly dropdown
    public string NameParallelFacility { get;set; }
    public int DailyTrafficStartYear { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? DailyTrafficStartRate { get; set; }
    public int DailyTrafficEndYear { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? DailyTrafficEndRate { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? TruckPercentShareAADT { get; set; }
    public int AccidentRateTypeId { get; set; } // Is actually dropdown
    public int CurrentPhaseId { get; set; }
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? TotalProjectCost { get; set; }
    public int ProjectFullyFundedId { get; set; } // Limit to Yes/No/Unknown
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? FundsStillNeeded { get; set; }
    public int YearProjectOperational { get; set; } // Dropdown is years 2020-2040
    public int MultiModeBicycleId { get; set; } // Limit to Yes/No/Unknown
    public int MultiModeHOVId { get; set; } // Limit to Yes/No/Unknown
    public int MultiModeTransitId { get; set; } // Limit to Yes/No/Unknown
    public int MultiModePedestrianId { get; set; } // Limit to Yes/No/Unknown
    public int EnvironmentalBenefitId { get; set; }
    public int EconomicBenefitId { get; set; }
    public int PrimaryPortOfEntryId { get; set; } 
    public int TerminusFacilityId { get; set; }
    [MaxLength]
    public string ProjectServesPortOfEntry { get; set; }

    [ForeignKey("ProjectId")]
    public virtual Project Project { get; set; }
    [ForeignKey("AccidentRateTypeId")]
    public virtual AccidentRateType AccidentRateType { get; set; }
    [ForeignKey("CurrentPhaseId, Language")]
    public virtual ProjectPhase RoadwayProjectPhase { get; set; }
    [ForeignKey("ProjectFullyFundedId, Language")]
    public virtual YesNo ProjectFullyFunded { get; set; }
    [ForeignKey("RoadwayProjectTypeId, Language")]
    public virtual InterchangeProjectType RoadwayProjectType { get; set; }
    [ForeignKey("MultiModeBicycleId, Language")]
    public virtual YesNo MultiModeBicycle { get; set; }
    [ForeignKey("MultiModeHOVId, Language")]
    public virtual YesNo MultiModeHOV { get; set; }
    [ForeignKey("MultiModeTransitId, Language")]
    public virtual YesNo MultiModeTransit { get; set; }
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
