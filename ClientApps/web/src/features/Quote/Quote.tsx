import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLookups } from "../../hooks/useLookups";
import { useQuoteRequest } from "../../hooks/useQuoteRequest";

import Banner from "../../sharedFeatures/Banner/Banner";
import {
  quoteRequestSchema,
  type QuoteRequestFormInput,
  type QuoteRequestFormOutput, } from "../../lib/schemas/quoteRequestSchema";
import { useEffect, useState } from "react";

export default function Quote() {
  //Set look-up for states, contact methods and best times
  const {states, mainTypes, contactMethods, bestTimes, budgetRanges} = useLookups();

  const {submitQuoteRequest} = useQuoteRequest();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<QuoteRequestFormInput, unknown, QuoteRequestFormOutput>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      sameAddress: false,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: null,
      city: "",
      zip: null,          
      stateId: 0,
      contactMethod: 0,
      bestTime: 0,
      
      mainServiceTypeId: 0,
      serviceDesc: "",
      serviceAddress: "",
      serviceCity: "",
      serviceZip: undefined,   
      serviceStateId: 38,       
      budgetRangeId: 0,
      desiredStartDate: null,
      
    },
    mode: "onTouched",
  });

  useEffect(() => {
  // only run once states are loaded and PA exists in the list
  if (states?.some(s => s.id === 38)) {
    setValue("serviceStateId", 38, { shouldValidate: true, shouldDirty: false });
  }
}, [states, setValue]);

    //Same Address checkbox
    const sameAddress = watch("sameAddress");
    const address = watch("address");
    const city = watch("city");
    const stateId = watch("stateId");
    const zip = watch("zip");
    const [paAlert, setPaAlert] = useState<string | null>(null);

    useEffect(() => {
        // When user checks the same address as above check box
        if (!sameAddress) return;

        // If customer state is not selected yet, don't do anything
        if (!stateId || stateId === 0) {
            setPaAlert("Please select a state first.");
            setValue("sameAddress", false, { shouldDirty: true });
            return;
        }

        // If not PA, cancel and show alert
        if (stateId !== 38) {
            setPaAlert("We currently only service Pennsylvania. Please enter a PA service address.");
            setValue("sameAddress", false, { shouldDirty: true });
            return;
        }

        // OK: Fill service fields
        setPaAlert(null);

        setValue("serviceAddress", address ?? "", { shouldDirty: true, shouldValidate: true });
        setValue("serviceCity", city ?? "", { shouldDirty: true, shouldValidate: true });
        setValue("serviceStateId", 38, { shouldDirty: true, shouldValidate: true });
        setValue("serviceZip", zip ? zip : undefined, { shouldDirty: true, shouldValidate: true });
        }, [sameAddress, stateId, address, city, zip, setValue]);


        //clear address on uncheck
        useEffect(() => {
            if (sameAddress) return;

            // optional: clear when unchecked
            setValue("serviceAddress", "", { shouldDirty: true });
            setValue("serviceCity", "", { shouldDirty: true });
            setValue("serviceStateId", 38, { shouldDirty: true });
            setValue("serviceZip", undefined, { shouldDirty: true });
            }, [sameAddress, setValue]);

    
            //set date min and max
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = today.toISOString().split("T")[0];

    const maxDateObj = new Date(today);
    maxDateObj.setFullYear(maxDateObj.getFullYear()+ 2);
    const maxDate = maxDateObj.toISOString().split("T")[0];

    
    //Submit form
    const onSubmit: SubmitHandler<QuoteRequestFormOutput> = async (values) => {
        const dto ={  
        ...values,
        address: values.address || undefined,
        zip: values.zip || undefined,
        serviceZip: values.serviceZip || undefined,
        desiredStartDate: values.desiredStartDate ? values.desiredStartDate : undefined,
        };

        await submitQuoteRequest.mutateAsync(dto);

        (document.activeElement as HTMLElement | null)?.blur();
        
        requestAnimationFrame(() => {
        document.getElementById("quoteTop")?.scrollIntoView({ behavior: "auto", block: "start" });
        });

        reset();
    };

    return (
    <>
        <section id="quoteTop" className="contact position-relative mb-5">
            <Banner />

            <div className="container position-relative z-3">
                {submitQuoteRequest.isSuccess && (
                            <div className="alert alert-success mt-3" role="alert">
                            {submitQuoteRequest.data}
                            </div>
                        )}
                        {submitQuoteRequest.isError && (
                            <div className="alert alert-danger mt-3" role="alert">
                            Submission failed. Please try again.
                            </div>
                        )}
                <div className="row align-items-stretch my-4">
                    <p>Details help us prepare, but final pricing follows an on-site visit. We will contact you to schedule, then send a written estimate. For a faster quote, call us to schedule your on-site visit at (717) 435-4544.</p>
                </div>

                <div className="row align-items-stretch">
                {/* LEFT: Images laid out like your guide */}
                <div className="col-lg-6 d-none d-md-block">
                    <div className="image-container h-100 w-100">
                    <div className="quote-images">
                        <img
                        src="/images/generalPics/quotePic_removebgtall.png"
                        alt="Kitchen remodel"
                        className="img-fluid quote-img quote-img-top"
                        loading="lazy"
                        />
                        
                    </div>
                    </div>
                </div>

                {/* RIGHT: Form */}
                <div className="col-lg-6">
                    <div className="text-container">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* First + Last */}
                        <div className="mb-3 d-flex gap-2">
                            <div className="w-100">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`} 
                                    placeholder="Enter First Name"
                                    {...register("firstName")} />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                            </div>
                            
                            <div className="w-100">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`} 
                                    placeholder="Enter Last Name"
                                    {...register("lastName")} />
                                {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                            </div>                            
                            

                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <input 
                                type="email" 
                                className={`form-control ${errors.email ? "is-invalid" : ""}`} 
                                placeholder="Enter Email"
                                {...register("email")} />
                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                        </div>

                        {/* Phone */}
                        <div className="mb-3">
                            <input 
                                type="tel" 
                                className={`form-control ${errors.phone ? "is-invalid" : ""}`} 
                                placeholder="Enter Phone"
                                {...register("phone")} />
                            {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                        </div>

                        <hr className="my-4" />

                        {/* Address */}
                        <div className="mb-3">
                            <input 
                                type="text" 
                                className={`form-control ${errors.address ? "is-invalid" : ""}`} 
                                placeholder="Enter Street Address"
                                {...register("address")} />
                            {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
                        </div>

                        <div className="mb-3 row g-2">
                            <div className="col-md-5">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.city ? "is-invalid" : ""}`} 
                                    placeholder="Enter City"
                                    {...register("city")} />
                                {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
                            </div>

                            <div className="col-md-4">
                                <select 
                                    className={`form-select ${errors.stateId ? "is-invalid" : ""}`} 
                                    {...register("stateId", {valueAsNumber: true})}>
                                    <option value={0} disabled>Pick State</option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.id}>
                                            {state.shortName}
                                        </option>
                                    ))}
                                </select>
                                {errors.stateId && <div className="invalid-feedback">{errors.stateId.message}</div>}
                            </div>

                            <div className="col-md-3">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.zip ? "is-invalid" : ""}`} 
                                    placeholder="Enter Zip"
                                    {...register("zip")} />
                                {errors.zip && <div className="invalid-feedback">{errors.zip.message}</div>}
                            </div>
                        </div>

                        <div className="pt-3">
                            {paAlert && (
                                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                    <strong>Service Area Notice:</strong> {paAlert}
                                    <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setPaAlert(null)}
                                    />
                                </div>
                            )}
                            <h6>Service Address</h6>
                        </div>

                        {/* Same Address */}
                        <div className="form-check mb-3">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="sameAddress"
                                {...register("sameAddress")} />
                        <label className="form-check-label" htmlFor="sameAddress">
                            Same address as above
                        </label>
                        </div>

                        {/* Service Address */}
                        <div className="mb-3">
                            <input 
                                type="text" 
                                className={`form-control ${errors.serviceAddress ? "is-invalid" : ""}`} 
                                placeholder="Enter Service Street Address"
                                {...register("serviceAddress")} />
                            {errors.serviceAddress && <div className="invalid-feedback">{errors.serviceAddress.message}</div>}
                        </div>

                        <div className="mb-3 row g-2">
                        <div className="col-md-5">
                            <input 
                                type="text" 
                                className={`form-control ${errors.serviceCity ? "is-invalid" : ""}`} 
                                placeholder="Enter City"
                                {...register("serviceCity")} />
                            {errors.serviceCity && <div className="invalid-feedback">{errors.serviceCity.message}</div>}
                        </div>
                        <div className="col-md-4">
                            <select 
                                className={`form-select ${errors.serviceStateId ? "is-invalid" : ""}`} 
                                {...register("serviceStateId", {valueAsNumber: true})}>
                                <option value={0} disabled>Pick State</option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.id}>
                                            {state.shortName}
                                        </option>
                                    ))}
                            </select>
                            {errors.serviceStateId && <div className="invalid-feedback">{errors.serviceStateId.message}</div>}
                        </div>
                        <div className="col-md-3">
                            <input 
                                type="text" 
                                className={`form-control ${errors.serviceZip ? "is-invalid" : ""}`} 
                                placeholder="Enter Zip"
                                {...register("serviceZip")} />
                            {errors.serviceZip && <div className="invalid-feedback">{errors.serviceZip.message}</div>}
                        </div>
                        </div>

                        {/* Project Type */}
                        <div className="mb-3">
                            <select 
                                className={`form-select ${errors.mainServiceTypeId ? "is-invalid" : ""}`} 
                                defaultValue=""
                                {...register("mainServiceTypeId", {valueAsNumber: true})}>
                                <option value="0" disabled>Select Project Type</option>
                                {mainTypes.map((mainType) => (
                                    <option key={mainType.id} value={mainType.id}>
                                        {mainType.description}
                                    </option>
                                ))}
                            </select>
                            {errors.mainServiceTypeId && (
                            <div className="invalid-feedback">{errors.mainServiceTypeId.message}</div>
                            )}

                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <textarea 
                                className={`form-control ${errors.serviceDesc ? "is-invalid" : ""}`} 
                                placeholder="Enter Project Description" 
                                rows={5}
                                {...register("serviceDesc")} />
                            {errors.serviceDesc && <div className="invalid-feedback">{errors.serviceDesc.message}</div>}
                        </div>

                        {/* Best time + preferred contact */}
                        <div className="mb-3 row g-2">
                        <div className="col-md-6">
                            <select 
                                className="form-select" 
                                {...register("bestTime", {valueAsNumber: true})}>
                                <option value="" disabled>Select Best Time to Reach</option>
                                    {bestTimes.map((bestTime) => (
                                        <option key={bestTime.id} value={bestTime.id}>
                                            {bestTime.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <select 
                                className="form-select" 
                                {...register("contactMethod", {valueAsNumber: true})}>
                            <option value="" disabled>Select Preferred Contact</option>
                                    {contactMethods.map((method) => (
                                        <option key={method.id} value={method.id}>
                                            {method.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        </div>

                        {/* Start date + budget */}
                        <div className="mb-4 row g-2">
                        <div className="col-md-6">
                            <input 
                                type="date" 
                                className={`form-control ${errors.desiredStartDate ? "is-invalid" : ""}`}
                                min={minDate}
                                max={maxDate}
                                {...register("desiredStartDate")} />
                            {errors.desiredStartDate && (
                                <div className="invalid-feedback">{errors.desiredStartDate.message}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <select 
                                className={`form-select ${errors.budgetRangeId ? "is-invalid" : ""}`} 
                                {...register("budgetRangeId", {valueAsNumber: true})}>
                            <option value={0} disabled>Select Budget Range</option>
                            {budgetRanges.map((range) => (
                                <option key={range.id} value={range.id}>
                                    {range.description}
                                </option>
                            ))}
                            </select>
                            {errors.budgetRangeId && <div className="invalid-feedback">{errors.budgetRangeId.message}</div>}
                        </div>
                        </div>

                        <div className="d-grid gap-2">
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg mt-5"
                            disabled={isSubmitting || submitQuoteRequest.isPending}>
                                {submitQuoteRequest.isPending ? "Submitting..." : "Submit"}
                        </button>
                        </div>
                        
                    </form>
                    </div>
                </div>

                </div>
            </div>
        </section>
    </>
  )
}
