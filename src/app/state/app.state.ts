/*
global state is defined this way for lazy loading enhancements:
  - if feature isn't lazy loaded (such as user, place in root here)
  - if lazy loaded feature, place in feature-level state
*/
//  global state, comprised of feature level state interfaces

export interface State {
  user?: any;
}
