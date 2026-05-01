// netlify/functions/_lib/users.js
// Reviewer registry. Add a new user by appending an entry here AND setting
// the matching AUTH_HASH_<USERID> env var (uppercase) in Netlify dashboard.
//
// To generate a password hash for the env var:
//   node scripts/hash-password.js
//
// Roles:
//   admin   — full access (manage users, all reviews)
//   reviewer — can review and update listings
//   ai      — automated agent (future; same review perms, distinct identity)

module.exports = [
  {
    id: 'paul',
    email: 'paul@lightworkdigital.com',
    name: 'Paul',
    role: 'admin',
    hashEnvVar: 'AUTH_HASH_PAUL',
  },
];
