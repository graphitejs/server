import Link from 'next/link';

const linkStyle = {
  marginRight: 15,
};

const Header = () => (
    <header>
      <style jsx>{`
        header {
          margin: 20px;
          padding: 20px;
          border: 1px solid #DDD;
        }
      `}
      </style>
      <Link as="/" href="/Index">
        <a style={linkStyle}>Home</a>
      </Link>
      <Link as="/about" href="/About">
        <a style={linkStyle}>About</a>
      </Link>
    </header>
);

export default Header;
