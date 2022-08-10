export const userReducer = (state, action) => {
  if (action.type === "landing") {
    return action.payload;
  }
  if (action.type === "logout") {
    return null;
  }
  return state;
};

export const pageTitleReducer = (state, action) => {
  if (action) {
    return action;
  }
  return state;
};
export const tabController = (state, action) => {
  if (action.type === "tab") {
    return action.payload;
  }
  return state;
};

export const dateReducer = (state, action) => {
  if (action) {
    return action.payload;
  }
  return state;
};