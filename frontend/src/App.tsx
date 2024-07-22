import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Toaster, toast } from "sonner";

type FormValues = {
  name: string;
  email: string;
  profileImg?: File[];
  resume?: File[];
  file?: File[];
};

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const formData = new FormData();

      // Separate file inputs
      if (data.profileImg && data.profileImg.length > 0) {
        formData.append("profileImg", data.profileImg[0]);
      }

      if (data.resume && data.resume.length > 0) {
        formData.append("resume", data.resume[0]);
      }

      if (data.file && data.file.length > 0) {
        formData.append("file", data.file[0]);
      }

      // Create body object without file inputs
      const { profileImg, resume, file, ...body } = data;

      formData.append("bodyMain", JSON.stringify(body));

      console.log("data>>>>>>>>>>>", data);
      console.log("body>>>>>>>>>>>", body);

      // Log formData entries
      console.log("formData logs:");

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      //implementation 1 
      //  toast.promise(
      //   new Promise(async (resolve, reject) => {
      //     try {

      //       await delay(3000);

      //       const response = await axios.post(`http://localhost:4000/form-upload`, formData);
      //       if (response) {
      //         resolve(response);
      //       } else {
      //         reject(new Error("No response received"));
      //       }
      //     } catch (error) {
      //       reject(error);
      //     }
      //   }),
      //   {
      //     loading: 'Submitting...',
      //     success: 'Form submitted successfully!',
      //     error: 'Error submitting form!',
      //   }
      // );


      //implementation 2 
      let toastId;
      try {
        // Show loading toast
        toastId = toast.loading("Submitting...");

        // Simulate a delay
        await delay(2000);

        const response = await axios.post(
          `http://localhost:4000/form-upload`,
          formData
        );
        if (response) {
          // Update toast to success
          toast.success("Form submitted successfully!", { id: toastId });
        } else {
          throw new Error("No response received");
        }
      } catch (error) {
        // Update toast to error
        toast.error("Error submitting form!", { id: toastId });
        console.log("Error in frontend onSubmit", error);
      }
    } catch (err) {
      console.log("err in frontend onsubmit", err);

      toast.error("an error occured");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">My Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="profileImg"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Image (.png, .jpeg, .jpg )
          </label>
          <input
            id="profileImg"
            type="file"
            {...register("profileImg")}
            className="mt-1 block w-full text-gray-700"
          />
          {errors.profileImg && (
            <p className="mt-2 text-sm text-red-600">
              {errors.profileImg.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-gray-700"
          >
            Resume (.pdf, .docx)
          </label>
          <input
            id="resume"
            type="file"
            {...register("resume")}
            className="mt-1 block w-full text-gray-700"
          />
          {errors.resume && (
            <p className="mt-2 text-sm text-red-600">{errors.resume.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-gray-700"
          >
            Img (.png, .jpeg, .jpg )
          </label>
          <input
            id="file"
            type="file"
            {...register("file")}
            className="mt-1 block w-full text-gray-700"
          />
          {errors.file && (
            <p className="mt-2 text-sm text-red-600">{errors.file.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
      <Toaster richColors={true} />
    </div>
  );
};

export default App;
