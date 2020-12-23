export const RendererBmpProjectsLine = {
  type: 'simple',  // autocasts as new SimpleRenderer()
  symbol: {
    type: 'simple-line',  // autocasts as new SimpleMarkerSymbol()
    width: 4,
    // color: '#f0a020' // orange
    color: 'red'
  }
};

export const RendererBmpProjectsMarker = {
  type: 'simple',  // autocasts as new SimpleRenderer()
  symbol: {
    type: 'simple-marker',  // autocasts as new SimpleMarkerSymbol()
    style: 'circle',
    size: '14px',  // pixels
    // color: '#f0a020', // orange
    color: 'red',
    outline: {  // autocasts as new SimpleLineSymbol()
      color: [ 255, 255, 255, 0.9 ],
      width: 1.2 // points
    }
  }
};

export const RendererBmpHistoricProjectsLine = {
  type: 'simple',  // autocasts as new SimpleRenderer()
  symbol: {
    type: 'simple-line',  // autocasts as new SimpleMarkerSymbol()
    width: 2,
    color: '#2860e2'
  }
};

export const RendererBmpHistoricProjectsMarker = {
  type: 'simple',  // autocasts as new SimpleRenderer()
  symbol: {
    type: 'simple-marker',  // autocasts as new SimpleMarkerSymbol()
    style: 'circle',
    size: '10px',  // pixels
    color: '#2860e2',
    outline: {  // autocasts as new SimpleLineSymbol()
      color: [ 255, 255, 255, 0.9 ],
      width: 1.2 // points
    }
  }
};

export const RendererAdminBoundaries = {
  type: 'simple',
  symbol: {
    type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
    color: [ 51, 51, 204, 0.9 ],
    style: 'none',
    outline: {  // autocasts as new SimpleLineSymbol()
      color: 'gray',
      width: 0.7
    }
  }
};

export const RendererBoundary = {
  type: 'simple',
  symbol: {
    type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
    color: [ 51, 51, 204, 0.9 ],
    style: 'none',
    outline: {  // autocasts as new SimpleLineSymbol()
      color: 'black',
      width: 1.5
    }
  }
};

export const RendererBmpZone = {
  type: 'simple',
  symbol: {
    type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
    color: [ 51, 51, 204, 0.1 ],
    style: 'solid',
    outline: {  // autocasts as new SimpleLineSymbol()
      color: 'white',
      width: 2
    }
  }
};
