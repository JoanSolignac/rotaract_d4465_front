const DEFAULT_AUTH_BACKGROUND =
  'https://api.builder.io/api/v1/image/assets/TEMP/722a988afc24c9d265123ec1217424cbea5a3927?width=2000';

const AuthBackground = ({ image = DEFAULT_AUTH_BACKGROUND }) => (
  <img className="auth-background" src={image} alt="Auth background" />
);

export default AuthBackground;
