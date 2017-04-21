import Link from 'next/link';

const linkStyle = {
  marginRight: 15,
};

const Header = () => (
    <div>
        <Link href="/">
          <a style={linkStyle}>Home</a>
        </Link>
        <Link href="/school">
          <a style={linkStyle}>School</a>
        </Link>
        <Link href="/student">
          <a style={linkStyle}>Student</a>
        </Link>
        <Link href="/about">
          <a style={linkStyle}>About</a>
        </Link>
    </div>
);

export default Header;
