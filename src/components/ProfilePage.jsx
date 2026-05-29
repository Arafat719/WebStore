import { useState, useEffect } from "react";

import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
} from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);


  useEffect(() => {

    const getUser = async () => {

      try {

        // localStorage থেকে token নেওয়া
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/auth/getuser", {

          method: "GET",

          headers: {
            "Content-Type": "application/json",
            "token": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmExODAyMGE0MjI0NjViN2I4OTg5MDg3IiwibmFtZSI6IkFyYWZhdGtoYW4ifSwiaWF0IjoxNzc5OTgzOTAzfQ.n25KfOtclBYFnoZJC3W-XgddYJQ2cFhJGxWBhVTDS2s'
          }

        });

        const data = await response.json();
        setUser(data.user);

      } catch (error) {

        console.log(error);

      }

    };

    getUser();

  }, []);

  return (

    <div className="container-fluid bg-light min-vh-100">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 col-xl-2 bg-white border-end p-4">
          <div className="text-center mb-5">
            <div
              className="mx-auto d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
              style={{
                width: "80px",
                height: "80px",
                background: "#8682fa",
                fontSize: "32px",
              }}
            >
              {user?.name[0]}
            </div>

            <h4 className="mt-3 fw-bold">{user?.name}</h4>
            <p className="text-muted">Frontend Developer</p>
          </div>

          <div className="d-flex flex-column gap-3">
            <button
              className="btn text-start text-white fw-semibold"
              style={{ background: "#8682fa" }}
            >
              <User size={18} className="me-2" />
              Profile
            </button>

            <button className="btn btn-light text-start">
              <ShoppingBag size={18} className="me-2" />
              Orders
            </button>

            <button className="btn btn-light text-start">
              <Heart size={18} className="me-2" />
              Wishlist
            </button>

            <button className="btn btn-light text-start">
              <Settings size={18} className="me-2" />
              Settings
            </button>

            <button className="btn btn-light text-danger text-start" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("name"); navigate("/login"); }}>
              <LogOut size={18} className="me-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="col-lg-9 col-xl-10 p-4">
          {/* Banner */}
          <div
            className="rounded-4 p-4 text-white mb-4"
            style={{
              background:
                "linear-gradient(135deg, #8682fa, #a29fff)",
            }}
          >
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
              <div className="d-flex align-items-center gap-4">
                <img
                  src="https://i.pravatar.cc/200"
                  alt=""
                  className="rounded-circle border border-4 border-white"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />

                <div>
                  <h2 className="fw-bold mb-2">
                    Welcome, Arafat 👋
                  </h2>

                  <p className="mb-3">
                    Manage your profile and account settings.
                  </p>

                  <div className="d-flex flex-wrap gap-4">
                    <div>
                      <MapPin size={16} className="me-1" />
                      Bangladesh
                    </div>

                    <div>
                      <ShieldCheck size={16} className="me-1" />
                      Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="row g-3">
                {[
                  { title: "Orders", value: "12" },
                  { title: "Wishlist", value: "8" },
                  { title: "Reviews", value: "24" },
                ].map((item, i) => (
                  <div className="col-4" key={i}>
                    <div className="bg-white text-dark rounded-4 p-3 text-center">
                      <h3 className="fw-bold">{item.value}</h3>
                      <small>{item.title}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="row g-4">
            {/* Left */}
            <div className="col-xl-8">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold">User Information</h4>

                    <button
                      className="btn text-white"
                      style={{ background: "#8682fa" }}
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="row g-4">
                    {[
                      {
                        label: "Full Name",
                        value: user?.name,
                        icon: User,
                      },
                      {
                        label: "Email",
                        value: user?.email,
                        icon: Mail,
                      },
                      {
                        label: "Phone",
                        value: "+8801712345678",
                        icon: Phone,
                      },
                      {
                        label: "Location",
                        value: "Dhaka, Bangladesh",
                        icon: MapPin,
                      },
                    ].map((item, i) => (
                      <div className="col-md-6" key={i}>
                        <div className="border rounded-4 p-3 h-100">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: "50px",
                                height: "50px",
                                background: "#f1f0ff",
                                color: "#8682fa",
                              }}
                            >
                              <item.icon size={20} />
                            </div>

                            <div>
                              <small className="text-muted">
                                {item.label}
                              </small>

                              <h6 className="mb-0 fw-semibold">
                                {item.value}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Security</h4>

                  <div className="d-flex flex-column gap-3">
                    {[
                      "Email Verified",
                      "Phone Verified",
                      "2FA Enabled",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="d-flex justify-content-between align-items-center bg-light rounded-4 p-3"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <Lock size={18} color="#8682fa" />
                          <span>{item}</span>
                        </div>

                        <span className="badge bg-success">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Premium */}
              <div
                className="rounded-4 p-4 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #8682fa, #6d68ff)",
                }}
              >
                <h3 className="fw-bold">Premium Plan</h3>

                <p className="mt-3">
                  Unlock premium features for your account.
                </p>

                <button className="btn btn-light fw-semibold mt-2">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;