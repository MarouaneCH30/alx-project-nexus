export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-4 text-center border-t border-gray-800">
      <p className="text-sm opacity-70">
        © {new Date().getFullYear()} Martial Arts Store. All rights reserved.
      </p>
    </footer>
  );
}
