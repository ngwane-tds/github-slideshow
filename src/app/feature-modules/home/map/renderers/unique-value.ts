const fieldName = 'City_Name';
const cityNames: string[] = ['IMPERIAL BEACH', 'CHULA VISTA', 'SAN DIEGO'];
// use arcade to match a list of city names
const arcadeExp = `When(IndexOf(${JSON.stringify(cityNames)},
Text($feature.${fieldName})) != -1, 'Border Jurisdiction', 'Other Jurisdiction')`;

export const RendererAdminBoundariesUV = {
  type: 'unique-value',
  field: fieldName,
  valueExpression: arcadeExp,
  defaultSymbol: {
    type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
    color: [ 51, 51, 204, 0.2 ],
    style: 'solid',
    outline: {  // autocasts as new SimpleLineSymbol()
      color: 'black',
      width: 1
    }
  },
  uniqueValueInfos: [{
    // All features with value of "North" will be blue
    value: 'Border Jurisdiction',
    label: 'Border Jurisdiction',
    symbol: {
      type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
      color: [ 51, 51, 204, 0.2 ],
      style: 'solid',
      outline: {  // autocasts as new SimpleLineSymbol()
        color: 'black',
        width: 1
      }
    }
  }, {
    // All features with value of "North" will be blue
    value: 'Other Jurisdiction',
    label: 'Other Jurisdiction',
    symbol: {
      type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
      color: [ 0, 0, 0, 0.5 ],
      style: 'solid',
      outline: {  // autocasts as new SimpleLineSymbol()
        color: 'black',
        width: 1
      }
    }
  },
  ]
};

const fieldNameMexico = 'NOM_MUN';
const muniNames: string[] = ['Tijuana', 'Playas de Rosarito', 'Tecate', 'Ensenada', 'Mexicali'];
// use arcade to match a list of city names
const exp = `When(IndexOf(${JSON.stringify(muniNames)},
Text($feature.${fieldNameMexico})) != -1, 'Border Jurisdiction', 'Other Jurisdiction')`;

export const RendererAdminBoundariesMexico = {
  type: 'unique-value',
  field: fieldNameMexico,
  valueExpression: exp,
  defaultSymbol: {
    type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
    color: [ 51, 51, 204, 0.2 ],
    style: 'solid',
    outline: {  // autocasts as new SimpleLineSymbol()
      color: 'black',
      width: 1
    }
  },
  uniqueValueInfos: [{
    // All features with value of "North" will be blue
    value: 'Border Jurisdiction',
    label: 'Border Jurisdiction',
    symbol: {
      type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
      color: [ 51, 51, 204, 0.2 ],
      style: 'solid',
      outline: {  // autocasts as new SimpleLineSymbol()
        color: 'black',
        width: 1
      }
    }
  }, {
    // All features with value of "North" will be blue
    value: 'Other Jurisdiction',
    label: 'Other Jurisdiction',
    symbol: {
      type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
      color: [ 0, 0, 0, 0.5 ],
      style: 'solid',
      outline: {  // autocasts as new SimpleLineSymbol()
        color: 'black',
        width: 1
      }
    }
  },
  ]
};
