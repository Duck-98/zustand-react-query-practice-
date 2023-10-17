export function Spinner() {
  return (
    <div className="h-screen">
      <div className="flex justify-center items-center mt-52">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-red-300"></div>
      </div>
    </div>
  );
}
