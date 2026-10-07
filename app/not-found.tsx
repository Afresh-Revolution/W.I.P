import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>This Page Has Taken A Different Route.</h1>
      <p>The page you’re looking for may have moved or no longer exists.</p>
      <div className="button-row">
        <Link className="btn btn-primary" href="/">
          Return home
        </Link>
        <Link className="btn btn-secondary" href="/about">
          Explore WIPI
        </Link>
      </div>
    </main>
  );
}
