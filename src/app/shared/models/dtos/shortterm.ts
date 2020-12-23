export default interface ShortTerm {
  // TODO: child of DataItem class
  /*
    public int ProjectId { get; set; }
    public string County { get; set; }
    public int ShortTermProjectTypeId { get; set; }

    [MaxLength]
    public string ExistingCondition { get; set; }
    [MaxLength]
    public string ConditionProjectCompletion { get; set; }
    public int ConditionProjectCompletionYear { get; set; }
    public int CurrentPhaseId { get; set; }
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? TotalProjectCost { get; set; }
    public int ProjectFullyFundedId { get; set; } // Limit to Yes/No/Unknown
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? FundsStillNeeded { get; set; }
    public int YearProjectOperational { get; set; } // Dropdown years 2020-2024
    public int PrimaryPortOfEntryId { get; set; }
    [MaxLength]
    public string HowReduceBorderWait { get; set; }
    [ForeignKey("ProjectId")]
    public virtual Project Project { get; set; }
    [ForeignKey("CurrentPhaseId, Language")]
    public virtual ProjectPhase ShortTermProjectPhase { get; set; }
    [ForeignKey("ShortTermProjectTypeId, Language")]
    public virtual ShortTermProjectType ShortTermProjectType { get; set; }
    [ForeignKey("PrimaryPortOfEntryId, Language")]
    public virtual PortOfEntryLocation PortOfEntryLocation { get;set; }
    [ForeignKey("ProjectFullyFundedId, Language")]
    public virtual YesNo ProjectFullyFunded { get; set; }
    */
}
