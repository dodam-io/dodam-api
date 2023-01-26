export const findUsers = `select * from users;`;

export const findInstanceById = `
  select * from instances where id = ?;
`;

export const updateUserLastTootId = `
  update users set last_toot_id = ? where id = ?;
`;
