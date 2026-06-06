import React, { useState, useRef } from "react"
import { Camera, User, Mail, Phone, Briefcase, Globe, FileText, ChevronDown } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const ROLES = [
  "Admin",
  "Officer",
  "Manager",
  "Developer",
  "Designer",
  "Analyst",
  "Student",
  "Other",
]

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "Other",
]

export function RegisterCard() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("Procurement")
  const [lastName, setLastName] = useState("Officer")
  const [email, setEmail] = useState("officer@vendorbridge.com")
  const [phone, setPhone] = useState("+91 98765 43210")
  const [role, setRole] = useState("Officer")
  const [country, setCountry] = useState("India")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false)
  const [isRoleOpen, setIsRoleOpen] = useState(false)
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const fileInputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    console.log("register:", {
      firstName,
      lastName,
      email,
      phone,
      role,
      country,
      additionalInfo,
    })
    navigate("/dashboard")
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full max-w-[480px] rounded-3xl border border-white/60 bg-white/45 p-8 shadow-2xl shadow-sky-900/15 backdrop-blur-xl animate-slideUp">
      <div className="mb-4 flex flex-col items-center justify-center">
        <img src="/logo.png" className="h-12 w-12 object-contain rounded-xl shadow-lg border border-white/5" alt="VB Logo" />
        <h1 className="text-center text-xl font-bold gradient-text mt-3 mb-1">VendorBridge</h1>
        <p className="text-center text-xs text-slate-400">Create your account</p>
      </div>
      {/* Photo Upload */}
      <div className="mb-6 flex flex-col items-center">
        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => setIsHoveringPhoto(true)}
          onMouseLeave={() => setIsHoveringPhoto(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300/80 bg-white/60 shadow-inner transition-all duration-300 hover:border-slate-400 hover:bg-white/80 hover:shadow-md">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera
                  className={`h-6 w-6 text-slate-400 transition-all duration-300 ${isHoveringPhoto ? "scale-110 text-slate-600" : ""}`}
                />
                <span className="text-[10px] font-medium text-slate-400">
                  Photo
                </span>
              </div>
            )}
          </div>
          {photoPreview && isHoveringPhoto && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 transition-opacity duration-200">
              <Camera className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
          aria-label="Upload profile photo"
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <User
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              aria-label="First Name"
              className="w-full rounded-xl border border-white/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-200/70 focus:shadow-sm"
            />
          </div>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              aria-label="Last Name"
              className="w-full rounded-xl border border-white/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-200/70 focus:shadow-sm"
            />
          </div>
        </div>

        {/* Row 2: Email & Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              aria-label="Email Address"
              className="w-full rounded-xl border border-white/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-200/70 focus:shadow-sm"
            />
          </div>
          <div className="relative">
            <Phone
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              aria-label="Phone Number"
              className="w-full rounded-xl border border-white/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-200/70 focus:shadow-sm"
            />
          </div>
        </div>

        {/* Row 3: Role & Country */}
        <div className="grid grid-cols-2 gap-3">
          {/* Role Dropdown */}
          <div className="relative">
            <Briefcase
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => {
                setIsRoleOpen((v) => !v)
                setIsCountryOpen(false)
              }}
              className="flex w-full items-center justify-between rounded-xl border border-white/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-200/70 focus:shadow-sm"
              aria-label="Select Role"
            >
              <span className={role ? "text-slate-700" : "text-slate-400"}>
                {role || "Role (Admin, Officer...)"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isRoleOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isRoleOpen && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-white/70 bg-white/95 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r)
                      setIsRoleOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl hover:bg-sky-50 ${
                      role === r
                        ? "bg-sky-50 font-medium text-slate-800"
                        : "text-slate-600"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Country Dropdown */}
          <div className="relative">
            <Globe
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => {
                setIsCountryOpen((v) => !v)
                setIsRoleOpen(false)
              }}
              className="flex w-full items-center justify-between rounded-xl border border-white/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-200/70 focus:shadow-sm"
              aria-label="Select Country"
            >
              <span className={country ? "text-slate-700" : "text-slate-400"}>
                {country || "Country"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isCountryOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isCountryOpen && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-white/70 bg-white/95 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200">
                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCountry(c)
                      setIsCountryOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl hover:bg-sky-50 ${
                      country === c
                        ? "bg-sky-50 font-medium text-slate-800"
                        : "text-slate-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="relative">
          <FileText
            className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400"
            aria-hidden="true"
          />
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Additional Information ...."
            aria-label="Additional Information"
            rows={3}
            className="w-full resize-none rounded-xl border border-white/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-200/70 focus:shadow-sm"
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/20 active:scale-[0.98] relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          Register
        </button>
      </form>

      {/* Login link */}
      <div className="mt-5 text-center">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-slate-700 underline-offset-2 transition-colors duration-200 hover:text-slate-900 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
