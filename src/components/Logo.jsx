export default function Logo({ src, alt = 'Logo' }) {
    return <img className="logo" src={process.env.PUBLIC_URL + src} alt={alt} />;
  }
  