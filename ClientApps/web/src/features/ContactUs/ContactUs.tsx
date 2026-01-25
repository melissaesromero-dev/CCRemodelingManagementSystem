import { Link } from "react-router";
import Banner from "../../sharedFeatures/Banner/Banner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { type ContactFormInput, type ContactFormOutput, contactSchema } from "../../lib/schemas/contactUsSchema";


export default function ContactUs() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormOutput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<ContactFormOutput> = async (values) => {
    setSuccessMsg(null);

    // mock "send" delay
    await new Promise((res) => setTimeout(res, 900));

    console.log(values);
    setSuccessMsg("Thanks for reaching out! We will get back to you shortly.");

    reset();
  };

  return (
    <>
      {/* Contact */}
      <section id="contact" className="contact mb-6 position-relative">
        <Banner />
        <div className="container position-relative p-6 z-3">
          <div className="row">
            <div className="col-lg-6">
              <div className="text-container">
                {successMsg && (
                    <div className="alert alert-success mt-3" role="alert">
                      {successMsg}
                    </div>
                  )}
                <h5>Send us a message below!</h5>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="mb-3 d-flex">
                    <div className="w-50 me-2">
                      <input
                        type="text"
                        className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                        placeholder="Enter First Name"
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">{errors.firstName.message}</div>
                      )}
                    </div>

                    <div className="w-50">
                      <input
                        type="text"
                        className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                        placeholder="Enter Last Name"
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">{errors.lastName.message}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <input
                      type="email"
                      className={`form-control w-75 ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Enter Email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      className={`form-control w-75 ${errors.subject ? "is-invalid" : ""}`}
                      placeholder="Enter Subject"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <div className="invalid-feedback">{errors.subject.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <textarea
                      className={`form-control ${errors.message ? "is-invalid" : ""}`}
                      placeholder="Enter message"
                      rows={8}
                      {...register("message")}
                    />
                    {errors.message && (
                      <div className="invalid-feedback">{errors.message.message}</div>
                    )}
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send"}
                    </button>
                  </div>

                  
                </form>
              </div>
            </div>

            <div className="col-lg-6 d-md-flex justify-content-end">
              <div className="banner_cta">
                <Link to="/quote">
                  <button type="button" className="btn btn-primary btn-lg mt-4">
                    Request a Quote
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
