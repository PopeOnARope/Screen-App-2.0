// API URLS
export const BASE_BP_LOGIN_URL =
  'https://qa.bigparser.com/APIServices/api/common/login';

export const BASE_BP_GRID_URL = 'https://qa.bigparser.com/api/v2';

export const BASE_AUTHENTICATION_URL =
  'https://api.chasebox.com/screen-qa/login';

export const LOGIN_CREDENTIALS = {
  emailId: 'popeshealthcare@gmail.com',
  password: 'bHippojones*888',
  loggedIn: true,
};

export const MESSAGES_GRID_ID = '5fb55cd594a0300582b17e84';
export const CALL_GRID_ID = '5fb55d6294a0300582b17eb6';

export const SEND_MESSAGE_URL =
  'https://api.chasebox.com/screen-qa/message/send';
export const START_CONFERENCE_URL = 'https://api.chasebox.com/screen-qa/start';
export const KICK_URL = 'https://api.chasebox.com/screen-qa/kick';
export const ENTER_SCREENER_URL = 'https://api.chasebox.com/screen-qa/enter';
export const EXIT_SCREENER_URL = 'https://api.chasebox.com/screen-qa/exit';

// Keys
export const callStatusKeys = {
  'in-progress': {
    title: 'In Progress',
    iconName: 'phone-call',
    fill: 'green',
    showTime: false,
  },
  initiated: {
    title: 'Initiated',
    iconName: 'phone-call',
    fill: 'green',
    showTime: true,
  },
  'participant-join': {
    title: 'Participant Joined the Call',
    iconName: 'phone-call',
    fill: 'green',
    showTime: true,
  },
  completed: {
    title: 'Ended',
    iconName: 'phone',
    fill: 'red',
    showTime: true,
  },
};
