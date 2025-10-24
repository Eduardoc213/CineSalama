export default function UsersTable({ users }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 12 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Nombre</th>
            <th style={th}>Username</th>
            <th style={th}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id ?? u._id ?? JSON.stringify(u)}>
              <td style={td}>{u.id ?? u._id ?? '-'}</td>
              <td style={td}>{u.nombre ?? u.name ?? '-'}</td>
              <td style={td}>{u.username ?? u.user ?? '-'}</td>
              <td style={td}>{u.email ?? u.correo ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  textAlign: 'left',
  padding: '8px',
  borderBottom: '1px solid #ddd',
  fontWeight: 600,
};

const td = {
  padding: '8px',
  borderBottom: '1px solid #eee',
};