import React, { useState } from "react";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // এখানে তুমি API call বা email service call করতে পারো
        console.log("User Message: ", formData);
        alert("Message Sent!");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <section className="contact-section py-5 bg-light">
            <div className="container">
                <h2 className="text-center mb-4">Contact Us</h2>
                <div className="row">
                    {/* Contact Form */}
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Message</label>
                                <textarea
                                    name="message"
                                    className="form-control"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="col-md-6">
                        <h5>Get in Touch</h5>
                        <p>Email: Arafatkhan01867160064@gmail.com</p>
                        <p>Phone: +880 1867160064</p>
                        <p>Address: Dhaka, Bangladesh</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;