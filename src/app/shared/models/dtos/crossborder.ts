export default interface CrossborderDTO {
  // TODO: child of DataItem class
  /*
    public int ProjectId { get; set; }
    public string County { get; set; }
    public int CrossborderProjectTypeId { get; set; }
    public string LimitProjectFrom { get; set; }
    public string LimitProjectTo { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? LimitProjectBeginPost { get; set; }
    [Column(TypeName = "decimal(16, 6)")]
    public decimal? LimitProjectEndPost { get; set; }
    public string ExistingCondition { get; set; }
    public string ConditionProjectCompletion { get; set; }
    public int ConditionProjectCompletionYear { get; set; }
    public int CurrentPhaseId { get; set; }
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? TotalProjectCost { get; set; }
    public int ProjectFullyFundedId { get; set; } // Limit to Yes/No
    [Column(TypeName = "decimal(16, 2)")]
    public decimal? FundsStillNeeded { get; set; }
    public int YearProjectOperational { get; set; } // Dropdown years 2020-2040
    public int PrimaryPortOfEntryId { get; set; }
    public int TerminusFacilityId { get; set; }
    [MaxLength]
    public string ProjectServesPortOfEntry { get; set; }
    /// <summary>
    /// Value List
    /// </summary>
    [ForeignKey("ProjectFullyFundedId, Language")]
    public virtual YesNo ProjectFullyFunded { get; set; }
    [ForeignKey("ProjectId")]
    public virtual Project Project { get; set; }
    [ForeignKey("CrossborderProjectTypeId, Language")]
    public virtual CrossBorderProjectType CrossborderProjectType { get; set; }
    [ForeignKey("CurrentPhaseId, Language")]
    public virtual ProjectPhase CrossborderProjectPhase { get; set; }
    [ForeignKey("PrimaryPortOfEntryId, Language")]
    public virtual PortOfEntryLocation PrimaryPortOfEntry { get; set; }
    [ForeignKey("TerminusFacilityId, Language")]
    public virtual TerminusFacilityType TerminusFacility { get; set; }
    */
}
