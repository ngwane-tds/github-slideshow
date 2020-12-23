export function returnYearValues(short:boolean = false) {
  if (short) {
    return yearOptions.filter(( e: any)  => e.apiVal <= 2024);
  } else{
      return yearOptions;
  }
} 

const yearOptions: any = [
  {
    displayVal: 'Unknown/Desconocido',
    apiVal: -1
  },
  {
    displayVal: 2020,
    apiVal: 2020
  },
  {
    displayVal: 2021,
    apiVal: 2021
  },
  {
    displayVal: 2022,
    apiVal: 2022
  },
  {
    displayVal: 2023,
    apiVal: 2023
  },
  {
    displayVal: 2024,
    apiVal: 2024
  },
  {
    displayVal: 2025,
    apiVal: 2025
  },
  {
    displayVal: 2026,
    apiVal: 2026
  },
  {
    displayVal: 2027,
    apiVal: 2027
  },
  {
    displayVal: 2028,
    apiVal: 2028
  },
  {
    displayVal: 2029,
    apiVal: 2029
  },
  {
    displayVal: 2030,
    apiVal: 2030
  },
  {
    displayVal: 2031,
    apiVal: 2031
  },
  {
    displayVal: 2032,
    apiVal: 2032
  },
  {
    displayVal: 2033,
    apiVal: 2033
  },
  {
    displayVal: 2034,
    apiVal: 2034
  },
  {
    displayVal: 2035,
    apiVal: 2035
  },
  {
    displayVal: 2036,
    apiVal: 2036
  },
  {
    displayVal: 2037,
    apiVal: 2037
  },
  {
    displayVal: 2038,
    apiVal: 2038
  },
  {
    displayVal: 2039,
    apiVal: 2039
  },
  {
    displayVal: 2040,
    apiVal: 2040
  }
];
