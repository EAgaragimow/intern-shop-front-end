import { User } from '../../models/user';
import * as fromActions from '../actions/auth.actions';
import { Actions } from '../actions/auth.actions';

export interface AuthState  {
  currentUser: User | null;
  loading: boolean;
  loaded: boolean;
  isAuthorized: boolean;
  error?: string;
}

export const initialState: AuthState = {
  currentUser: null,
  loading: false,
  loaded: false,
  isAuthorized: false,
  error: null
};

export function reducer(state: AuthState = initialState, action: Actions): AuthState {

  switch (action.type) {
    case fromActions.AUTHENTICATE:
      return <AuthState>{
        ...state,
        loading: true
      };

    case fromActions.AUTHENTICATE_ERROR:
      return <AuthState>{
        ...state,
        isAuthorized: false,
        error: action['payload'].error,
        loading: false
      };

    case fromActions.AUTHENTICATE_SUCCESS:
      return <AuthState>{
        ...state,
        isAuthorized: true,
        loading: false,
        currentUser: {
          user: action['payload'].user
        },
        error: null
      };

    case fromActions.SIGN_UP_SUCCESS:
      return <AuthState>{
        ...state,
        isAuthorized: true,
        loading: false,
        currentUser: {
          id: action['payload'].token,
          login: action['payload'].login,
          password: action['payload'].password
        },
        error: null
      };

    case fromActions.SIGN_UP:
      return <AuthState>{
        ...state,
        isAuthorized: false,
        error: undefined,
        loading: true
      };

    case fromActions.SIGN_OUT: {
      localStorage.clear();

      return <AuthState>{
        ...state,
        currentUser: null,
        loading: false,
        loaded: false,
        isAuthorized: false,
        error: null
      };
    }

    case fromActions.GET_USER_INFO: {
      return <AuthState>{
        ...state,
        loading: true
      };
    }

    case fromActions.GET_USER_INFO_FAIL: {
      return <AuthState>{
        ...state,
        loading: false,
        currentUser: null,
        error: action['payload']
      };
    }

    case fromActions.GET_USER_INFO_SUCCESS: {
      return <AuthState>{
        ...state,
        loading: false,
        currentUser: action['payload'],
        isAuthorized: true
      };
    }

    default:
      return state;
  }
}

// export const getIsAuthenticated: any = (state: AuthState): boolean => state.isAuthorized;
// export const getIsAuthenticatedLoaded: any = (state: AuthState): boolean => state.loaded;
// export const getAuthenticatedUser: any = (state: AuthState): any => state.currentUser;
// export const getAuthenticationError: any = (state: AuthState): string => state.error;
// export const getIsLoading: any = (state: AuthState): boolean => state.loading;
// export const getUserInfo: any = (state: AuthState): any => state.currentUser;
