import { createReducer, createActions } from 'reduxsauce';
import { SET_LOGOUT_REQUEST } from './AuthRedux';

const INITIAL_STATE = {
  username: '',
  birthDate: undefined,
  gender: undefined,
  email: '',
  password: ''
};

export const getSignupValues = state => state.signup;
export const getSignupUsername = state => state.signup.username;
export const getSignupBirthDate = state => state.signup.username;
export const getSignupGender = state => state.signup.gender;
export const getSignupEmail = state => state.signup.email;
export const getSignupPassword = state => state.signup.password;

const { Types, Creators } = createActions({
  setSignupUsername: ['username'],
  setSignupGender: ['gender'],
  setSignupBirthDate: ['birthDate'],
  setSignupEmail: ['email'],
  setSignupPassword: ['password'],
  setSignupComplete: null
});

// Types and Actions
export const {
  SET_SIGNUP_USERNAME,
  SET_SIGNUP_GENDER,
  SET_SIGNUP_BIRTH_DATE,
  SET_SIGNUP_EMAIL,
  SET_SIGNUP_PASSWORD,
  SET_SIGNUP_COMPLETE
} = Types;
export const {
  setSignupUsername,
  setSignupGender,
  setSignupBirthDate,
  setSignupEmail,
  setSignupPassword,
  setSignupComplete
} = Creators;

const reduceSetSignupUsername = (state, { username }) => {
  return {
    ...state,
    username
  };
};
const reduceSetSignupGender = (state, { gender }) => {
  return {
    ...state,
    gender
  };
};
const reduceSetSignupBirthDate = (state, { birthDate }) => {
  return {
    ...state,
    birthDate
  };
};

const reduceSetSignupEmail = (state, { email }) => {
  return {
    ...state,
    email
  };
};

const reduceSetSignupPassword = (state, { password }) => {
  return {
    ...state,
    password
  };
};

const reduceResetSignup = () => {
  return {
    ...INITIAL_STATE
  };
};

const reducer = createReducer(INITIAL_STATE, {
  [SET_SIGNUP_USERNAME]: reduceSetSignupUsername,
  [SET_SIGNUP_GENDER]: reduceSetSignupGender,
  [SET_SIGNUP_BIRTH_DATE]: reduceSetSignupBirthDate,
  [SET_SIGNUP_EMAIL]: reduceSetSignupEmail,
  [SET_SIGNUP_PASSWORD]: reduceSetSignupPassword,
  [SET_LOGOUT_REQUEST]: reduceResetSignup
});

// Reducer
export default reducer;
