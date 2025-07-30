export default function FileUploadButton({ fileName, register }) {
  return (
    <>
      <label
        htmlFor="resume-upload"
        className="bg-blue-500 rounded-full p-5 cursor-pointer"
      >
        {fileName ? (
          <i className="bi bi-file-earmark-check-fill text-2xl"></i>
        ) : (
          <i className="bi bi-upload text-2xl"></i>
        )}
      </label>

      <input
        id="resume-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        {...register("resume")}
      />
    </>
  );
}
