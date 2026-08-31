function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">

        <div>
          <div className="text-2xl font-bold tracking-tight">
            ABC<span className="font-light">Home</span>
          </div>

          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
            Modern products for modern homes.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Shop
          </h3>

          <div className="mt-4 space-y-3 text-sm text-gray-500">
            <p>Lighting</p>
            <p>Organization</p>
            <p>Decor</p>
            <p>Lifestyle</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">
            Help
          </h3>

          <div className="mt-4 space-y-3 text-sm text-gray-500">
            <p>Contact Us</p>
            <p>Shipping</p>
            <p>Returns</p>
            <p>FAQ</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">
            Company
          </h3>

          <div className="mt-4 space-y-3 text-sm text-gray-500">
            <p>About ABC Home</p>
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-400 sm:px-6 lg:px-8">
          © 2026 ABC Home. All rights reserved.
        </div>
      </div>

    </footer>
  )
}

export default Footer