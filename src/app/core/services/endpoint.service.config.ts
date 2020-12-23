import { environment } from '../../../environments/environment';

const API_URL = environment.api;
// const API_URL = 'https://localhost:5001/api'; // TODO Switch to environment once we get a basic api

export const LANG_ENGLISH = 'en';
export const LANG_SPANISH = 'es-mx';

export const ENDPOINTS: any = {
  API_URL: environment.api,
  API_METHODS: {
    ARCGIS_TOKEN_GET: `${API_URL}/ArcGISToken`,
    AUTHENICATE_POST: `${API_URL}/User/Login`
  },
  API_LOOKUP_GETS: {
    // `/Get?lang=${language}` is passed to all lookups in home service
    ACCIDENT_RATE_TYPE: `${API_URL}/AccidentRateType/Get`,
    CROSS_BORDER_PROJECT_TYPE: `${API_URL}/CrossBorderProjectType/Get`,
    CROSS_BORDER_PROJECT_PHASE: `${API_URL}/CrossBorderProjectPhase/Get`,
    DEGREES_TYPE: `${API_URL}/DegreesType/Get`,
    JURISDICTION: `${API_URL}/Jurisdiction/Get`,
    MODES_CARGO_CROSSING_TYPE: `${API_URL}/ModesCargoCrossingType/Get`,
    MODES_PASSENGER_CROSSING_TYPE: `${API_URL}/ModesPassengerCrossingType/Get`,
    PORT_OF_ENTRY_LOCATION: `${API_URL}/PortOfEntryLocation/Get`,
    PORT_OF_ENTRY_PROJECT_TYPE: `${API_URL}/PortOfEntryProjectType/Get`,
    PROJECT_TYPE: `${API_URL}/ProjectType/Get`,
    RAIL_PROJECT_PHASE_TYPE: `${API_URL}/RailProjectPhaseType/Get`,
    SHORT_TERM_PROJECT_PHASE: `${API_URL}/ShortTermProjectPhase/Get`,
    STATUS_TYPE: `${API_URL}/StatusType/Get`,
    FACILITY_TYPE: `${API_URL}/FacilityType/Get`,
    RAIL_TERMINUS_TYPE: `${API_URL}/RailTerminusType/Get`,
    TERMINUS_FACILITY_TYPE: `${API_URL}/TerminusFacilityType/Get`,
    VEHICLE_TYPE: `${API_URL}/VehicleType/Get`,
    YES_NO: `${API_URL}/YesNo/Get`
  },
  API_CONTROLLER_GETS: {
    ADMIN: {
      SYSTEM_OPEN_GET: `${API_URL}/BmpSystem/GetIsOpen`
    },
    HOME: {
      PROJECT_PHASE: `${API_URL}/ProjectPhase/GetByProjectType`, // projectTypeId & lang passed in home service
      PROJECTS_TABLE: `${API_URL}/Dashboard/GetProjects`,
      DASH_TABLE_FILTERS: `${API_URL}/Dashboard/GetFilters`,
      // GET PROJECT DETAILS BY ID OR PROJECTID
      PROJECT_DETAILS_BY_ID: {
        ROADWAY_GET: { projectTypeId: 10, URL: `${API_URL}/Roadway/GET` },
        INTERCHANGE_GET: { projectTypeId: 20, URL: `${API_URL}/Interchange/GET`},
        RAILROAD_GET: { projectTypeId: 30, URL: `${API_URL}/Railroad/GET` },
        PORT_OF_ENTRY_GET: { projectTypeId: 40, URL: `${API_URL}/PortOfEntry/GET`},
        CROSS_BORDER_GET: {projectTypeId: 50, URL: `${API_URL}/CrossBorder/GET`},
        SHORT_TERM_GET: { projectTypeId: 60, URL: `${API_URL}/ShortTerm/GET` },
      },
      PROJECT_DETAILS_BY_PROJECT_ID: {
        ROADWAY_GET: { projectTypeId: 10, URL: `${API_URL}/Roadway/GetProject` },
        INTERCHANGE_GET: { projectTypeId: 20, URL: `${API_URL}/Interchange/GetProject`},
        RAILROAD_GET: { projectTypeId: 30, URL: `${API_URL}/Railroad/GetProject` },
        PORT_OF_ENTRY_GET: { projectTypeId: 40, URL: `${API_URL}/PortOfEntry/GetProject`},
        CROSS_BORDER_GET: {projectTypeId: 50, URL: `${API_URL}/CrossBorder/GetProject`},
        SHORT_TERM_GET: { projectTypeId: 60, URL: `${API_URL}/ShortTerm/GetProject` }
      }
    },
    REPORTS: {
      GET_CSV: {
        CROSS_BORDER: `${API_URL}/CrossBorder/GetCSV`,
        PORT_OF_ENTRY: `${API_URL}/PortOfEntry/GetCSV`,
        ROADWAY: `${API_URL}/Roadway/GetCSV`,
        INTERCHANGE: `${API_URL}/Interchange/GetCSV`,
        SHORT_TERM: `${API_URL}/ShortTerm/GetCSV`,
        RAILROAD: `${API_URL}/Railroad/GetCSV`
      }
    },
    DASHBOARD: {
      GET_ALL: {
        Crossborder: `${API_URL}/CrossBorder/GetAll`,
        Port_of_Entry: `${API_URL}/PortOfEntry/GetAll`,
        Roadway: `${API_URL}/Roadway/GetAll`,
        Interchange: `${API_URL}/Interchange/GetAll`,
        Short_Term: `${API_URL}/ShortTerm/GetAll`,
        Railroad: `${API_URL}/Railroad/GetAll`
      }
    }
  },
  API_POST: {
    CROSS_BORDER: `${API_URL}/CrossBorder/POST`,
    PORT_OF_ENTRY: `${API_URL}/PortOfEntry/POST`,
    ROADWAY: `${API_URL}/Roadway/POST`,
    INTERCHANGE: `${API_URL}/Interchange/POST`,
    SHORT_TERM: `${API_URL}/ShortTerm/POST`,
    RAILROAD: `${API_URL}/Railroad/POST`
  },
  API_PUT: {
    CROSS_BORDER: `${API_URL}/CrossBorder/PUT`,
    PORT_OF_ENTRY: `${API_URL}/PortOfEntry/PUT`,
    ROADWAY: `${API_URL}/Roadway/PUT`,
    INTERCHANGE: `${API_URL}/Interchange/PUT`,
    SHORT_TERM: `${API_URL}/ShortTerm/PUT`,
    RAILROAD: `${API_URL}/Railroad/PUT`,
    SYSTEM_OPEN: `${API_URL}/BmpSystem/UpdateIsOpen`,
  },
  API_DELETE: {
    CROSS_BORDER: `${API_URL}/CrossBorder/DELETE`,
    PORT_OF_ENTRY: `${API_URL}/PortOfEntry/DELETE`,
    ROADWAY: `${API_URL}/Roadway/DELETE`,
    INTERCHANGE: `${API_URL}/Interchange/DELETE`,
    SHORT_TERM: `${API_URL}/ShortTerm/DELETE`,
    RAILROAD: `${API_URL}/Railroad/DELETE`
  },
  API_SUBMIT: {
    CROSS_BORDER: `${API_URL}/CrossBorder/SUBMIT`,
    PORT_OF_ENTRY: `${API_URL}/PortOfEntry/SUBMIT`,
    ROADWAY: `${API_URL}/Roadway/SUBMIT`,
    INTERCHANGE: `${API_URL}/Interchange/SUBMIT`,
    SHORT_TERM: `${API_URL}/ShortTerm/SUBMIT`,
    RAILROAD: `${API_URL}/Railroad/SUBMIT`
  }
};
