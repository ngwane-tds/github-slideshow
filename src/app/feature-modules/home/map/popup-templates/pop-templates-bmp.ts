export const PopupTemplateBmpZone = {
  title: 'BMP 10 Mile Zone',
  content: [{
    type: 'fields', // Autocasts as new FieldsContent()
    // Autocasts as new FieldInfo[]
    fieldInfos: [{}]
  }]
};

export const PopupTemplateBmpProject = {
  title: 'BMP Project',
  content: [{
    type: 'fields', // Autocasts as new FieldsContent()
    // Autocasts as new FieldInfo[]
    fieldInfos: [
      {
        fieldName: 'ProjectNumber',
        label: 'Project Number',
      }
      /*
      {
        fieldName: 'ProjectID',
        label: 'Project ID',
        // Autocasts as new FieldInfoFormat()
        format: {
          digitSeparator: true
        }
      },
      {
        fieldName: 'ProjectNumber',
        label: 'Project Number',
      },
      {
        fieldName: 'CreatedByID',
        label: 'CreatedByID',
      },
      {
        fieldName: 'CreatedDate',
        label: 'CreatedDate',
      },
      {
        fieldName: 'ModifiedByID',
        label: 'ModifiedByID',
      },
      {
        fieldName: 'ModifiedDate',
        label: 'ModifiedDate',
      },*/
    ]
  }]
};

export const PopupTemplateBmpHistoricLine = {
  title: 'Historic BMP Project Line',
  content: [{
    type: 'fields', // Autocasts as new FieldsContent()
    // Autocasts as new FieldInfo[]
    fieldInfos: [
      {
        fieldName: 'Proj_ID',
        label: 'Project ID',
      },
      {
        fieldName: 'Comments',
        label: 'Comments',
      },
      {
        fieldName: 'Time',
        label: 'Time',
      },
      {
        fieldName: 'Users',
        label: 'Users',
      },
      {
        fieldName: 'Checked',
        label: 'Checked',
      },
    ]
  }]
};

export const PopupTemplateBmpHistoricPoint = {
  title: 'Historic BMP Project Point',
  content: [{
    type: 'fields', // Autocasts as new FieldsContent()
    // Autocasts as new FieldInfo[]
    fieldInfos: [
      {
        fieldName: 'Proj_ID',
        label: 'Project ID',
      },
      {
        fieldName: 'Comments',
        label: 'Comments',
      },
      {
        fieldName: 'Time',
        label: 'Time',
      },
      {
        fieldName: 'Users',
        label: 'Users',
      },
      {
        fieldName: 'Checked',
        label: 'Checked',
      },
    ]
  }]
};
