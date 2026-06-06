import React, { useState, useRef } from "react"
import { User, Lock, Eye, EyeOff, Camera } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export function SignInCard() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("Procurement Officer")
  const [password, setPassword] = useState("password123")
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false)
  const fileInputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    console.log("sign in:", { username, password })
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
    <div className="w-full max-w-[380px] rounded-3xl border border-white/60 bg-white/45 p-8 shadow-2xl shadow-sky-900/15 backdrop-blur-xl animate-slideUp">
      <div className="mb-4 flex flex-col items-center justify-center">
        <img src="/logo.png" className="h-12 w-12 object-contain rounded-xl shadow-lg border border-white/5" alt="VB Logo" />
        <h1 className="text-center text-xl font-bold gradient-text mt-3 mb-1">VendorBridge</h1>
        <p className="text-center text-xs text-slate-400">Sign in to continue</p>
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
                <span className="text-[10px] font-medium text-slate-400">Photo</span>
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
        <div className="relative">
          <User
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            aria-label="Username"
            className="w-full rounded-xl border border-white/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-200/70 focus:shadow-sm"
          />
        </div>

        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
            className="w-full rounded-xl border border-white/70 bg-white/70 py-3 pl-10 pr-10 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-200/70 focus:shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-slate-600"
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/20 active:scale-[0.98] relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          Login
        </button>
      </form>

      {/* Register link */}
      <div className="mt-5 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-slate-700 underline-offset-2 transition-colors duration-200 hover:text-slate-900 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}
