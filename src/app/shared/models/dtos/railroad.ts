export default interface RailroadDTO {
  // TODO: child of DataItem class
  /*
    public int ProjectId { get; set; }
    public string County { get; set; }
    public int RailProjectTypeId { get; set; }
    [MaxLength]
    public string ExistingCondition { get; set; }
    [MaxLength]
    public string ConditionProjectCompletion { get; set; }
    public int ConditionProjectCompletionYear { get; set; }
    public string LimitProjectFrom { get; set; }
    public string LimitProjectTo { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? LimitProjectBeginPost { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? LimitProjectEndPost { get; set; }
    public int AnnualYear { get; set; }
    public int ProjectionYear { get; set; }
    public int FreightProjAnnualTotalRailCars { get; set; }
    public int FreightProjProjectedRailCars { get; set; }
    public int PassProjAnnualTotalPass { get; set; }
    public int PassProjProjectedTotalPass { get; set; }
    public int GradeSeparation { get; set; } // Limit to Yes, No
    public int CurrentPhaseId { get; set; }
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? TotalProjectCost { get; set; }
    public int ProjectFullyFundedId { get; set; } // Limit to Yes/No
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? FundsStillNeeded { get; set; }
    public int YearProjectOperational { get; set; } // Dropdown has years 2020-2040
    public int EnvironmentalBenefitId { get; set; }
    public int EconomicBenefitId { get; set; }
    public int TerminusTypeId { get; set; }

    [ForeignKey("ProjectFullyFundedId, Language")]
    public virtual YesNo ProjectFullyFunded { get; set; }
    [MaxLength]
    public string ProjectServesPortOfEntry { get; set; }
    [ForeignKey("ProjectId")]
    public virtual Project Project { get; set; }
    [ForeignKey("RailProjectTypeId, Language")]
    public virtual RailProjectType RailProjectType { get; set; }
    [ForeignKey("CurrentPhaseId, Language")]
    public virtual ProjectPhase RailroadProjectPhase { get; set; }
    [ForeignKey("EnvironmentalBenefitId, Language")]
    public virtual DegreesType EnviromentalBenefit { get; set; }
    [ForeignKey("EconomicBenefitId, Language")]
    public virtual DegreesType EconomicBenefit { get; set; }
  */
}
