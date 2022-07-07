export const newUsers = `
subscription UserSubscription {
   users(order_by: {createdat: asc}) {
    id
    name
    password
    salt
    createdat
    email
  }
}
`;
