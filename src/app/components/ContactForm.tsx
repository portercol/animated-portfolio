"use client";

import React, { useState } from "react";

type ContactFormProps = {
  className?: string;
};

export default function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    const newErrors = { name: "", email: "", message: "" };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!formData.message) {
      newErrors.message = "Message is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formData);
      setSuccessMessage("Thank you for your message!");
      setFormData({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full mt-1 px-4 py-2 bg-transparent border ${
              errors.name ? "border-red-500" : "border-gray-600"
            } rounded-md text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none`}
            placeholder="Your name"
          />
          {errors.name && (
            <span className="text-red-500 text-xs mt-1">{errors.name}</span>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full mt-1 px-4 py-2 bg-transparent border ${
              errors.email ? "border-red-500" : "border-gray-600"
            } rounded-md text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none`}
            placeholder="Your email"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">{errors.email}</span>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={`w-full mt-1 px-4 py-2 bg-transparent border ${
              errors.message ? "border-red-500" : "border-gray-600"
            } rounded-md text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none`}
            placeholder="Your message"
            rows={4}
          />
          {errors.message && (
            <span className="text-red-500 text-xs mt-1">{errors.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-cyan-600 hover:bg-cyan-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        >
          Send Message
        </button>
      </form>
      {successMessage && (
        <p className="text-cyan-500 text-md font-medium my-2.5">{successMessage}</p>
      )}
    </div>
  );
}
