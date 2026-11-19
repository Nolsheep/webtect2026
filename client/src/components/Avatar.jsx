// Member avatar: photo if photo_url is set in the DB, otherwise a glowing "planet" with initials.
export default function Avatar({ member, size = 72 }) {
  const style = { width: size, height: size, '--c': member.color || '#8b5cf6' };
  if (member.photo_url) {
    return <img className="avatar" style={style} src={member.photo_url} alt={member.nickname_en} />;
  }
  return (
    <div className="avatar planet" style={style} aria-hidden="true">
      <span>{member.nickname_en?.[0] ?? '?'}</span>
    </div>
  );
}
