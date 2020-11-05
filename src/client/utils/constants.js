export const BASE_BP_LOGIN_URL =
  'https://qa.bigparser.com/APIServices/api/common/login';

export const BASE_BP_GRID_URL = 'https://qa.bigparser.com/api/v2';

export const LOGIN_CREDENTIALS = {
  emailId: 'popeshealthcare@gmail.com',
  password: 'bHippojones*888',
  loggedIn: true,
};

export const MESSAGES_GRID_ID = '5fa1a37594a030055fadfbb7';
export const CALL_GRID_ID = '5fa1aa5694a030055fadfbfb';

export const buildHistoryQueryBody = ({ candidateNumber }) => ({
  query: {
    columnFilter: {
      filters: [
        {
          column: 'Candidate #',
          operator: 'EQ',
          keyword: `${candidateNumber}`,
        },
      ],
      filtersJoinOperator: 'AND',
    },
    globalColumnFilterJoinOperator: 'OR',
    sort: {
      age: 'asc',
    },
    pagination: {
      startRow: 1,
      rowCount: 50,
    },
    sendRowIdsInResponse: true,
    showColumnNamesInResponse: true,
  },
});

export const buildGridUrl = gridId =>
  `${BASE_BP_GRID_URL}/grid/${gridId}/search`;
