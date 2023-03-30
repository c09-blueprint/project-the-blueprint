/* just to format a header. */
export const getAuthHeader = (email, token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      UserEmail: email,
    },
  };
};
